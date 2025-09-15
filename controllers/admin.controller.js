import bcrypt from "bcryptjs";
import Admin from "../model/admin.js";

export const CreateAdmin = async( req, res, next)=>{
    try{
        const {User_Name,Password} = req.body;
        const existingUser = await Admin.findOne({User_Name});
        if(existingUser){
            return res.status(400).json({message:'User alredy registered'});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const newUser = await Admin.create({User_Name,Password:hashedPassword});
        return res.status(201).json({message:'user created ', newUser});
    } catch(error){
        next(error)
    }
};

export const AdminLogin = async( req, res, next )=>{
    try{
        const {User_Name,Password} = req.body;
         const existingUser = await Admin.findOne({ where: { User_Name } });
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