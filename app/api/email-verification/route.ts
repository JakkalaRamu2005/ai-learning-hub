import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/db/models"
import jwt from "jsonwebtoken"




export async function GET(req: Request) {


    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");

        if (!token) {
            return NextResponse.json({ message: "Verfication token is missing" }, { status: 400 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        const user = await User.findOne({ email: decoded.email });



        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 400 });
        }

        if (user.isVerified) {
            return NextResponse.redirect(new URL("/login?message=already-verified", req.url));
        }


        user.isVerified = true;
        user.verificationToken = "";
        await user.save();


        return NextResponse.json(new URL("/verify-success", req.url))
    } catch (error) {
        console.error("verification error:", error);
        return NextResponse.redirect(new URL("/login?message=verification-failed", req.url))
    }
}
