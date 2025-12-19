"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"


export default function SavedTools() {
    const router = useRouter();
    const [tools, setTools] = useState([]);

    const [savedToolIds, setSavedToolIds] = useState<string[]>([]);
    const [savedToolsData, setSavedToolsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);


    const fetchSavedTools = async () => {
        try {
            const res = await fetch("/api/saved-tools");

            if (!res.ok) {
                router.push("/login");
                return;
            }
            const data = await res.json();
            setSavedToolsData(data.savedTools || []);
        } catch (error) {
            console.error("Error fetching saved tools:", error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSavedTools(); // eslint-disable-line
    }, [])

}