export interface Module {
    id: string;
    title: string;
    description: string;
    category: string;
    icon: string;
}

export interface LearningPath {
    id: string;
    title: string;
    description: string;
    modules: Module[];
}

export const learningPaths: LearningPath[] = [
    {
        id: "ai-basics",
        title: "AI Fundamentals",
        description: "Master the core concepts of Artificial Intelligence and Machine Learning.",
        modules: [
            { id: "mod-1", title: "Intro to LLMs", description: "Learn how Large Language Models work.", category: "Foundation", icon: "🧠" },
            { id: "mod-2", title: "Prompt Engineering", description: "Master the art of talking to AI.", category: "Skill", icon: "✍️" },
            { id: "mod-3", title: "AI Ethics", description: "Understanding bias and safety.", category: "Safety", icon: "⚖️" }
        ]
    },
    {
        id: "ai-dev",
        title: "AI for Developers",
        description: "Integration of AI tools into your coding workflow.",
        modules: [
            { id: "mod-4", title: "Copilot Mastery", description: "Using AI for faster coding.", category: "Tools", icon: "💻" },
            { id: "mod-5", title: "API Integration", description: "How to call AI models in code.", category: "Dev", icon: "🔌" },
            { id: "mod-6", title: "Fine-tuning Basics", description: "Training models on your data.", category: "Advanced", icon: "⚙️" }
        ]
    }
];
