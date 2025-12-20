/**
 * Migration Script: Create First Admin User
 * 
 * This script helps you create the first admin user for your application.
 * Run this once to set up your admin account.
 * 
 * Usage:
 *   node scripts/create-admin.js
 */

const mongoose = require("mongoose");
const readline = require("readline");

// MongoDB connection string from environment
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ai-learning-hub";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function question(query) {
    return new Promise((resolve) => rl.question(query, resolve));
}

async function createAdmin() {
    try {
        console.log("\n🚀 AI Learning Hub - Create Admin User\n");

        // Connect to MongoDB
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB\n");

        // Get user email
        const email = await question("Enter admin email: ");

        if (!email || !email.includes("@")) {
            console.log("❌ Invalid email address");
            process.exit(1);
        }

        // Check if user exists
        const User = mongoose.connection.collection("users");
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            console.log(`❌ User with email "${email}" not found.`);
            console.log("Please register an account first, then run this script again.");
            process.exit(1);
        }

        // Update user to admin
        const result = await User.updateOne(
            { email },
            {
                $set: {
                    role: "admin",
                    permissions: [],
                },
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`\n✅ Successfully made "${email}" an admin!`);
            console.log("\nYou can now:");
            console.log("1. Login to your account");
            console.log("2. Navigate to /admin");
            console.log("3. Access the admin dashboard\n");
        } else {
            console.log(`\n⚠️  User "${email}" is already an admin or no changes were made.`);
        }
    } catch (error) {
        console.error("\n❌ Error:", error.message);
    } finally {
        rl.close();
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
        process.exit(0);
    }
}

createAdmin();
