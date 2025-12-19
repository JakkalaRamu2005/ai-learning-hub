
import { NextResponse } from 'next/server';

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1JbqFSwtCEmg51txSvDM4UpJ-4fsY8kqhO9YSG8OUgxE/export?format=csv&gid=567183491";

export interface LearningModule {
    Category: string;
    SkillLevel: string;
    VideoNumber: string;
    VideoTitle: string;
    ChannelName: string;
    Duration: string;
    VideoLink: string;
}

export async function GET() {
    try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch sheet: ${response.statusText}`);
        }

        const text = await response.text();
        const modules: LearningModule[] = parseCSV(text);

        // Group by Category
        const groupedModules: Record<string, LearningModule[]> = {};
        modules.forEach(module => {
            if (!groupedModules[module.Category]) {
                groupedModules[module.Category] = [];
            }
            groupedModules[module.Category].push(module);
        });

        return NextResponse.json({ modules: groupedModules });
    } catch (error) {
        console.error("Error fetching learning modules:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

function parseCSV(text: string): LearningModule[] {
    const lines = text.split(/\r?\n/);
    const data: LearningModule[] = [];

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const fields = parseCSVLine(line);

        // Check if this is a header row (sometimes repeated in sheets)
        if (fields[0] === 'Category' && fields[1] === 'Skill Level') continue;

        if (fields.length >= 7) {
            data.push({
                Category: fields[0],
                SkillLevel: fields[1],
                VideoNumber: fields[2],
                VideoTitle: fields[3],
                ChannelName: fields[4],
                Duration: fields[5],
                VideoLink: fields[6]
            });
        }
    }
    return data;
}

// Simple state machine CSV parser to handle quoted fields
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let currentField = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (insideQuotes) {
            if (char === '"') {
                if (i + 1 < line.length && line[i + 1] === '"') {
                    // Escaped quote
                    currentField += '"';
                    i++;
                } else {
                    // End of quoted field
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
