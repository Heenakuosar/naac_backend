const httpstatusConstant = require("../constant/httpstatus.constant");
const { getToken } = require("../middleware/auth.middleware");
const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");

const Login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        console.log("login req body:",req.body);
        if(!email){
            return res.status(httpstatusConstant.BAD_REQUEST).json({
                success:false,
                message:"Email is required"
            })
        }
        if(!password){
            return res.status(httpstatusConstant.BAD_REQUEST).json({
                success:false,
                message:"Password is required"
            })
        }
        const user=await UserModel.findOne({email:email});
        if(!user){
            return res.status(httpstatusConstant.NOT_FOUND).json({
                success:false,
                message:"User not found"
            })
        }
        
        const hashedPassword=user.password;
        const isPasswordMatch=await bcrypt.compare(password,hashedPassword);
        if(!isPasswordMatch){
            return res.status(httpstatusConstant.UNAUTHORIZED).json({
                success:false,
                message:"Invalid credentials"
            })
        }
        const token=await getToken(user);
        return res.status(httpstatusConstant.OK).json({
            success:true,
            message:"User login successful",
            data:{
                user:user,
                token:token,
            }
        })
    }catch(error){
        console.log("error while login:",error);
        return res.status(httpstatusConstant.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:"Something went wrong",
            error: error.message,
        })
    }
}

const Register=async(req,res)=>{
    try{
        const {username,email,password,role}=req.body;
        if(!email){
            return res.status(httpstatusConstant.BAD_REQUEST).json({
                success:false,
                message:"Email is required"
            })
        }
        if(!password){
            return res.status(httpstatusConstant.BAD_REQUEST).json({
                success:false,
                message:"Password is required"
            })
        }
        const existingUser=await UserModel.findOne({email:email});
        if(existingUser){
            return res.status(httpstatusConstant.CONFLICT).json({
                success:false,
                message:"User already exists"
            })
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=new UserModel({
            username:username,
            email:email,
            password:hashedPassword,
            role:role,
        });
        await newUser.save();
        return res.status(httpstatusConstant.CREATED).json({
            success:true,
            message:"User registered successfully",
            data:newUser,
        })
    }catch(error){
        console.log("error while register:",error);
        return res.status(httpstatusConstant.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:"Something went wrong",
            error: error.message,
        })
    }
}

module.exports={
    Login,
    Register,
}