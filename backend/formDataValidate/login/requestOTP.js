const { z } = require("zod");

const requestOTPSchema = z.object({
  phNo: z
    .string({ required_error: "Phone is required" })
    .trim()
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" }),
});

module.exports = requestOTPSchema;
