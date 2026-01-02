import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Review, Tool } from "@/lib/db/models";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const toolId = searchParams.get("toolId");

        if (!toolId) {
            return NextResponse.json({ message: "Tool ID is required" }, { status: 400 });
        }

        const reviews = await Review.find({ tool: toolId })
            .populate("user", "name profileImage") // Only get user's name and image
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ success: true, reviews });
    } catch (error) {
        console.error("GET Reviews error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized. Please login." }, { status: 401 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwt.verify(token, JWT_SECRET);
        const { toolId, rating, comment } = await req.json();

        if (!toolId || !rating || !comment) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Check if user already reviewed this tool
        const existingReview = await Review.findOne({ user: decoded.id, tool: toolId });
        if (existingReview) {
            return NextResponse.json({ message: "You have already reviewed this tool" }, { status: 400 });
        }

        const newReview = await Review.create({
            user: decoded.id,
            tool: toolId,
            rating,
            comment,
            likes: [],
        });

        // Fetch user data for the response to avoid extra frontend fetch
        const populatedReview = await Review.findById(newReview._id).populate("user", "name profileImage");

        return NextResponse.json({ success: true, review: populatedReview });
    } catch (error) {
        console.error("POST Review error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
