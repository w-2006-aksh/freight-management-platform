const { z } = require("zod");

const OTPLoginSchema = z.object({
  phNo: z
    .string({ required_error: "Phone is required" })
    .trim()
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" }),

  OTP: z.string().length(4, "OTP must be 4 digits."),
});

module.exports = OTPLoginSchema;
