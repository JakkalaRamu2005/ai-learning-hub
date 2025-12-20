import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/db/models/User.model";
import { Course } from "@/lib/db/models";
import { Enrollment } from "@/lib/db/models";
import { requireAdmin } from "@/lib/utils/auth";
import { successResponse, asyncHandler } from "@/lib/utils/api-response";

/**
 * GET /api/admin/stats
 * Get dashboard statistics (Admin only)
 */
export const GET = asyncHandler(async (req: NextRequest) => {
    // Require admin role
    await requireAdmin();

    await connectDB();

    // Get date range from query params
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30"; // days
    const daysAgo = parseInt(range);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Parallel queries for better performance
    const [
        totalUsers,
        newUsers,
        totalCourses,
        publishedCourses,
        totalEnrollments,
        newEnrollments,
        completedCourses,
        usersByRole,
        recentUsers,
        topCourses,
    ] = await Promise.all([
        // Total users
        User.countDocuments(),

        // New users in date range
        User.countDocuments({ createdAt: { $gte: startDate } }),

        // Total courses
        Course.countDocuments(),

        // Published courses
        Course.countDocuments({ publishStatus: "published" }),

        // Total enrollments
        Enrollment.countDocuments(),

        // New enrollments in date range
        Enrollment.countDocuments({ enrolledAt: { $gte: startDate } }),

        // Completed courses
        Enrollment.countDocuments({ isCompleted: true }),

        // Users by role
        User.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 },
                },
            },
        ]),

        // Recent users (last 5)
        User.find()
            .select("name email role createdAt isVerified")
            .sort({ createdAt: -1 })
            .limit(5)
            .lean(),

        // Top courses by enrollment
        Course.aggregate([
            {
                $sort: { enrollmentCount: -1 },
            },
            {
                $limit: 5,
            },
            {
                $project: {
                    title: 1,
                    category: 1,
                    enrollmentCount: 1,
                    completionCount: 1,
                    difficulty: 1,
                },
            },
        ]),
    ]);

    // Calculate completion rate
    const completionRate =
        totalEnrollments > 0
            ? ((completedCourses / totalEnrollments) * 100).toFixed(2)
            : 0;

    // Format users by role
    const roleDistribution = {
        user: 0,
        admin: 0,
        instructor: 0,
    };

    usersByRole.forEach((item: any) => {
        roleDistribution[item._id as keyof typeof roleDistribution] = item.count;
    });

    // Calculate growth rates
    const userGrowthRate =
        totalUsers > 0 ? ((newUsers / totalUsers) * 100).toFixed(2) : 0;

    const enrollmentGrowthRate =
        totalEnrollments > 0
            ? ((newEnrollments / totalEnrollments) * 100).toFixed(2)
            : 0;

    return successResponse({
        overview: {
            totalUsers,
            newUsers,
            userGrowthRate: `${userGrowthRate}%`,
            totalCourses,
            publishedCourses,
            draftCourses: totalCourses - publishedCourses,
            totalEnrollments,
            newEnrollments,
            enrollmentGrowthRate: `${enrollmentGrowthRate}%`,
            completedCourses,
            completionRate: `${completionRate}%`,
        },
        roleDistribution,
        recentUsers,
        topCourses,
        dateRange: {
            from: startDate.toISOString(),
            to: new Date().toISOString(),
            days: daysAgo,
        },
    });
});
