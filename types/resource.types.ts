/**
 * Resource-related types
 */

export interface Resource {
    ResourceName: string;
    Type:
    | "AI Tool"
    | "Free Course"
    | "Practice Platform"
    | "GitHub Repository"
    | "AI Newsletter"
    | "eBook"
    | "Community"
    | "Certification"
    | "Channel"
    | string;
    Platform: string;
    Description: string;
    URL: string;
    Difficulty: "Beginner" | "Intermediate" | "Advanced";
    WhatYouLearn: string;
    DateAdded: string;
    Recommended: "Y" | "N";
}

export interface FilterState {
    search: string;
    category: string;
    difficulty: string;
    sort: string;
}

export type SortOption = "Newest" | "Recommended" | "Alphabetical" | "Difficulty";
