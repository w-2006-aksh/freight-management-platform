const mongoose  = require('mongoose');
const quoteSchema = new mongoose.Schema({
    
    bidNo:{
        type:Number,
        ref:'Bid',
        required:true
    },

    transporter:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Transporter',
    },

    quotedPrice:{
        type:Number,
        required:true
    }
    
},{timestamps:true});

const Quote= mongoose.model('quote', quoteSchema);

module.exports = Quote;