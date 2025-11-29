"use client"


import { useRouter } from "next/navigation"

const page = () => {


const handleLogout = async ()=>{
  await fetch("/api/logout", {method: "POST"});

  router.push("/login");
}

  const router = useRouter();
  return (
    <div>
    <h1>Welcome to Home page</h1>
    <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default page
