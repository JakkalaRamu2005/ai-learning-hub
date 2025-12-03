"use client"
import { useState, useEffect } from "react";
import "./tool.css"


interface Tool {
    name: string,
    description: string,
    category: string,
    link: string,
    dateAdded: string;
}




export default function ToolsPage() {

    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");


    useEffect(() => {
        fetchTools();
    }, []);

    const fetchTools = async () => {
        try {
            const res = await fetch("/api/tools");
            const data = await res.json();

            if (res.ok) {
                setTools(data.tools);
            }
            setLoading(false);
        } catch (error) {
            console.log("Error:", error);
            setLoading(false);
        }
    };

    const categories = ['All', ...new Set(tools.map(t => t.category))];

    const filteredTools = tools.filter(tool => {

        const matchesSearch = tool.name.toLowerCase().includes(searchText.toLocaleLowerCase()) ||

            tool.description.toLowerCase().includes(searchText.toLowerCase());

        const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
        return matchesSearch && matchesCategory;

    })





    if (loading) {
        return <div>Loading AI tools...</div>;
    }

    return (
        <div>
            <h1>AI Tools Directory</h1>

            <input type="text" placeholder="Search..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />

            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}

            >{categories.map((c) => (
                <option key={c} value={c}>{c}</option>
            ))}</select>

            {tools.map((tool: any, index: number) => (
                <div key={index}>
                    <h3>{tool.name}</h3>
                    <p><strong>Category:</strong> {tool.category}</p>
                    <p><strong>Pricing:</strong> {tool.pricing}</p>
                    <p>{tool.description}</p>
                    <a href={tool.link} target="_blank">Visit Tool →</a>
                    {tool.weekAdded && <p><small>Added: {tool.weekAdded}</small></p>}
                    <hr />
                </div>
            ))}
        </div>
    );
}
