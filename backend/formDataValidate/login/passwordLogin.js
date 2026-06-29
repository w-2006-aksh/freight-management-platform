const { z } = require("zod");

const PasswordLoginSchema = z.object({
  phNo: z
    .string({ required_error: "Phone is required" })
    .trim()
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" }),

  password: z.string().min(5, "Password must be at least 5 characters."),
});

module.exports = PasswordLoginSchema;
