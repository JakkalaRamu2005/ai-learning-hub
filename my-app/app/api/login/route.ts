import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export async function POST(request: Request) {
    try {
        await connectDB();

        const { email, password } = await request.json();


        if(!email || !password){
            return NextResponse.json({message: "Please fill all fields"}, {status: 400});
        }



        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if(!user.isVerified){
            return NextResponse.json({message: "Please verify your email before logging in"}, {status: 403})
        };

        



        const isPasswordCorrect = await bcrypt.compare(password, user.password);


        if (!isPasswordCorrect) {
            return NextResponse.json({ message: "Wrong password" }, { status: 400 });
        }

        const token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET!, {expiresIn: "7d"})



        const response = NextResponse.json({message: "Login successful", user:{name: user.name, email: user.email}}, {status: 200})

        response.cookies.set("token", token,{
            httpOnly: false,
            secure: true,
            sameSite:"strict",
            maxAge: 7*24*60*60,
            path:"/",

        })

        return response;
    } catch (error) {
        return NextResponse.json({ message: "something went wrong", error }, { status: 500 });
    }
}