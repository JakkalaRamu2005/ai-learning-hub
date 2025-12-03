"use client"
import Link from "next/link"
import "./toolcard.css"

interface ToolCardProps {
    name: string;
    category: string;
    description: string;
    link: string;
    pricing: string;
    weekAdded: string;
}


export default function ToolCard({
    name, category, description, link, pricing, weekAdded
}: ToolCardProps){


const isThisWeek = ()=>{
    const toolDate = new Date(weekAdded);
    const today = new Date();
    const weekAgo = new Date(today.getTime()- 7*24*60*60*1000);
    return toolDate >= weekAgo;
};










}