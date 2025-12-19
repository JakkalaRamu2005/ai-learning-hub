import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/db/models";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const { toolId } = await req.json();

        const user = await User.findById(decoded.id);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (user.savedTools.includes(toolId)) {
            user.savedTools = user.savedTools.filter((id: string) => id !== toolId);
            await user.save();
            return NextResponse.json({ message: "Tool removed", saved: false });
        } else {
            user.savedTools.push(toolId);
            await user.save();
            return NextResponse.json({ message: "Tool saved", saved: true });
        }

    } catch (error) {
        console.log("Save tool error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
