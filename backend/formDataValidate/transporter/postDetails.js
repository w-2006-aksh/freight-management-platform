const { z } = require("zod");

const vehicleNumberRegex =
  /^[A-Z]{2}[ -]?[0-9]{2}[ -]?[A-Z]{1,2}[ -]?[0-9]{4}$/;
const bhSeries = /^[0-9]{2}BH[0-9]{4}[A-Z]{1,2}$/;

const postDetailsSchema = z
  .object({
    driverName: z
      .string({ required_error: 'The field "Driver Name" cannot be empty' })
      .trim()
      .min(3, { message: "Name must be atleast 3 characters" })
      .regex(/^[a-zA-Z\s]+$/, { message: "Name must have only characters" }),

    driverPhNo: z
      .string({ required_error: "Phone is required" })
      .trim()
      .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" }),

    vehicleNo: z
      .string({
        required_error: "Vehicle Number cannot be empty",
      })
      .trim()
      .transform((val) => val.toUpperCase()),
  })
  .refine(
    (data) =>
      bhSeries.test(data.vehicleNo) || vehicleNumberRegex.test(data.vehicleNo),
    { message: "Incorrect vehicle number format!" }
  );

module.exports = postDetailsSchema;
