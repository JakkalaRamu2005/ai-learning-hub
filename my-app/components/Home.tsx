import Navbar from "@/components/Navbar";
import "./style/home.css"

export default function Home() {
    return (
        <div>
            <div className="home-container">
                <h1>Welcome to AI Tools Hub</h1>
                <p>Discover new AI tools updated weekly!</p>
                
                <div className="content-section">
                    <h3>What we offer:</h3>
                    <ul>
                        <li>Latest AI tools updated every week</li>
                        <li>Categorized by use case</li>
                        <li>Free and Paid options</li>
                        <li>Direct links to try tools</li>
                    </ul>
                    
                    <a href="/tools" className="browse-btn">Browse AI Tools</a>
                </div>
            </div>
        </div>
    );
}
