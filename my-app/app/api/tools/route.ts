import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Your Google Sheet ID (replace with yours)
        const SHEET_ID = "1JbqFSwtCEmg51txSvDM4UpJ-4fsY8kqhO9YSG8OUgxE";
        const SHEET_NAME = "Sheet1"; // Change if your sheet has different name
        
        // Google Sheets API URL (no API key needed for public sheets)
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;
        
        const response = await fetch(url);
        const text = await response.text();
        
        // Parse the JSON from Google's response
        const json = JSON.parse(text.substring(47).slice(0, -2));
        
        // Convert to simple array
        const tools = json.table.rows.map((row: any) => ({
            name: row.c[0]?.v || "",
            category: row.c[1]?.v || "",
            description: row.c[2]?.v || "",
            link: row.c[3]?.v || "",
            pricing: row.c[4]?.v || "",
            weekAdded: row.c[5]?.v || "",
        }));
        
        return NextResponse.json({ tools, total: tools.length }, { status: 200 });
        
    } catch (error) {
        console.log("Error fetching sheet:", error);
        return NextResponse.json({ message: "Error fetching tools" }, { status: 500 });
    }
}
