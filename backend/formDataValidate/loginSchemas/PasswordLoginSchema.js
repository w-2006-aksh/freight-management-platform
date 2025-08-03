import { z } from "zod";

export const validatePasswordLoginSchema = z.object({
  phNo: z.string().length(10, "Phone number must be 10 digits."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});
