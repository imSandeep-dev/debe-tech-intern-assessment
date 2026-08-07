export type RescheduleReason = "Conflict" | "Illness" | "Time zone" | "Other";

export interface TutoringSession {
  id: string;
  subject: string;
  teacherName: string;
  datetimeUtc: string;
  status: "upcoming" | "reschedule_requested" | "completed" | "cancelled";
}

export interface RescheduleRequest {
  sessionId: string;
  newSlotUtc: string;
  currentSlotUtc: string;
  reason: RescheduleReason;
}

export interface RescheduleResponse {
  success: boolean;
  error?: string;
}