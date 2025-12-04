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

        const res = await fetch("/api/profile", {
            credentials: "include",
        });
        const data = await res.json();



        if (res.ok) {
            setName(data.name);
            setEmail(data.email);
            setPlace(data.place);
            setBio(data.bio);
            setProfileImage(data.profileImage);
        } else {
            router.push("/login")
        }

    }

    const handleUpdate = async (e: any) => {
        e.preventDefault();

        setMsg("updating....");

        const response = await fetch("/api/updateprofile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, place, bio, profileImage }),
        })
    }



    return (
        <div className="profile-container">
            <div className="profile-box">
                <h2 className="profile-title">My Profile</h2>

                {!isEditing ? (
                    <div className="profile-view">
                        {profileImage && (
                            <div className="profile-image-wrapper">
                                <img src={profileImage} alt="Profile" className="profile-image" />
                            </div>
                        )}
                        <div className="profile-details">
                            <div className="detail-item">
                                <span className="detail-label">Name:</span>
                                <span className="detail-value">{name}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Email:</span>
                                <span className="detail-value">{email}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Place:</span>
                                <span className="detail-value">{place || "Not provided"}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Bio:</span>
                                <span className="detail-value">{bio || "Not provided"}</span>
                            </div>
                        </div>
                        <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Profile</button>
                    </div>
                ) : (
                    <form onSubmit={handleUpdate} className="profile-form">
                        <div className="input-group">
                            <label htmlFor="name" className="input-label">Name</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="email" className="input-label">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                disabled
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="place" className="input-label">Place</label>
                            <input
                                id="place"
                                type="text"
                                value={place}
                                onChange={(e) => setPlace(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="bio" className="input-label">Bio</label>
                            <textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us about yourself"
                                className="textarea-field"
                                rows={4}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="profileImage" className="input-label">Profile Image URL</label>
                            <input
                                id="profileImage"
                                type="text"
                                value={profileImage}
                                onChange={(e) => setProfileImage(e.target.value)}
                                placeholder="Paste image link"
                                className="input-field"
                            />
                        </div>

                        {msg && <p className="message-text">{msg}</p>}

                        <div className="form-buttons">
                            <button type="submit" className="save-btn">Save Changes</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                        </div>
                    </form>
                )}
            </div>
        </div>

    )










}











