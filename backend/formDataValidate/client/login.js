const { z } = require('zod');


const clientloginSchema=z.object({
    email: z
    .email({ message: "Invalid email address" })
    .trim(),
    
    password:z
    .string({required_error:"Password is required"})
    .trim()
})

module.exports = { clientloginSchema };