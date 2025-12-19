import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(req: NextRequest) {

    const token = req.cookies.get("token")?.value || req.cookies.get("next-auth.session-token")?.value;

    if (!token && req.nextUrl.pathname === "/") {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: ["/"],
}