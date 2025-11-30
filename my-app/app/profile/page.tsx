"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"

import "./profile.css"
export default function Profile() {

    const router = useRouter();


    const [name, setName] = useState("");
    const [email, setEmail] = useState('');
    const [place, setPlace] = useState("");
    const [bio, setBio] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [msg, setMsg] = useState("");
    const [isEditing, setIsEditing] = useState(false);


    useEffect(() => {
        fetchProfile();
    }, [])

    const fetchProfile = async () => {

        const res = await fetch("/api/profile",{
            credentials: "include",
        });
        const data = await res.json();
    


        if (res.ok) {
            setName(data.name);
            setEmail(data.email);
            setPlace(data.place);
            setBio(data.bio);
            setProfileImage(data.profileImage);
        }else{
            router.push("/login")
        }
        
    }
    
    const handleUpdate = async (e:any)=>{
        e.preventDefault();

        setMsg("updating....");

        const response = await fetch("/api/profile/update",{
            method: "POST", 
            headers: {"Content-Type":"application/json"},
            credentials: "include",
            body: JSON.stringify({name, place, bio, profileImage}),
        })
    }



        return (
            <div>

                <h2>My Profile</h2>
                {!isEditing ? (
                    <div>
                        {profileImage && <img src={profileImage} alt="Profile" />}
                        <p><strong>Name:</strong>{name}</p>
                        <p><strong>Email:</strong>{email}</p>
                        <p><strong>Place:</strong>{place || "Not provided"}</p>
                        <p><strong>Bio:</strong>{bio || "Not provided"}</p>
                        <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                    </div>
                ) : (
                    <form onSubmit={handleUpdate}>
                        <label>Name:</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        <label>Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <label>Place:</label>
                        <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} />
                        <label>Bio:</label>
                        <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself"></textarea>
                        <label>Profile Image URL:</label>
                        <input value={profileImage} onChange={(e) => setProfileImage(e.target.value)} placeholder="Paste image link" />
                        <button type="submit"> Save changes</button>
                        <button type="button" onClick={()=> setIsEditing(false)}>Cancel</button>
                    </form>
                )}
            </div>
        )










    }











