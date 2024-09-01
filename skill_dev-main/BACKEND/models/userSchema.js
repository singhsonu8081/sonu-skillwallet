import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:[3,"Name must contain at least three character"],
        maxLength:[30,"Name at most 30 character"],
    },
    email :{
      type:String,
      required:[true,"Please provide your email!"],
      validate:[validator.isEmail,"Please Provide a valid email!"],  
    },
    phone:{
        type:Number,
        required:[true,"Please provide your Phone Number."],
    },
    password:{
        type:String,
        required:[true,"Please Provide password"],
        minLength:[8,"Password must contain at least 8 character"],
        maxLength:[32,"password at most 32 character"],
    },
    role:{
        type:String,
        required:[true,"Please provide your role"],
        enum:["Job Seeker","Employer"],
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
});

// HASHING THE PASSWORD
userSchema.pre("save",async function (next){
    if(!this.isModified("password")){
        next();
    }
    this.password =await bcrypt.hash(this.password,10);
});

// COMPARING PASSWORD 
userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};

// GENERATING A JWT TOKEN FOR AUTHENTICATION
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE,
    });
};


export const User = mongoose.model("User",userSchema);
