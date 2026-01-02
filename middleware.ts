import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(req: NextRequest) {
    // Allow public access to all routes
    return NextResponse.next();
}


export const config = {
    matcher: ["/"],
}