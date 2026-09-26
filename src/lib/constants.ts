export const DEPARTMENTS = [
  "Computer Science",
  "Engineering",
  "Business & Economics",
  "Education",
  "Health Sciences",
  "Law",
  "Arts & Humanities",
  "Natural Sciences",
  "Other",
] as const;

export const YEARS = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Postgraduate"] as const;

export const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  READ: "Under review",
  REPLIED: "Replied",
};
