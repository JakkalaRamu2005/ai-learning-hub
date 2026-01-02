import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User, Tool } from "@/lib/db/models";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        const user = await User.findById(decoded.id);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Fetch full tool data for saved tools
        const toolsDB = await Tool.find({ _id: { $in: user.savedTools } }).lean();

        // Map DB fields to frontend-expected field names
        const savedTools = toolsDB.map((t: any) => ({
            _id: t._id.toString(),
            name: t.tool || t.name || "",
            category: t.category || "",
            description: t.description || "",
            link: t.url || t.link || "",
            pricing: t.pricing || "",
            weekAdded: t.week || t.weekAdded || "",
            createdAt: t.createdAt
        }));

        return NextResponse.json({
            success: true,
            savedTools, // Full objects
            savedToolIds: user.savedTools // Raw IDs
        });

    } catch (error) {
        console.error("Fetched saved tools error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
