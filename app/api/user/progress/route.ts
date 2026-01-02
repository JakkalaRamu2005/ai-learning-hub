import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select("completedModules");

        return NextResponse.json({ success: true, completedModules: user?.completedModules || [] });
    } catch (error) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwt.verify(token, JWT_SECRET);
        const { moduleId } = await req.json();

        const user = await User.findById(decoded.id);
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const moduleIndex = user.completedModules.indexOf(moduleId);
        if (moduleIndex === -1) {
            user.completedModules.push(moduleId);
        } else {
            user.completedModules.splice(moduleIndex, 1);
        }

        await user.save();
        return NextResponse.json({ success: true, completedModules: user.completedModules });
    } catch (error) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
