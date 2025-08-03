import { z } from "zod";

export const requestOtpSchema = z.object({
  phNo: z.string().length(10, "Phone number must be exactly 10 digits."),
});
