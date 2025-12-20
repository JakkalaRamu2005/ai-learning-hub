import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/db/models/User.model";
import { requireAdmin } from "@/lib/utils/auth";
import {
    successResponse,
    errorResponse,
    notFoundResponse,
    asyncHandler,
} from "@/lib/utils/api-response";

/**
 * GET /api/admin/users
 * Get all users (Admin only)
 */
export const GET = asyncHandler(async (req: NextRequest) => {
    // Require admin role
    await requireAdmin();

    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    const query: any = {};

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }

    if (role && role !== "all") {
        query.role = role;
    }

    // Count total documents
    const total = await User.countDocuments(query);

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Fetch users
    const users = await User.find(query)
        .select("-password -verificationToken -resetPasswordToken")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    return successResponse({
        users,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    });
});

/**
 * PATCH /api/admin/users
 * Update user (Admin only)
 */
export const PATCH = asyncHandler(async (req: NextRequest) => {
    // Require admin role
    await requireAdmin();

    await connectDB();

    const body = await req.json();
    const { userId, updates } = body;

    if (!userId) {
        return errorResponse("User ID is required", 400);
    }

    // Prevent updating sensitive fields directly
    const allowedUpdates = [
        "name",
        "role",
        "permissions",
        "isVerified",
        "place",
        "bio",
    ];

    const updateData: any = {};
    Object.keys(updates).forEach((key) => {
        if (allowedUpdates.includes(key)) {
            updateData[key] = updates[key];
        }
    });

    const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
    }).select("-password -verificationToken -resetPasswordToken");

    if (!user) {
        return notFoundResponse("User not found");
    }

    return successResponse(user, "User updated successfully");
});

/**
 * DELETE /api/admin/users
 * Delete user (Admin only)
 */
export const DELETE = asyncHandler(async (req: NextRequest) => {
    // Require admin role
    await requireAdmin();

    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return errorResponse("User ID is required", 400);
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
        return notFoundResponse("User not found");
    }

    return successResponse(null, "User deleted successfully");
});
