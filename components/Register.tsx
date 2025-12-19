"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import "./style/register.css"

const Register = () => {

    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [msgType, setMsgType] = useState("");


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password) {
            setMsg("Please fill all fields");
            setMsgType("error");
            return;
        }

        setMsg("Loading...");
        setMsgType("loading");

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMsg(data.message || "Registration failed");
                setMsgType("error");
                return;
            }

            setMsg("Registered successfully");
            setMsgType("success");
            router.push("/login")

        } catch (error) {
            setMsg("Something went wrong");
            setMsgType("error");

        }

    }




    return (
        <div className='register-container'>
            <div className="register-box">
                <h2 className="register-title">Create Account</h2>
                <p className="register-subtitle">Join us today</p>

                <form onSubmit={handleRegister} className="register-form">
                    <div className="input-group">
                        <label htmlFor="name" className="input-label">Name</label>
                        <input
                            id="name"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            type="text"
                            placeholder='Enter your name'
                            className="input-field"
                        />
                    </div>
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
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            placeholder='Enter your password'
                            className="input-field"
                        />
                    </div>

                    <button type='submit' className="register-btn">Register</button>

                    {msg && <p className={`message-text ${msgType}`}>{msg}</p>}

                    <p className="login-text">
                        Already have an account?
                        <a className='link' href="/login"> Login here</a>
                    </p>
                </form>
            </div>
        </div>

    )
}

export default Register
