import { z } from "zod";

export const validateOTPLoginSchema = z.object({
    phNo: z.string().length(10, "Phone number must be 10 digits."),
    OTP: z.string().length(4, "OTP must be 4 digits."),
});
