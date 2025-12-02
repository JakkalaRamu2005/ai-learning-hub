"use client"


import { useRouter } from "next/navigation"
import Profile from "./profile/page";
import Home from "@/components/Home";
const page = () => {
const router = useRouter();

  
  return (
    <div>
   <Home/>

    
    </div>
  )
}

export default page
