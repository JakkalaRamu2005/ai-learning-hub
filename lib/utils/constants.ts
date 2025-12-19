/**
 * Utility constants used throughout the application
 */

export const APP_NAME = "AI Learning Hub";

export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 9,
    MAX_PAGE_SIZE: 50,
} as const;

export const TOOL_CATEGORIES = [
    "All",
    "Image Generation",
    "Text Generation",
    "Code Assistant",
    "Video Creation",
    "Audio Tools",
    "Data Analysis",
    "Productivity",
    "Other",
] as const;

export const TOOL_PRICING = ["All", "Free", "Freemium", "Paid", "Trial"] as const;

export const RESOURCE_TYPES = [
    "All",
    "Channel",
    "Free Course",
    "Practice Platform",
    "GitHub Repository",
    "AI Newsletter",
    "eBook",
    "Community",
    "Certification",
] as const;

export const DIFFICULTY_LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"] as const;

export const LEARNING_CATEGORIES = [
    "All",
    "AI for Students",
    "Business AI Automation",
    "AI Developer Track",
    "Prompt Engineering Mastery",
    "Machine Learning",
    "Deep Learning",
    "Natural Language Processing",
    "Computer Vision",
] as const;

export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    VERIFY_EMAIL: "/verify-email",
    PROFILE: "/profile",
    TOOLS: "/tools",
    SAVED_TOOLS: "/saved-tools",
    LEARN: "/learn",
    RESOURCES: "/resources",
} as const;

export const SOCIAL_SHARE_PLATFORMS = [
    {
        name: "WhatsApp",
        icon: "FaWhatsapp",
        color: "#25D366",
        getUrl: (url: string, text: string) =>
            `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    },
    {
        name: "LinkedIn",
        icon: "FaLinkedin",
        color: "#0A66C2",
        getUrl: (url: string, text: string) =>
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
        name: "Twitter",
        icon: "FaTwitter",
        color: "#1DA1F2",
        getUrl: (url: string, text: string) =>
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    },
    {
        name: "Facebook",
        icon: "FaFacebook",
        color: "#1877F2",
        getUrl: (url: string) =>
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
] as const;
