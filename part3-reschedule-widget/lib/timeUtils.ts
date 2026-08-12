
const LOCKOUT_WINDOW_MS = 2 * 60 * 60 * 1000; // 2 hours, in milliseconds


export function isWithinLockoutWindow(
  slotUtcIso: string,
  now: Date = new Date()
): boolean {
  const slotTime = new Date(slotUtcIso).getTime();
  const nowTime = now.getTime();
  return slotTime - nowTime < LOCKOUT_WINDOW_MS;
}


export function getMinAllowedLocalDatetimeValue(now: Date = new Date()): string {
  const earliest = new Date(now.getTime() + LOCKOUT_WINDOW_MS);
  return toDatetimeLocalValue(earliest);
}


function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}


export function localInputValueToUtcIso(localDatetimeValue: string): string {
  const localDate = new Date(localDatetimeValue);
  return localDate.toISOString();
  // return localDate.toString();
}


export function formatUtcAsLocalDisplay(utcIso: string): string {
  const date = new Date(utcIso);
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}