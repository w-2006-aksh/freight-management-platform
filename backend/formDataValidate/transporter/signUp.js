const { z } = require("zod");

const transporterSignUpSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(3, { message: "Name must be of atleast 3 characters" })
    .max(255, { message: "Name must not be more than 255 characters" }),

  email: z
    .email({ message: "Invalid email address" })
    .trim()
    .min(3, { message: "Email must be atleast 3 characters" })
    .max(255, { message: "Email must not contain more than 255 characters" }),

  phNo: z
    .string({ required_error: "Phone is required" })
    .trim()
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" }),

  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(5, { message: "Password must be atleast 5 characters" })
    .max(100, { message: "Password must not be more than 100 characters" }),

  gstNo: z
    .string({ required_error: "GST Number is required" })
    .trim()
    .length(15, { message: "GST Number must be exactly 15 characters" })
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
      message: "Invalid GST Number format",
    }),

  address: z
    .string({ required_error: "Address is required" })
    .min(6, { message: "Address must be atleast 6 characters" }),
});

module.exports = transporterSignUpSchema;
