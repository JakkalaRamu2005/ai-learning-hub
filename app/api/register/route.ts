import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/db/models";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
    try {
        await connectDB();

        const { name, email, password } = await request.json();



        if (!name || !email || !password) {
            return NextResponse.json({ message: "Please fill all the fields" }, { status: 400 });
        }


        if (!email.includes("@")) {
            return NextResponse.json({ message: "Please enter valid email" }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 })
        }

        const existing = await User.findOne({ email });

        if (existing) {
            return NextResponse.json({ message: "Email already exists" }, { status: 400 });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: "24h" })
        const newUser = await User.create({ name, email, password: hashedPassword, verificationToken });





        const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/verify-email?token=${verificationToken}`;
        const emailSent = await sendVerificationEmail(email, verificationLink)



        if (!emailSent) {
            return NextResponse.json({ message: "User created but verification email failed, Please try again." }, { status: 500 })
        }
        return NextResponse.json({ message: "user registered successfullly! Check your emailt to verify your account.", user: { name: newUser.name, email: newUser.email } }, { status: 201 });

    } catch (error) {
        console.log("Server Error:", error);
        return NextResponse.json({ message: "Something went wrong", error }, { status: 500 })
    }

}
