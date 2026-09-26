import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/integrations/firebase/client";

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  department: string | null;
  year: string | null;
};

type AuthState = {
  loading: boolean;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

async function loadUserContext(user: User) {
  const [profileSnapshot, adminSnapshot] = await Promise.all([
    getDoc(doc(db, "users", user.uid)),
    getDoc(doc(db, "admins", user.uid)),
  ]);
  const data = profileSnapshot.data();
  return {
    profile: {
      id: user.uid,
      full_name: data?.full_name ?? user.displayName ?? "",
      email: user.email ?? "",
      department: data?.department ?? null,
      year: data?.year ?? null,
    },
    isAdmin: adminSnapshot.exists() && adminSnapshot.data().enabled === true,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!active) return;
      setUser(nextUser);
      if (!nextUser) {
        setProfile(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      try {
        const context = await loadUserContext(nextUser);
        if (active) {
          setProfile(context.profile);
          setIsAdmin(context.isAdmin);
        }
      } catch {
        if (active) {
          setProfile({
            id: nextUser.uid,
            full_name: nextUser.displayName ?? "",
            email: nextUser.email ?? "",
            department: null,
            year: null,
          });
          setIsAdmin(false);
        }
      } finally {
        if (active) setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      loading,
      user,
      profile,
      isAdmin,
      refreshProfile: async () => {
        if (!user) {
          setProfile(null);
          setIsAdmin(false);
          return;
        }
        const context = await loadUserContext(user);
        setProfile(context.profile);
        setIsAdmin(context.isAdmin);
      },
    }),
    [loading, user, profile, isAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
