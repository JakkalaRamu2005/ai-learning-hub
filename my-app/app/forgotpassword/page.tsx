"use client"

import { useState } from "react"


export default function ForgotPassword() {

    const [email, setEmail] = useState("");

    const [msg, setMsg] = useState("");

    const handleForgot = async (e: any) => {

        e.preventDefault();


        const res = await fetch("/api/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        })

        const data = await res.json();

        setMsg(data.resetLink || data.message);

    };


    return (
        <div className="container">
            <h2>Forgot password</h2>
            <form onSubmit={handleForgot}>

                <input placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button>send Reset Link</button>
            </form>
            <p>{msg}</p>
        </div>
    )


}