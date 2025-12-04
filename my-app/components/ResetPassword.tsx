"use client"
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from "next/navigation"
import "./style/resetpassword.css"

function ResetPasswordForm() {
    const [newPassword, setNewPassword] = useState("");
    const [msg, setMsg] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const handleReset = async (e: any) => {
        e.preventDefault();

        const res = await fetch("/api/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, newPassword }),
        });

        const data = await res.json();
        setMsg(data.message);
        
        if (res.ok) {
            router.push('/login');
        }
    }

    return (
        <div className="reset-container">
            <div className="reset-box">
                <h2 className="reset-title">Reset Password</h2>
                <p className="reset-subtitle">Enter your new password</p>

                <form onSubmit={handleReset} className="reset-form">
                    <div className="input-group">
                        <label htmlFor="newPassword" className="input-label">New Password</label>
                        <input
                            id="newPassword"
                            type="password"
                            placeholder='Enter new password'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <button type="submit" className="reset-btn">Reset Password</button>

                    {msg && <p className="message-text">{msg}</p>}
                </form>
            </div>
        </div>
    )
}

export default function ResetPassword() {
    return (
        <Suspense fallback={<div className="loading">Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    )
}
