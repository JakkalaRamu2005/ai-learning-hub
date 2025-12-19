import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import { Enrollment, User, Course } from "@/lib/db/models";

/**
 * PATCH /api/courses/progress
 * Update module completion progress
 */
export async function PATCH(req: NextRequest) {
    try {
        await connectDB();

        // Get authenticated user
        const session = await getServerSession();

        if (!session || !session.user?.email) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized. Please login to update progress.",
                },
                { status: 401 }
            );
        }

        const { courseId, moduleId, completed, timeSpent } = await req.json();

        if (!courseId || !moduleId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Course ID and Module ID are required",
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

        // Find enrollment
        const enrollment = await Enrollment.findOne({
            userId: user._id.toString(),
            courseId,
        });

        if (!enrollment) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You are not enrolled in this course",
                },
                { status: 404 }
            );
        }

        // Find the module in progress array
        const moduleProgress = enrollment.progress.find(
            (p) => p.moduleId === moduleId
        );

        if (!moduleProgress) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Module not found in course",
                },
                { status: 404 }
            );
        }

        // Update module progress
        const wasCompleted = moduleProgress.completed;
        moduleProgress.completed = completed;
        moduleProgress.lastAccessedAt = new Date();

        if (completed && !wasCompleted) {
            moduleProgress.completedAt = new Date();
        }

        if (timeSpent !== undefined && timeSpent > 0) {
            moduleProgress.timeSpent += timeSpent;
            enrollment.totalTimeSpent += timeSpent;

            // Update user's total learning time
            user.totalLearningTime = (user.totalLearningTime || 0) + timeSpent;
        }

        // Update last accessed
        enrollment.lastAccessedAt = new Date();

        // Update learning streak
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastLearningDate = user.lastLearningDate
            ? new Date(user.lastLearningDate)
            : null;

        if (lastLearningDate) {
            lastLearningDate.setHours(0, 0, 0, 0);
            const daysDiff = Math.floor(
                (today.getTime() - lastLearningDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (daysDiff === 1) {
                // Consecutive day
                user.learningStreak = (user.learningStreak || 0) + 1;
            } else if (daysDiff > 1) {
                // Streak broken
                user.learningStreak = 1;
            }
            // If daysDiff === 0, same day, don't change streak
        } else {
            // First time learning
            user.learningStreak = 1;
        }

        user.lastLearningDate = new Date();

        // Save enrollment (this will trigger the pre-save hook to calculate progress)
        await enrollment.save();

        // Check if course is now completed
        if (enrollment.isCompleted && !user.completedCourses.includes(courseId)) {
            user.completedCourses.push(courseId);

            // Update course completion count
            const course = await Course.findById(courseId);
            if (course) {
                course.completionCount += 1;
                await course.save();
            }
        }

        // Save user
        await user.save();

        return NextResponse.json({
            success: true,
            message: enrollment.isCompleted
                ? "🎉 Congratulations! You've completed this course!"
                : "Progress updated successfully",
            enrollment,
            learningStreak: user.learningStreak,
        });
    } catch (error: any) {
        console.error("Error updating progress:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update progress",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
