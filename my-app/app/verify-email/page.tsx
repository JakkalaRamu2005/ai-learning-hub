"use client"
import {useEffect, useState} from "react"
import { useSearchParams, useRouter } from "next/navigation"
import "./verify.css"

export default function VerifyEmail(){
    const searchParams = useSearchParams();
    const router = useRouter();


    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    const [message, setMessage] = useState("");

    useEffect(()=>{

        const token = searchParams.get("token");

        if(!token){
            setStatus("error");
            setMessage("verification token is missing");
            return;
        }

        verifyEmail(token);
    },[searchParams]);


    const verifyEmail = async (token:string)=>{
        try{
            const response = await fetch(`api/emailverification?token=${token}`);
            const data = await response.json();


            if(response.ok){
                setStatus("success");
                setMessage(data.message);

                setTimeout(()=>{
                    router.push("/login")
                },3000)
            }else{
                setStatus("error");
                setMessage(data.message || "verification failed");
            }
        }catch(error){
            setStatus("error");
            setMessage("something went wrong. Please try again");
        }
    }


return(
        <div className="verify-container">
            <div className="verify-card">
                {status === "loading" && (
                    <div className="verify-content">
                        <div className="spinner"></div>
                        <h2 className="verify-title">Verifying your email...</h2>
                    </div>
                )}

                {status === "success" && (
                    <div className="verify-content">
                        <div className="icon-success">✓</div>
                        <h2 className="title-success">Success!</h2>
                        <p className="verify-message">{message}</p>
                        <p className="redirect-text">Redirecting to login...</p>
                    </div>
                )}

                {status === "error" && (
                    <div className="verify-content">
                        <div className="icon-error">✗</div>
                        <h2 className="title-error">Verification Failed</h2>
                        <p className="verify-message">{message}</p>
                        <button
                            onClick={() => router.push("/register")}
                            className="verify-button"
                        >
                            Go to Register
                        </button>
                    </div>
                )}
            </div>
        </div>
    );


}