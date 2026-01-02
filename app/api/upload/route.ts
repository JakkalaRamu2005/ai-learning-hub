import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@/lib/db/models";
import { connectDB } from "@/lib/db";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
        await connectDB();

        // Get authentication token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized: Please log in" }, { status: 401 });
        }

        // Verify and decode the JWT token
        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!);
        } catch (err) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
        }

        const userId = decoded.id;

        // Parse form data to get the file
        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
        }

        // Convert file to buffer for Cloudinary upload stream
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary using upload_stream
        const uploadResponse: any = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto',
                    folder: 'ai-learning-hub-profiles',
                    public_id: `user_${userId}`,
                    overwrite: true,
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary Upload Error:", error);
                        reject(error);
                    }
                    else resolve(result);
                }
            ).end(buffer);
        });

        // Update the user's profile image URL in MongoDB
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                profileImage: uploadResponse.secure_url,
                image: uploadResponse.secure_url
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Profile image updated successfully',
            imageUrl: uploadResponse.secure_url,
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                profileImage: updatedUser.profileImage
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error('Upload Process Error:', error);
        return NextResponse.json({
            error: error.message || "Failed to upload and update profile image"
        }, { status: 500 });
    }
}
