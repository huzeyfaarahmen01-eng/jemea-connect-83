import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/integrations/firebase/client";

export type Submission = {
  id: string;
  userId: string;
  name: string;
  email: string;
  department: string;
  year: string;
  subject: string | null;
  message: string;
  status: string;
  reply: string | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

type NewSubmission = Omit<
  Submission,
  "id" | "userId" | "status" | "reply" | "createdAt" | "updatedAt"
>;

export type SubmissionStatus = "NEW" | "READ" | "REPLIED";

export type SubmissionDraft = {
  status: SubmissionStatus;
  reply: string;
};

export async function createSubmission(userId: string, submission: NewSubmission) {
  const created = await addDoc(collection(db, "submissions"), {
    ...submission,
    userId,
    subject: submission.subject?.trim() || null,
    email: submission.email.trim(),
    status: "NEW",
    reply: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return created.id;
}

export async function getMySubmissions(userId: string): Promise<Submission[]> {
  const submissionsQuery = query(
    collection(db, "submissions"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(5),
  );
  const snapshot = await getDocs(submissionsQuery);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Submission);
}

export async function getAllSubmissions(): Promise<Submission[]> {
  const submissionsQuery = query(collection(db, "submissions"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(submissionsQuery);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Submission);
}

export async function updateSubmission(id: string, draft: SubmissionDraft) {
  await updateDoc(doc(db, "submissions", id), {
    status: draft.status,
    reply: draft.reply.trim() || null,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteSubmission(id: string) {
  await deleteDoc(doc(db, "submissions", id));
}
