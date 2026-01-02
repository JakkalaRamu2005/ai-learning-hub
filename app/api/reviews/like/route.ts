import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Review } from "@/lib/db/models";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Login to like reviews" }, { status: 401 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwt.verify(token, JWT_SECRET);
        const { reviewId } = await req.json();

        if (!reviewId) {
            return NextResponse.json({ message: "Review ID required" }, { status: 400 });
        }

        const review = await Review.findById(reviewId);
        if (!review) {
            return NextResponse.json({ message: "Review not found" }, { status: 404 });
        }

        const userId = decoded.id;
        const likeIndex = review.likes.indexOf(userId);

        let liked = false;
        if (likeIndex === -1) {
            review.likes.push(userId);
            liked = true;
        } else {
            review.likes.splice(likeIndex, 1);
        }

        await review.save();

        return NextResponse.json({
            success: true,
            liked,
            likesCount: review.likes.length
        });
    } catch (error) {
        console.error("Like review error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
