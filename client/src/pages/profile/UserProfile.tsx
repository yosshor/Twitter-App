import { FC, useContext, useEffect, useState } from "react";
import useCurrentUser, { useCurrentUserMinData } from "../../hooks/useCurrentUser";
import './UserProfile.scss';
import { productionState } from "../../../src/pages/home/HomePage";
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Post from "../../views/components/post/Post";
import { PostType } from "../../views/components/post/Post";
import { useParams } from "react-router-dom";


const UserProfile: FC = () => {
    const { id } = useParams<{ id: string }>();
    const userId = id;
    const { userData, loading } = useCurrentUser({ userId: userId! ?? undefined });
    const { minUserData, isLoading } = useCurrentUserMinData();
    const state = useContext(productionState);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [followers, setFollowers] = useState<number>(0);
    const [following, setFollowing] = useState<number>(0);

    // const handleFollow = () => {
    //     // Add logic to follow/unfollow the user in the backend
    // };

    const getToken = () => document.cookie
        .split("; ")
        .find((row) => row.startsWith("userTwitter="))
        ?.split("=")[1];

    const handleFollow = async (e: React.MouseEvent<HTMLButtonElement>, isFollowing: boolean) => {
        try {
            const userId = e.currentTarget.id;
            console.log("userId", userId);
            setIsFollowing(!isFollowing);
            const token = getToken();

            const response = await fetch("http://localhost:3000/api/users/follow-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId }),
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                console.log(isFollowing ? `Unfollowed user with ID: ${userId}` : `Followed user with ID: ${userId}`);
                setIsFollowing(data.isFollowing ? true : false);
                // setUsers((prevUsers) =>
                //     prevUsers.map((user) =>
                //         user._id === userId ? { ...user, isFollowing: !isFollowing } : user
                //     )
                // );
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error("Error toggling follow status:", error);
        }
    };

    useEffect(() => {


        const fetchUserPosts = async () => {
            try {
                if (!userData) return;
                const token = getToken();

                if (!token) {
                    throw new Error("No token found in cookies");
                }

                const response = await fetch(`${state.url}/api/post/get-user-posts`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        ...(userId && { UserId: `${userId}` }),
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user posts");
                }

                const data = await response.json();
                console.log("profiledata", data);
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
        if (!userData || Object.values(userData).length === 0) return;
        else {
            console.log("userData from userprifile", userData);
            setFollowers(userData.followerDetails[0] && userData.followerDetails[0].followingList.length || 0);
            setFollowing(userData.followingDetails[0] && userData.followingDetails[0].followingList.length || 0);

        }
    }, [userData, state.url]);

    if (loading || isLoading) return <div>Loading...</div>;
    if (!userData || !minUserData) return <div>No user data available.</div>;

    const imageUrl = `${state.url}/${userData.profileImage}`;
    const joinedDate = new Date(userData.createdAt).toDateString();
    const userHandle = !userData.fullName === undefined ? userData.fullName
        .split(" ")
        .map((part) => part.toLowerCase().trim())
        .join("") : '';

    return (
        <>
            <div className="user-profile-wrapper" style={{ height: 'max-content' }}>
                <div className="header-wrapper">

                    <div style={{ width: "100%", height: "250px" }}></div>
                    <div className="user-profile-header" >
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
                                top: "120px",
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
                                    <p>{followers}</p>
                                    <p style={{ paddingLeft: '10px', paddingRight: '10px' }}>Followers</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <p>{following}</p>
                                    <p style={{ paddingLeft: '10px' }}>Following</p>
                                </div>
                            </div>
                        </div>
                        <div className="follow-section">

                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <button id={userId} onClick={(e) => handleFollow(e, isFollowing)} className="follow-button">
                                    {isFollowing ? 'Unfollow' : 'Follow'}
                                </button>
                            </div>
                            <p>{userData.email}</p>
                        </div>
                    </div>

                </div>



                <div className="user-posts-container" style={{
                    width: '80%', alignItems: 'center', paddingLeft: '10%',
                    paddingTop: '10px', backgroundColor: 'white', paddingRight: '12%'
                }}>
                    {error ? (
                        <p className="error-message">{error}</p>
                    ) : posts.length === 0 ? (
                        <p>No posts found for this user.</p>
                    ) : (
                        posts.map((post, index) => (
                            <Post userId={minUserData.userId} key={index} postData={post} />
                        ))
                    )}
                </div>
            </div>
            {/* <TwitterReplies /> */}
            {/* <TwitterReplies /> */}
        </>
    );
};

export default UserProfile;