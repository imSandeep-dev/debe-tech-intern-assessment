import { RescheduleRequest, RescheduleResponse } from "@/type";

export async function requestReschedule(
  req: RescheduleRequest
): Promise<RescheduleResponse> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const newSlotDate = new Date(req.newSlotUtc);

  if (isNaN(newSlotDate.getTime())) {
    return { success: false, error: "The requested slot is not a valid date/time." };
  }

  if (newSlotDate.getTime() <= Date.now()) {
    return { success: false, error: "The new slot cannot be in the past." };
  }

  if (req.newSlotUtc === req.currentSlotUtc) {
    return {
      success: false,
      error: "The requested slot is identical to the current session time.",
    };
  }

  return { success: true };
}