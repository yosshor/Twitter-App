import React from "react";
import "./Replies.scss";

interface Reply {
    user: {
        name: string;
        handle: string;
        avatar: string;
    };
    content: string;
    media?: string[]; // Array of media URLs
    timestamp: string;
}

const replies: Reply[] = [
    {
        user: {
            name: "John Doe",
            handle: "@johndoe",
            avatar: "https://via.placeholder.com/50",
        },
        content: "This is a sample reply to the main tweet. Loving the discussion here!",
        media: ["https://via.placeholder.com/150", "https://via.placeholder.com/150"],
        timestamp: "2h",
    },
    {
        user: {
            name: "Jane Smith",
            handle: "@janesmith",
            avatar: "https://via.placeholder.com/50",
        },
        content: "Here's my perspective on this topic. Great points raised!",
        timestamp: "1h",
    },
];

function TwitterReplies() {
    return (
        <div className="replies-container">
            {replies.map((reply, index) => (
                <div key={index} className="reply-row">
                    <div className="avatar">
                        <img src={reply.user.avatar} alt={`${reply.user.name}'s avatar`} />
                    </div>
                    <div className="reply-content">
                        <div className="user-details">
                            <span className="name">{reply.user.name}</span>
                            <span className="handle">{reply.user.handle}</span>
                            <span className="timestamp">{reply.timestamp}</span>
                        </div>
                        <div className="text-content">{reply.content}</div>
                        {reply.media && reply.media.length > 0 && (
                            <div className="media-container">
                                {reply.media.map((url, idx) => (
                                    <img key={idx} src={url} alt={`Media ${idx + 1}`} />
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            ))}
        </div>
    );
}

export default TwitterReplies;
