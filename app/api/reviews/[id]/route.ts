import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Review } from "@/lib/db/models";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwt.verify(token, JWT_SECRET);
        const { comment, rating } = await req.json();

        const { id } = await params;

        const review = await Review.findById(id);
        if (!review) {
            return NextResponse.json({ message: "Review not found" }, { status: 404 });
        }

        if (review.user.toString() !== decoded.id) {
            return NextResponse.json({ message: "Unauthorized to edit this review" }, { status: 403 });
        }

        review.comment = comment;
        review.rating = rating;
        await review.save();

        return NextResponse.json({ success: true, review });
    } catch (error) {
        console.error("PUT Review error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwt.verify(token, JWT_SECRET);

        const { id } = await params;

        const review = await Review.findById(id);
        if (!review) {
            return NextResponse.json({ message: "Review not found" }, { status: 404 });
        }

        if (review.user.toString() !== decoded.id) {
            return NextResponse.json({ message: "Unauthorized to delete this review" }, { status: 403 });
        }

        await Review.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE Review error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
