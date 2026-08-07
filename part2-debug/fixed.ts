import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
const db = admin.firestore();

interface BookingRequest {
  studentId: string;
  teacherId: string;
  slot: string; // ISO datetime string
  subject: string;
}

export const bookSession = functions.https.onCall(async (data: BookingRequest, context) => {
  // BUG 3 FIX (Security): The original function had no auth check at all — any
  // caller, authenticated or not, could invoke this and create a booking under
  // any studentId, impersonating another student. In production this would let
  // one user book sessions (or spam/DoS the schedule) as someone else entirely.
  // We now require the caller to be signed in, and require the studentId in the
  // payload to match the caller's own uid — never trust a client-supplied identity.
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be signed in to book a session."
    );
  }
  if (context.auth.uid !== data.studentId) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "You can only book sessions for your own account."
    );
  }

  // BUG 4 FIX (Typing): `data: BookingRequest` is a compile-time-only TypeScript
  // type — it gives zero runtime guarantee. Cloud Functions receive raw JSON over
  // the wire, so a malformed or malicious client could send missing fields, wrong
  // types, or a garbage date string, and the original code would proceed straight
  // into Firestore writes with corrupt data. We validate every field at runtime
  // before doing anything else.
  const { studentId, teacherId, slot, subject } = data;
  if (
    typeof studentId !== "string" || !studentId ||
    typeof teacherId !== "string" || !teacherId ||
    typeof slot !== "string" || !slot ||
    typeof subject !== "string" || !subject
  ) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "studentId, teacherId, slot, and subject are all required strings."
    );
  }
  const slotDate = new Date(slot);
  if (isNaN(slotDate.getTime())) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "slot must be a valid ISO datetime string."
    );
  }

  const booking = {
    studentId,
    teacherId,
    slot,
    subject,
    status: "confirmed",
    createdAt: new Date(),
  };

  // BUG 2 FIX (Logic): The original check queried a SUBCOLLECTION
  // (teachers/{teacherId}/bookings) while the write went to a completely
  // different TOP-LEVEL collection (bookings). The two paths never overlapped,
  // so the "already booked" check could never actually trigger — double-booking
  // was always possible even before the async bug is considered. We now read
  // and write the SAME collection, filtered by both teacherId and slot so the
  // check is scoped correctly per teacher.
  const bookingsRef = db.collection("bookings");

  // BUG 1 FIX (Async/await): `.get()` returns a Promise and was never awaited,
  // and the outer function wasn't declared `async`. This meant `existing` was a
  // Promise object, not real query data — `existing.docs` was `undefined`, and
  // `.length` on that threw a runtime TypeError on every call. `.add()` had the
  // same problem: it fired the write but the function could return before that
  // write actually completed, risking a false "success" response. Both calls are
  // now properly awaited inside an async function.
  const existingSnapshot = await bookingsRef
    .where("teacherId", "==", teacherId)
    .where("slot", "==", slot)
    .get();

  if (!existingSnapshot.empty) {
    return { success: false, message: "Slot already booked" };
  }

  await bookingsRef.add(booking);

  return { success: true };
});
