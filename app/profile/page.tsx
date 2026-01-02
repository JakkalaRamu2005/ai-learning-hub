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

    // Learning statistics
    const [enrolledCourses, setEnrolledCourses] = useState(0);
    const [completedCourses, setCompletedCourses] = useState(0);
    const [totalLearningTime, setTotalLearningTime] = useState(0);
    const [learningStreak, setLearningStreak] = useState(0);


    const [uploading, setUploading] = useState(false);

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

            // Set learning statistics
            setEnrolledCourses(data.enrolledCourses?.length || 0);
            setCompletedCourses(data.completedCourses?.length || 0);
            setTotalLearningTime(data.totalLearningTime || 0);
            setLearningStreak(data.learningStreak || 0);
        } else {
            router.push("/login")
        }

    }

    useEffect(() => {
        fetchProfile(); // eslint-disable-line react-hooks/exhaustive-deps
    }, [])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setMsg("Uploading image...");

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setProfileImage(data.imageUrl);
                setMsg("Image uploaded successfully!");
            } else {
                setMsg(data.error || "Upload failed");
            }
        } catch (error) {
            setMsg("Error uploading image");
        } finally {
            setUploading(false);
        }
    };

    const handleUpdate = async (e: any) => {
        e.preventDefault();

        setMsg("updating....");

        const response = await fetch("/api/update-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, place, bio, profileImage }),
        })

        if (response.ok) {
            setMsg("Profile updated successfully!");
            setIsEditing(false);
            fetchProfile();
        } else {
            setMsg("Failed to update profile");
        }
    }



    return (
        <div className="profile-container">
            <div className="profile-box">
                <h2 className="profile-title">My Profile</h2>

                {!isEditing ? (
                    <div className="profile-view">
                        <div className="profile-image-wrapper">
                            <img
                                src={profileImage || "https://res.cloudinary.com/dzt6v3p6p/image/upload/v1735741639/user_placeholder_v0_a_0_rvjljk.png"}
                                alt="Profile"
                                className="profile-image"
                            />
                        </div>
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

                        {/* Learning Statistics */}
                        <div className="learning-stats">
                            <h3 className="stats-title">📊 Learning Statistics</h3>
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <span className="stat-icon">🎓</span>
                                    <div className="stat-content">
                                        <span className="stat-value">{enrolledCourses}</span>
                                        <span className="stat-label">Enrolled Courses</span>
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-icon">✅</span>
                                    <div className="stat-content">
                                        <span className="stat-value">{completedCourses}</span>
                                        <span className="stat-label">Completed</span>
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-icon">⏱️</span>
                                    <div className="stat-content">
                                        <span className="stat-value">
                                            {Math.floor(totalLearningTime / 60)}h {totalLearningTime % 60}m
                                        </span>
                                        <span className="stat-label">Learning Time</span>
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-icon">🔥</span>
                                    <div className="stat-content">
                                        <span className="stat-value">{learningStreak}</span>
                                        <span className="stat-label">Day Streak</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Profile</button>
                    </div>
                ) : (
                    <form onSubmit={handleUpdate} className="profile-form">
                        <div className="input-group">
                            <label className="input-label">Profile Photo</label>
                            <div className="upload-container">
                                <img
                                    src={profileImage || "https://res.cloudinary.com/dzt6v3p6p/image/upload/v1735741639/user_placeholder_v0_a_0_rvjljk.png"}
                                    alt="Preview"
                                    className="image-preview"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="file-input"
                                />
                                {uploading && <span className="upload-spinner">Uploading...</span>}
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="name" className="input-label">Name</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="email" className="input-label">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
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






