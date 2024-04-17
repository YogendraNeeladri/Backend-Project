const mongoose = require('mongoose');

exports.connectdb = async() =>{
    
    mongoose.connect("mongodb+srv://yogiyadav1970:Yogi2004@cluster0.qbi03aq.mongodb.net/logiproject", {
        useNewUrlParser:true,
        useUnifiedTopology:true,
        // useCreateIndex:true
    }).then(() =>{
        console.log("database connection successful");
    }).catch((err) =>{
        console.log(`no connection: ${err.message}`);
    })
}