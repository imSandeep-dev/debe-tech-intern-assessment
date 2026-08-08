"use client";

import { useState } from "react";
import { formatUtcAsLocalDisplay } from "../lib/timeUtils";
import RescheduleForm from "./RescheduleForm";
import { TutoringSession } from "@/type";

interface SessionCardProps {
  session: TutoringSession;
  onRescheduleSuccess: (sessionId: string) => void;
}

export default function SessionCard({
  session,
  onRescheduleSuccess,
}: SessionCardProps) {
  const [showForm, setShowForm] = useState(false);
  const [justRequested, setJustRequested] = useState(false);

  function handleSuccess() {
    setShowForm(false);
    setJustRequested(true);
    onRescheduleSuccess(session.id);
  }

  return (
    <div className="session-card">
      <div className="session-card__details">
        <h3>{session.subject}</h3>
        <p>{session.teacherName}</p>
        <p>{formatUtcAsLocalDisplay(session.datetimeUtc)}</p>
        <p className="session-card__status">{session.status}</p>
      </div>

      {justRequested ? (
        <p className="session-card__confirmation">Reschedule request sent.</p>
      ) : showForm ? (
        <RescheduleForm
          session={session}
          onSuccess={handleSuccess}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <button onClick={() => setShowForm(true)}>Request Reschedule</button>
      )}
    </div>
  );
}