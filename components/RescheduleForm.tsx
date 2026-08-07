"use client";

import { useState } from "react";
import {
  getMinAllowedLocalDatetimeValue,
  isWithinLockoutWindow,
  localInputValueToUtcIso,
} from "../lib/timeUtils";
import { requestReschedule } from "../lib/requestReschedule";
import { RescheduleReason, TutoringSession } from "@/type";

const REASONS: RescheduleReason[] = ["Conflict", "Illness", "Time zone", "Other"];

interface RescheduleFormProps {
  session: TutoringSession;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function RescheduleForm({
  session,
  onSuccess,
  onCancel,
}: RescheduleFormProps) {
  const [localDatetime, setLocalDatetime] = useState("");
  const [reason, setReason] = useState<RescheduleReason>("Conflict");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const minAllowed = getMinAllowedLocalDatetimeValue();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!localDatetime) {
      setError("Please choose a new date and time.");
      return;
    }

    const newSlotUtc = localInputValueToUtcIso(localDatetime);

    if (isWithinLockoutWindow(newSlotUtc)) {
      setError("Reschedule requests must be made at least 2 hours in advance.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await requestReschedule({
        sessionId: session.id,
        newSlotUtc,
        currentSlotUtc: session.datetimeUtc,
        reason,
      });

      if (!result.success) {
        setError(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      onSuccess();
    } catch (err) {
      setError("Unable to reach the server. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="reschedule-form">
      <label className="reschedule-form__label">
        New date &amp; time
        <input
          type="datetime-local"
          value={localDatetime}
          min={minAllowed}
          onChange={(e) => setLocalDatetime(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </label>

      <label className="reschedule-form__label">
        Reason
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value as RescheduleReason)}
          disabled={isSubmitting}
        >
          {REASONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="reschedule-form__error">{error}</p>}

      <div className="reschedule-form__actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>
        <button type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}