const mongoose  = require('mongoose');


async function getBidNo(){
    const result = await mongoose.connection.db.collection('counter').findOneAndUpdate(
        
        {_id:'bidNo'},
        {$inc:{'count':1}},
        
    )
    return result.count;
}

module.exports=getBidNo;