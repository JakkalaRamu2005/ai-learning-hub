"use client"
import "./style/forgotpassword.css"
import { useState } from "react"


export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const [msg, setMsg] = useState("");

    const handleForgot = async (e: React.FormEvent) => {

        e.preventDefault();


        const res = await fetch("/api/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        })

        const data = await res.json();

        setMsg(data.message);

    };


    return (
        <div className="forgot-container">
            <div className="forgot-box">
                <h2 className="forgot-title">Forgot Password?</h2>
                <p className="forgot-subtitle">Enter your email to reset password</p>

                <form onSubmit={handleForgot} className="forgot-form">
                    <div className="input-group">
                        <label htmlFor="email" className="input-label">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <button type="submit" className="reset-btn">Send Reset Link</button>

                    {msg && <p className="message-text">{msg}</p>}

                    <p className="back-login">
                        <a href="/login" className="link">Back to Login</a>
                    </p>
                </form>
            </div>
        </div>

    )


}