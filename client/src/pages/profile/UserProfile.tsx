import { useContext, useEffect, useState } from "react";
import useCurrentUser from "../../hooks/useCurrentUser";
import './UserProfile.scss';
import { productionState } from "../../../src/pages/home/HomePage";
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TwitterReplies from "../../views/components/replies/Replies";
import Post from "../../views/components/post/Post";



const UserProfile = () => {
    const { userData, loading } = useCurrentUser();
    const state = useContext(productionState);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                if (!userData) return;

                const token = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("userTwitter="))
                    ?.split("=")[1];

                if (!token) {
                    throw new Error("No token found in cookies");
                }

                const response = await fetch(`${state.url}/api/post/get-all`, { //get-user-posts`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user posts");
                }

                const data = await response.json();
                console.log(data);
                if (Array.isArray(data.posts)) {
                    setPosts(data.posts);
                } else {
                    setPosts([]);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            }
        };

        fetchUserPosts();
    }, [userData, state.url]);

    if (loading) return <div>Loading...</div>;
    if (!userData) return <div>No user data available.</div>;

    const imageUrl = `${state.url}/${userData.profileImage}`;
    const joinedDate = new Date(userData.createdAt).toDateString();
    const userHandle = userData.fullName
        .split(" ")
        .map((part) => part.toLowerCase().trim())
        .join("");

    return (
        <>
            <div className="user-profile-wrapper">
                <div style={{ width: "100%", height: "250px" }}></div>
                <div className="user-profile-header">
                    <img
                        src={imageUrl}
                        alt="User Profile"
                        className="user-profile-image"
                        style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            border: "2px solid #333",
                            margin: "0 auto",
                            display: "block",
                            position: "absolute",
                            top: "17vh",
                        }}
                    />
                    <div style={{ height: "max-content" }}>
                        <h1 style={{ marginBottom: '0px' }}>{userData.fullName}</h1>
                        <p style={{ margin: '0px' }}>@{userHandle}</p>
                        <div style={{ marginTop: '20px' }} className="joined-date">
                            <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
                            <span>Joined: {joinedDate}</span>
                        </div>
                        <div className="followers-wrapper">
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <p>0</p>
                                <p>Followers</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <p>0</p>
                                <p>Following</p>
                            </div>
                        </div>
                    </div>
                    <p>Email: {userData.email}</p>
                </div>
            </div>
            <div className="user-posts-container">
                {error ? (
                    <p className="error-message">{error}</p>
                ) : posts.length === 0 ? (
                    <p>No posts found for this user.</p>
                ) : (
                    posts.map((post, index) => (
                        <Post key={index} {...post} />
                    ))
                )}
            </div>
            <TwitterReplies />
            <TwitterReplies />
        </>
    );
};

export default UserProfile;