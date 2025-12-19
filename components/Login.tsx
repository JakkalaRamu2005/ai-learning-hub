"use client"
import "./style/login.css"
import { useState } from 'react'
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";


const Login = () => {

    const router = useRouter();

    const [email, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [msgType, setMsgType] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setMsg("Please fill all fields");
            setMsgType("error");
            return;
        }

        setMsg("Loading ....")
        setMsgType("loading");

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
                setMsgType("error");
                return;
            }

            setMsg("Login successful");
            setMsgType("success");
            router.push("/")

        } catch (error) {
            setMsg("Something went wrong");
            setMsgType("error");
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

                    <button
                        type="button"
                        className="google-btn"
                        onClick={() => signIn("google", { callbackUrl: "/" })}
                    >
                        <FcGoogle size={22} />
                        LOG IN WITH GOOGLE
                    </button>

                    {msg && <p className={`message-text ${msgType}`}>{msg}</p>}

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
