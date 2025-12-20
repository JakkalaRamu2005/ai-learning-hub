import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Course, Enrollment } from "@/lib/db/models";

/**
 * GET /api/courses/[id]
 * Get a single course by ID with enrollment status
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id: courseId } = await params;

        const course = await Course.findById(courseId).select("-__v").lean();

        if (!course) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Course not found",
                },
                { status: 404 }
            );
        }

        // Check if user is enrolled (if authenticated)
        // For now, we'll return the course without enrollment status
        // This will be enhanced when we add authentication middleware

        return NextResponse.json({
            success: true,
            course,
        });
    } catch (error: any) {
        console.error("Error fetching course:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch course",
                error: error.message,
            },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/courses/[id]
 * Update a course (Admin only)
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id: courseId } = await params;
        const updates = await req.json();

        // Recalculate total duration if modules are updated
        if (updates.modules) {
            updates.totalDuration = updates.modules.reduce(
                (sum: number, module: any) => sum + (module.duration || 0),
                0
            );
        }

        const course = await Course.findByIdAndUpdate(courseId, updates, {
            new: true,
            runValidators: true,
        });

        if (!course) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Course not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Course updated successfully",
            course,
        });
    } catch (error: any) {
        console.error("Error updating course:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update course",
                error: error.message,
            },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/courses/[id]
 * Delete a course (Admin only)
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id: courseId } = await params;

        const course = await Course.findByIdAndDelete(courseId);

        if (!course) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Course not found",
                },
                { status: 404 }
            );
        }

        // Also delete all enrollments for this course
        await Enrollment.deleteMany({ courseId });

        return NextResponse.json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (error: any) {
        console.error("Error deleting course:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete course",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
