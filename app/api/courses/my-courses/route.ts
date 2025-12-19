import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import { Course, Enrollment, User } from "@/lib/db/models";

/**
 * GET /api/courses/my-courses
 * Get all courses the user is enrolled in
 */
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        // Get authenticated user
        const session = await getServerSession();

        if (!session || !session.user?.email) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized. Please login to view your courses.",
                },
                { status: 401 }
            );
        }

        // Find user
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status"); // 'active', 'completed', 'all'

        // Build query
        const query: any = { userId: user._id.toString() };

        if (status === "completed") {
            query.isCompleted = true;
        } else if (status === "active") {
            query.isCompleted = false;
        }

        // Get enrollments with course details
        const enrollments = await Enrollment.find(query)
            .sort({ lastAccessedAt: -1 })
            .lean();

        // Fetch course details for each enrollment
        const enrollmentsWithCourses = await Promise.all(
            enrollments.map(async (enrollment) => {
                const course = await Course.findById(enrollment.courseId)
                    .select("-__v")
                    .lean();

                return {
                    ...enrollment,
                    course,
                };
            })
        );

        // Filter out enrollments where course was deleted
        const validEnrollments = enrollmentsWithCourses.filter(
            (e) => e.course !== null
        );

        // Calculate statistics
        const stats = {
            totalEnrolled: validEnrollments.length,
            totalCompleted: validEnrollments.filter((e) => e.isCompleted).length,
            totalInProgress: validEnrollments.filter((e) => !e.isCompleted).length,
            totalTimeSpent: validEnrollments.reduce(
                (sum, e) => sum + e.totalTimeSpent,
                0
            ),
        };

        return NextResponse.json({
            success: true,
            enrollments: validEnrollments,
            stats,
        });
    } catch (error: any) {
        console.error("Error fetching user courses:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch your courses",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
