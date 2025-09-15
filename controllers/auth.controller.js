import bcrypt from "bcryptjs";
import User from '../model/user.js';

export const SignUp = async( req, res, next)=>{
    try{
        const {User_Name,Password} = req.body;
        const existingUser = await User.findOne({User_Name});
        if(existingUser){
            return res.status(400).json({message:'User alredy registered'});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const newUser = await User.create({User_Name,Password:hashedPassword});
        return res.status(201).json({message:'user created ', newUser});
    } catch(error){
        next(error)
    }
};

export const SignIn = async(req,res,next)=>{
    try{
        const {User_Name,Password} = req.body;
        const existingUser = await User.findOne({ where: { User_Name } });
        if(!existingUser){
            return res.status(404).json({message:'User not exist'});
        }
         const isPasswordValid = await bcrypt.compare(Password, existingUser.Password);
    if(!isPasswordValid){
        return res.status(401).json({ message: "Invalid password" });
        
    }
    return res.status(200).json({message:'login Successfully',existingUser});
    } catch(error){
        next(error)
    }
}