const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:false,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:false,
        default:"user", // Possible values: 'user', 'admin'
    },

},{
    timestamps:true,
})

const UserModel=mongoose.model('User',userSchema);

module.exports=UserModel;