"use client";

import { useState } from "react";
import { mockSessions } from "@/lib/mockData";
import SessionCard from "@/components/SessionCard";

export default function SessionsPage() {
  const [sessions] = useState(mockSessions.slice(0, 3));

  function handleRescheduleSuccess(sessionId: string) {
    console.log(`Reschedule requested for session ${sessionId}`);
  }

  return (
    <main className="sessions-page">
      <section className="sessions-page__shell">
        <div className="sessions-page__topbar">
          <div>
            <div className="sessions-page__badge">Learning Dashboard</div>
            <h1 className="sessions-page__title">Upcoming Sessions</h1>
            <p className="sessions-page__subtitle">
              Manage your next tutoring sessions.
            </p>
          </div>
        </div>

        {sessions.length === 0 ? (
          <p>No upcoming sessions.</p>
        ) : (
          <div className="sessions-page__list">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onRescheduleSuccess={handleRescheduleSuccess}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}