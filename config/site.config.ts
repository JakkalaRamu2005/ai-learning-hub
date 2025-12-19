/**
 * Site-wide configuration
 * Centralized place for app metadata and constants
 */
export const siteConfig = {
    name: "AI Learning Hub",
    description:
        "Learn AI Free. Master Prompt Engineering. Build Real Projects. Structured learning paths from zero to expert.",
    url: process.env.APP_URL || "http://localhost:3000",
    ogImage: "/og-image.png",
    links: {
        github: "https://github.com/yourusername/ai-learning-hub",
        twitter: "https://twitter.com/yourusername",
    },
    creator: {
        name: "Your Name",
        url: "https://yourwebsite.com",
    },
} as const;

/**
 * Navigation links
 */
export const navLinks = [
    { href: "/", label: "Home" },
    { href: "/tools", label: "AI Tools" },
    { href: "/learn", label: "Learn" },
    { href: "/resources", label: "Resources" },
] as const;

/**
 * Feature flags
 */
export const features = {
    enableGoogleAuth: Boolean(process.env.GOOGLE_CLIENT_ID),
    enableNewsletters: true,
    enableCourses: false, // Future feature
    enableJobBoard: false, // Future feature
} as const;
