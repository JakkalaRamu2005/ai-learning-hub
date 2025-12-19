import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken"
import {sendResetEmail} from "@/lib/email";


export async function POST(req: Request){

await connectDB();

const {email} = await req.json();

const user = await User.findOne({email});

if(!user){
    return NextResponse.json({message: "Email not found"}, {status: 404});
}


const resetToken = jwt.sign({id: user._id}, process.env.JWT_SECRET!, {expiresIn: "15m"});

const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;


const emailSent = await sendResetEmail(email, resetLink);



if(!emailSent){
    return NextResponse.json({message: "Failed to send mail"}, {status: 500});
}



return NextResponse.json({message: "Reset link sent to your email", resetLink});


}