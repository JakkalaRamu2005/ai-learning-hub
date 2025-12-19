import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import { Course, Enrollment, User } from "@/lib/db/models";

/**
 * POST /api/courses/enroll
 * Enroll a user in a course
 */
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // Get authenticated user
        const session = await getServerSession();

        if (!session || !session.user?.email) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized. Please login to enroll in courses.",
                },
                { status: 401 }
            );
        }

        const { courseId } = await req.json();

        if (!courseId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Course ID is required",
                },
                { status: 400 }
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

        // Check if course exists
        const course = await Course.findById(courseId);

        if (!course) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Course not found",
                },
                { status: 404 }
            );
        }

        // Check if course is published
        if (course.publishStatus !== "published") {
            return NextResponse.json(
                {
                    success: false,
                    message: "This course is not available for enrollment",
                },
                { status: 400 }
            );
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            userId: user._id.toString(),
            courseId,
        });

        if (existingEnrollment) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You are already enrolled in this course",
                    enrollment: existingEnrollment,
                },
                { status: 400 }
            );
        }

        // Create initial progress for all modules
        const initialProgress = course.modules.map((module) => ({
            moduleId: module.moduleId,
            completed: false,
            timeSpent: 0,
            lastAccessedAt: new Date(),
        }));

        // Create enrollment
        const enrollment = await Enrollment.create({
            userId: user._id.toString(),
            courseId,
            progress: initialProgress,
            totalModules: course.modules.length,
            overallProgress: 0,
            completedModules: 0,
            totalTimeSpent: 0,
        });

        // Update user's enrolled courses
        if (!user.enrolledCourses.includes(courseId)) {
            user.enrolledCourses.push(courseId);
            await user.save();
        }

        // Update course enrollment count
        course.enrollmentCount += 1;
        await course.save();

        return NextResponse.json(
            {
                success: true,
                message: "Successfully enrolled in the course!",
                enrollment,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error enrolling in course:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to enroll in course",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
