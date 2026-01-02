import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Tool } from "@/lib/db/models";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();

        // Fetch tools with average ratings and review counts using aggregation
        const toolsDB = await Tool.aggregate([
            {
                $lookup: {
                    from: "reviews", // Collection name of reviews
                    localField: "_id",
                    foreignField: "tool",
                    as: "reviews",
                },
            },
            {
                $addFields: {
                    averageRating: { $avg: "$reviews.rating" },
                    reviewCount: { $size: "$reviews" },
                },
            },
            { $sort: { createdAt: -1 } },
            { $unset: "reviews" } // Remove the temporary reviews array
        ]);

        // Map DB fields to frontend-expected field names
        const tools = toolsDB.map((t: any) => ({
            _id: t._id.toString(),
            name: t.tool || t.name || "",
            category: t.category || "",
            description: t.description || "",
            link: t.url || t.link || "",
            pricing: t.pricing || "",
            weekAdded: t.week || t.weekAdded || "",
            averageRating: t.averageRating ? Number(t.averageRating.toFixed(1)) : 0,
            reviewCount: t.reviewCount || 0,
            createdAt: t.createdAt
        }));

        return NextResponse.json({
            success: true,
            tools,
            total: tools.length
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching tools from DB:", error);
        return NextResponse.json({
            success: false,
            tools: [],
            message: "Error fetching data"
        }, { status: 500 });
    }
}
