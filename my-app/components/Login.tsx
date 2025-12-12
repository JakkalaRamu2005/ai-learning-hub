"use client"
import "./style/login.css"
import { useState } from 'react'
import { useRouter } from "next/navigation"


const Login = () => {

    const router = useRouter();

    const [email, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setMsg("Please fill all fields");
            return;
        }

        setMsg("Loading ....")

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email, password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMsg(data.message || "login failed");
                return;
            }

            setMsg("Login successful");
            router.push("/")

        } catch (error) {
            setMsg("Something went wrong");
        }
    }

    return (
        <div className='login-container'>
            <div className="login-box">
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Please login to your account</p>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <label htmlFor="email" className="input-label">Email</label>
                        <input
                            id="email"
                            onChange={(e) => setMail(e.target.value)}
                            value={email}
                            type="email"
                            placeholder='Enter your email'
                            className="input-field"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password" className="input-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Enter your password'
                            className="input-field"
                        />
                    </div>

                    <button type='submit' className="login-btn">Login</button>

                    {msg && <p className="message-text">{msg}</p>}

                    <div className="form-links">
                        <p className="register-text">
                            Don&apos;t have an account?
                            <a className="link" href="/register"> Register here</a>
                        </p>
                        <p className="forgot-text">
                            <a href="/forgotpassword" className="link">Forgot Password?</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
