"use client"
import { useState, useEffect } from "react";

export default function ToolsPage() {

    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div>Loading AI tools...</div>;
    }

    return (
        <div>
            <h1>AI Tools Directory</h1>
            <p>Total Tools: {tools.length}</p>
            <p>Updated Weekly</p>

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
