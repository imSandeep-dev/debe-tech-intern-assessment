import { TutoringSession } from "@/type";

const now = Date.now();
const HOUR = 60 * 60 * 1000;

export const mockSessions: TutoringSession[] = [
  {
    id: "sess-1",
    subject: "Algebra II",
    teacherName: "Ms. Patel",
    datetimeUtc: new Date(now + 1 * HOUR).toISOString(), // 1 hour from now
    status: "upcoming",
  },
  {
    id: "sess-2",
    subject: "Spoken English",
    teacherName: "Mr. Okafor",
    datetimeUtc: new Date(now + 26 * HOUR).toISOString(), // ~1 day from now
    status: "upcoming",
  },
  {
    id: "sess-3",
    subject: "Chemistry",
    teacherName: "Dr. Chen",
    datetimeUtc: new Date(now + 72 * HOUR).toISOString(), // 3 days from now
    status: "upcoming",
  },
];