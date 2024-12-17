import { FC, useContext, useEffect, useState } from "react";
import useCurrentUser from "../../hooks/useCurrentUser";
import './UserProfile.scss';
import { productionState } from "../../../src/pages/home/HomePage";
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TwitterReplies from "../../views/components/replies/Replies";
import Post from "../../views/components/post/Post";
import { PostType } from "../../views/components/post/Post";
import { stringify } from "querystring";


interface UserProfileProps {
    userId: string;
}


const UserProfile: FC<UserProfileProps> = (userId?) => {
    const { userData, loading } = useCurrentUser();
    const state = useContext(productionState);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followers, setFollowers] = useState<number>(0); 
    const [following, setFollowing] = useState<number>(0);


    const handleFollow = () => {
        setIsFollowing(!isFollowing);
        // Add logic to follow/unfollow the user in the backend
    };

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
    useEffect(() => {
        const fetchFollowingCount = async () => {
          try {
            if (!userData) return;
      
            const token = document.cookie
              .split("; ")
              .find((row) => row.startsWith("userTwitter="))
              ?.split("=")[1];
      
            if (!token) {
              throw new Error("No token found in cookies");
            }
            console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",userData._id);
          
            const response = await fetch(`${state.url}/api/users/following-count`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ userId: userData._id }), 
            });
      
            if (!response.ok) {
              throw new Error("Failed to fetch following count");
            }
      
            const data = await response.json();
            setFollowing(data.followingCount || 0);
          } catch (err) {
            console.error("Error in fetchFollowingCount:", err);
          }
        };
      
        fetchFollowingCount();
      }, [state.url, userId,userData]);
      

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
                                    <p>0</p>
                                    <p>Followers</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <p>{following}</p>
                                    <p>Following</p>
                                </div>
                            </div>
                        </div>
                        <div className="follow-section">

                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <button onClick={handleFollow} className="follow-button">
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
                            <Post key={index} {...post} />
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