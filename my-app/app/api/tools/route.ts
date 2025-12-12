import { NextResponse } from "next/server";

export async function GET() {
    try {
        const SHEET_ID = "1JbqFSwtCEmg51txSvDM4UpJ-4fsY8kqhO9YSG8OUgxE";
        const SHEET_NAME = "Sheet1";

        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

        const response = await fetch(url);

        // Check if Google Sheets gave us an error
        if (!response.ok) {
            console.log("Sheet access error - Make sheet public!");
            return NextResponse.json({
                tools: [],
                message: "Cannot access sheet. Make it public."
            }, { status: 200 });
        }

        const text = await response.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tools = json.table.rows.map((row: any) => ({
            _id: row.c[0]?.v || "",
            name: row.c[0]?.v || "",
            category: row.c[1]?.v || "",
            description: row.c[2]?.v || "",
            link: row.c[3]?.v || "",
            pricing: row.c[4]?.v || "",
            weekAdded: row.c[5]?.v || "",
        }));

        return NextResponse.json({ tools, total: tools.length }, { status: 200 });

    } catch (error) {
        console.log("Error:", error);
        return NextResponse.json({ tools: [], message: "Error" }, { status: 200 });
    }
}
