import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/db/models/User.model";
import {
    successResponse,
    errorResponse,
    asyncHandler,
} from "@/lib/utils/api-response";

/**
 * POST /api/admin/setup
 * One-time setup endpoint to create first admin
 * 
 * IMPORTANT: This should be disabled in production after creating your admin
 */
export const POST = asyncHandler(async (req: NextRequest) => {
    await connectDB();

    const { email, role } = await req.json();

    if (!email) {
        return errorResponse("Email is required", 400);
    }

    // Validate role
    const validRoles = ["user", "admin", "instructor"];
    const targetRole = role || "admin";

    if (!validRoles.includes(targetRole)) {
        return errorResponse("Invalid role. Must be: user, admin, or instructor", 400);
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
        return errorResponse(
            `User with email "${email}" not found. Please register first.`,
            404
        );
    }

    // Check if user is already an admin
    if (user.role === targetRole) {
        return errorResponse(`User is already a ${targetRole}`, 400);
    }

    // Update user role
    user.role = targetRole;
    await user.save();

    return successResponse(
        {
            email: user.email,
            name: user.name,
            role: user.role,
        },
        `Successfully updated user to ${targetRole}!`
    );
});

/**
 * GET /api/admin/setup
 * Check if any admin exists
 */
export const GET = asyncHandler(async (req: NextRequest) => {
    await connectDB();

    const adminCount = await User.countDocuments({ role: "admin" });
    const instructorCount = await User.countDocuments({ role: "instructor" });

    return successResponse({
        hasAdmin: adminCount > 0,
        adminCount,
        instructorCount,
        message:
            adminCount === 0
                ? "No admin users found. Use POST to create one."
                : `${adminCount} admin(s) and ${instructorCount} instructor(s) found.`,
    });
});
