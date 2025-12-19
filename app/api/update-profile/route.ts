import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"
import { User } from "@/lib/db/models"
import { connectDB } from "@/lib/db";



export async function POST(req: Request) {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return NextResponse.json({ message: "Not logged in" }, { status: 401 });
    }


    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        const { name, place, bio, profileImage } = await req.json();
        const user = await User.findByIdAndUpdate(
            decoded.id, { name, place, bio, profileImage }, { new: true }
        );

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }


        return NextResponse.json({
            message: "profile updated successfully", user: {
                name: user.name,
                email: user.email,
                place: user.place,
                bio: user.bio,
                profileImage: user.profileImage
            }
        });


    } catch (error) {


        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

}
