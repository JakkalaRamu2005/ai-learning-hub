"use client"
import "./style/navbar.css"
import { useRouter } from "next/navigation";

export default function Navbar() {

    const router = useRouter();

    const handleLogout = async () => {
        const res = await fetch("/api/logout", {
            method: "POST",
        });

        if (res.ok) {
            router.push("/login");
        }
    };

    return (
        <nav>
            <div>
                <h2>AI Tools Hub</h2>
            </div>

            <div>
                <a href="/">Home</a>
                <a href="/tools">AI Tools</a>
                <a href="/profile">Profile</a>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}
