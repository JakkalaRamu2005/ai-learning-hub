import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcrypt"

export async function POST(req: Request) {



    try {

        await connectDB();

        const { token, newPassword } = await req.json();


        if (!token || !newPassword) {
            return NextResponse.json({ message: "Please provide all fields" }, { status: 400 });
        }


        if (newPassword < 6) {
            return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });

        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        const user = await User.findById(decoded.id);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        await user.save();
        return NextResponse.json({ message: "Password updated successfully" });

    } catch (error) {
        return NextResponse.json({ message: "Invalid token or expires" }, { status: 400 });
    }

}