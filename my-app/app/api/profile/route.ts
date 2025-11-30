import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/lib/models/User"
import jwt from "jsonwebtoken"
import {cookies} from "next/headers"


export async function GET(req: Request) {

    await connectDB();

    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {

        return NextResponse.json({ message: "Not logged in" }, { status: 401 });
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const user = await User.findById(decoded.id);

        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 404 });
        }

        return NextResponse.json({
            name: user.name,
            email: user.email,
            place: user.place,
            bio: user.bio,
            profileImage: user.profileImage
        });
    } catch (error) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

}