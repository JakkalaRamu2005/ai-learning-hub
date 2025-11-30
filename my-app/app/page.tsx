"use client"


import { useRouter } from "next/navigation"
import Profile from "./profile/page";
const page = () => {
const router = useRouter();

const handleLogout = async ()=>{
  await fetch("/api/logout", {method: "POST"});

  router.push("/login");
}

  
  return (
    <div>
    <h1>Welcome to Home page</h1>
    <button onClick={handleLogout}>Logout</button>

    
    </div>
  )
}

export default page
