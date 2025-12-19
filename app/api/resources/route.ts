import { NextResponse } from 'next/server';
import { Resource } from '@/types/resource';

// Using the same Spreadsheet ID, assuming 'Resources' might be the first tab (gid=0) or similar.
// Update 'gid' if the specific tab ID is known.
const SHEET_URL = "https://docs.google.com/spreadsheets/d/1JbqFSwtCEmg51txSvDM4UpJ-4fsY8kqhO9YSG8OUgxE/export?format=csv&gid=1301176161";

export async function GET() {
    try {
        const response = await fetch(SHEET_URL, { cache: "no-store" });

        let modules: Resource[] = [];

        if (response.ok) {
            const text = await response.text();
            // Basic check to see if we got HTML (error page) instead of CSV
            if (!text.trim().startsWith("<!DOCTYPE") && !text.includes("<html>")) {
                modules = parseCSV(text);
            }
        }

        return NextResponse.json({ resources: modules });
    } catch (error) {
        console.error("Error fetching resources:", error);
        return NextResponse.json({ resources: [] });
    }
}

function parseCSV(text: string): Resource[] {
    const lines = text.split(/\r?\n/);
    const data: Resource[] = [];

    // Skip header row (i=1)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const fields = parseCSVLine(line);

        // Ensure we have enough fields (at least 7 based on the structure)
        if (fields.length >= 7) {
            // Clean up 'WhatYouLearn': replace " - " with " • " if needed
            let learnString = fields[6];
            if (learnString && learnString.includes(" - ")) {
                learnString = learnString.replace(/ - /g, " • ");
            }

            // Map fields: ResourceName, Type, Platform, Description, URL, Difficulty, WhatYouLearn
            data.push({
                ResourceName: fields[0],
                Type: fields[1],
                Platform: fields[2],
                Description: fields[3],
                URL: fields[4],
                Difficulty: fields[5] as "Beginner" | "Intermediate" | "Advanced", // naive cast
                WhatYouLearn: learnString,
                DateAdded: new Date().toISOString().split('T')[0], // Default to today
                Recommended: "Y" // Default to Y
            });
        }
    }
    return data;
}

// Simple state machine CSV parser
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let currentField = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (insideQuotes) {
            if (char === '"') {
                if (i + 1 < line.length && line[i + 1] === '"') {
                    currentField += '"';
                    i++;
                } else {
                    insideQuotes = false;
                }
            } else {
                currentField += char;
            }
        } else {
            if (char === '"') {
                insideQuotes = true;
            } else if (char === ',') {
                result.push(currentField.trim());
                currentField = '';
            } else {
                currentField += char;
            }
        }
    }
    result.push(currentField.trim());
    return result;
}

const FALLBACK_RESOURCES: Resource[] = [];
