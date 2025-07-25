const { z } = require('zod');


const postABidSchema=z.object({

    from:z.
    string({required_error:'The field "From" cannot be empty'})
    .trim()
    .nonempty({message:'The field "From" cannot be empty'}),

    to:z.
    string({required_error:'The field "To" cannot be empty'})
    .trim()
    .nonempty({message:'The field "To" cannot be empty'}),

    commodity:z
    .string({required_error:"Commodity is required"})
    .trim()
    .nonempty({message:'The field "Commodity" cannot be empty'}),


    
    startDate:z
    .string({required_error:"Start date cannot be empty"})
    .refine(val=> new Date(val) > new Date(),{
        message:"Start Date must be in the future"
    }),

    endDate:z
    .string({required_error:"End date cannot be empty"})
    .refine(val=> new Date(val) > new Date(),{
        message:"End Date must be after Start Date"
    }),

    load:z
    .number()
    .refine(val => val>0, {message:"Load must be positive!"})

})
.refine(data=>new Date(data.endDate) >= new Date(data.startDate),{message:"End date cannot be before start date!"});

module.exports = { postABidSchema };