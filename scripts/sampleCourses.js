/**
 * Seed script to add sample courses to the database
 * Run with: node scripts/seedCourses.js
 */

const sampleCourses = [
    {
        title: "Introduction to Machine Learning",
        description: "Learn the fundamentals of machine learning, from basic concepts to building your first ML model. Perfect for beginners with no prior experience.",
        category: "Machine Learning",
        difficulty: "Beginner",
        thumbnail: "",
        modules: [
            {
                moduleId: "ml-intro-1",
                title: "What is Machine Learning?",
                description: "Understanding the basics of ML and its applications",
                videoLink: "https://www.youtube.com/watch?v=ukzFI9rgwfU",
                duration: 30,
                order: 1,
                resources: []
            },
            {
                moduleId: "ml-intro-2",
                title: "Types of Machine Learning",
                description: "Supervised, Unsupervised, and Reinforcement Learning",
                videoLink: "https://www.youtube.com/watch?v=f_uwKZIAeM0",
                duration: 25,
                order: 2,
                resources: []
            },
            {
                moduleId: "ml-intro-3",
                title: "Python for Machine Learning",
                description: "Essential Python libraries: NumPy, Pandas, Scikit-learn",
                videoLink: "https://www.youtube.com/watch?v=7eh4d6sabA0",
                duration: 45,
                order: 3,
                resources: []
            },
            {
                moduleId: "ml-intro-4",
                title: "Your First ML Model",
                description: "Building a simple linear regression model",
                videoLink: "https://www.youtube.com/watch?v=i_LwzRVP7bg",
                duration: 40,
                order: 4,
                resources: []
            }
        ],
        totalDuration: 140,
        prerequisites: ["Basic Python knowledge"],
        learningOutcomes: [
            "Understand fundamental ML concepts",
            "Differentiate between ML types",
            "Use Python ML libraries",
            "Build your first ML model"
        ],
        instructor: "AI Learning Hub",
        publishStatus: "published"
    },
    {
        title: "Deep Learning with Neural Networks",
        description: "Master deep learning concepts and build neural networks from scratch. Learn about CNNs, RNNs, and transformers.",
        category: "Deep Learning",
        difficulty: "Intermediate",
        thumbnail: "",
        modules: [
            {
                moduleId: "dl-nn-1",
                title: "Introduction to Neural Networks",
                description: "Understanding neurons, layers, and activation functions",
                videoLink: "https://www.youtube.com/watch?v=aircAruvnKk",
                duration: 35,
                order: 1,
                resources: []
            },
            {
                moduleId: "dl-nn-2",
                title: "Backpropagation Explained",
                description: "How neural networks learn through backpropagation",
                videoLink: "https://www.youtube.com/watch?v=Ilg3gGewQ5U",
                duration: 30,
                order: 2,
                resources: []
            },
            {
                moduleId: "dl-nn-3",
                title: "Convolutional Neural Networks",
                description: "CNNs for image recognition and computer vision",
                videoLink: "https://www.youtube.com/watch?v=YRhxdVk_sIs",
                duration: 40,
                order: 3,
                resources: []
            },
            {
                moduleId: "dl-nn-4",
                title: "Recurrent Neural Networks",
                description: "RNNs and LSTMs for sequence data",
                videoLink: "https://www.youtube.com/watch?v=AsNTP8Kwu80",
                duration: 35,
                order: 4,
                resources: []
            },
            {
                moduleId: "dl-nn-5",
                title: "Transfer Learning",
                description: "Using pre-trained models for your projects",
                videoLink: "https://www.youtube.com/watch?v=yofjFQddwHE",
                duration: 30,
                order: 5,
                resources: []
            }
        ],
        totalDuration: 170,
        prerequisites: ["Machine Learning basics", "Python programming", "Linear algebra"],
        learningOutcomes: [
            "Build neural networks from scratch",
            "Implement CNNs for image tasks",
            "Use RNNs for sequence modeling",
            "Apply transfer learning techniques"
        ],
        instructor: "AI Learning Hub",
        publishStatus: "published"
    },
    {
        title: "Prompt Engineering Mastery",
        description: "Master the art of prompt engineering for ChatGPT, Claude, and other LLMs. Learn techniques to get better AI outputs.",
        category: "Prompt Engineering",
        difficulty: "Beginner",
        thumbnail: "",
        modules: [
            {
                moduleId: "pe-1",
                title: "Introduction to Prompt Engineering",
                description: "What is prompt engineering and why it matters",
                videoLink: "https://www.youtube.com/watch?v=_ZvnD73m40o",
                duration: 20,
                order: 1,
                resources: []
            },
            {
                moduleId: "pe-2",
                title: "Basic Prompting Techniques",
                description: "Clear instructions, context, and examples",
                videoLink: "https://www.youtube.com/watch?v=jC4v5AS4RIM",
                duration: 25,
                order: 2,
                resources: []
            },
            {
                moduleId: "pe-3",
                title: "Advanced Prompting Strategies",
                description: "Chain-of-thought, few-shot learning, and role-playing",
                videoLink: "https://www.youtube.com/watch?v=dOxUroR57xs",
                duration: 30,
                order: 3,
                resources: []
            },
            {
                moduleId: "pe-4",
                title: "Prompt Engineering for Different Tasks",
                description: "Writing, coding, analysis, and creative tasks",
                videoLink: "https://www.youtube.com/watch?v=T9aRN5JkmL8",
                duration: 35,
                order: 4,
                resources: []
            }
        ],
        totalDuration: 110,
        prerequisites: ["Basic understanding of AI"],
        learningOutcomes: [
            "Write effective prompts for LLMs",
            "Use advanced prompting techniques",
            "Optimize AI outputs for different tasks",
            "Understand prompt engineering best practices"
        ],
        instructor: "AI Learning Hub",
        publishStatus: "published"
    },
    {
        title: "Natural Language Processing Fundamentals",
        description: "Learn NLP from basics to advanced topics. Build chatbots, sentiment analyzers, and text classifiers.",
        category: "Natural Language Processing",
        difficulty: "Intermediate",
        thumbnail: "",
        modules: [
            {
                moduleId: "nlp-1",
                title: "Introduction to NLP",
                description: "What is NLP and its applications",
                videoLink: "https://www.youtube.com/watch?v=fLvJ8VdHLA0",
                duration: 25,
                order: 1,
                resources: []
            },
            {
                moduleId: "nlp-2",
                title: "Text Preprocessing",
                description: "Tokenization, stemming, lemmatization",
                videoLink: "https://www.youtube.com/watch?v=nxhCyeRR75Q",
                duration: 30,
                order: 2,
                resources: []
            },
            {
                moduleId: "nlp-3",
                title: "Word Embeddings",
                description: "Word2Vec, GloVe, and FastText",
                videoLink: "https://www.youtube.com/watch?v=viZrOnJclY0",
                duration: 35,
                order: 3,
                resources: []
            },
            {
                moduleId: "nlp-4",
                title: "Sentiment Analysis",
                description: "Building a sentiment classifier",
                videoLink: "https://www.youtube.com/watch?v=O2wsvLB_D5w",
                duration: 40,
                order: 4,
                resources: []
            },
            {
                moduleId: "nlp-5",
                title: "Transformers and BERT",
                description: "Modern NLP with transformer models",
                videoLink: "https://www.youtube.com/watch?v=TQQlZhbC5ps",
                duration: 45,
                order: 5,
                resources: []
            }
        ],
        totalDuration: 175,
        prerequisites: ["Python programming", "Basic ML knowledge"],
        learningOutcomes: [
            "Preprocess text data effectively",
            "Use word embeddings",
            "Build sentiment analysis models",
            "Understand transformer architecture"
        ],
        instructor: "AI Learning Hub",
        publishStatus: "published"
    },
    {
        title: "Computer Vision with Python",
        description: "Learn computer vision techniques for image processing, object detection, and facial recognition.",
        category: "Computer Vision",
        difficulty: "Advanced",
        thumbnail: "",
        modules: [
            {
                moduleId: "cv-1",
                title: "Introduction to Computer Vision",
                description: "CV fundamentals and applications",
                videoLink: "https://www.youtube.com/watch?v=01sAkU_NvOY",
                duration: 30,
                order: 1,
                resources: []
            },
            {
                moduleId: "cv-2",
                title: "Image Processing with OpenCV",
                description: "Filters, transformations, and edge detection",
                videoLink: "https://www.youtube.com/watch?v=oXlwWbU8l2o",
                duration: 45,
                order: 2,
                resources: []
            },
            {
                moduleId: "cv-3",
                title: "Object Detection with YOLO",
                description: "Real-time object detection",
                videoLink: "https://www.youtube.com/watch?v=ag3DLKsl2vk",
                duration: 50,
                order: 3,
                resources: []
            },
            {
                moduleId: "cv-4",
                title: "Facial Recognition",
                description: "Building a face recognition system",
                videoLink: "https://www.youtube.com/watch?v=PdkPI92KSIs",
                duration: 40,
                order: 4,
                resources: []
            },
            {
                moduleId: "cv-5",
                title: "Image Segmentation",
                description: "Semantic and instance segmentation",
                videoLink: "https://www.youtube.com/watch?v=nDPWywWRIRo",
                duration: 45,
                order: 5,
                resources: []
            }
        ],
        totalDuration: 210,
        prerequisites: ["Deep Learning", "Python", "CNNs knowledge"],
        learningOutcomes: [
            "Process images with OpenCV",
            "Implement object detection",
            "Build facial recognition systems",
            "Perform image segmentation"
        ],
        instructor: "AI Learning Hub",
        publishStatus: "published"
    }
];

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = sampleCourses;
}

console.log("Sample courses data ready!");
console.log(`Total courses: ${sampleCourses.length}`);
console.log("\nTo add these courses to your database:");
console.log("1. Use the POST /api/courses endpoint");
console.log("2. Send each course object in the request body");
console.log("3. Or create a seed script that imports this file");
