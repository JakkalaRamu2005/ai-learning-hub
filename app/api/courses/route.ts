import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Course } from "@/lib/db/models";

/**
 * GET /api/courses
 * Get all published courses with optional filters
 */
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const difficulty = searchParams.get("difficulty");
        const search = searchParams.get("search");

        // Build query
        const query: any = { publishStatus: "published" };

        if (category && category !== "All") {
            query.category = category;
        }

        if (difficulty && difficulty !== "All") {
            query.difficulty = difficulty;
        }

        if (search) {
            query.$text = { $search: search };
        }

        const courses = await Course.find(query)
            .sort({ createdAt: -1 })
            .select("-__v")
            .lean();

        return NextResponse.json({
            success: true,
            courses,
            count: courses.length,
        });
    } catch (error: any) {
        console.error("Error fetching courses:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch courses",
                error: error.message,
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/courses
 * Create a new course (Admin only - for now, anyone can create)
 */
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();

        // Validate required fields
        const {
            title,
            description,
            category,
            difficulty,
            modules,
            learningOutcomes,
        } = body;

        if (
            !title ||
            !description ||
            !category ||
            !difficulty ||
            !modules ||
            !learningOutcomes
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing required fields",
                },
                { status: 400 }
            );
        }

        // Calculate total duration
        const totalDuration = modules.reduce(
            (sum: number, module: any) => sum + (module.duration || 0),
            0
        );

        // Create course
        const course = await Course.create({
            ...body,
            totalDuration,
            publishStatus: body.publishStatus || "draft",
        });

        return NextResponse.json(
            {
                success: true,
                message: "Course created successfully",
                course,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error creating course:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to create course",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
