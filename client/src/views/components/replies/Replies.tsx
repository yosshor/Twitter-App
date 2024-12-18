import React, { FC } from "react";
import "./Replies.scss";

export interface CommentDetails {
    userId: string;
    content: string;
    createdAt: string;
    userDetails: {
        profileImage: string;
        fullName: string;
    };
}

export interface Reply {
    commentsDetails: CommentDetails[];
}

const TwitterReplies: FC<Reply> = ({ commentsDetails }) => {
    return (
        <div className="replies-container">
            {commentsDetails.map((comment, index) => (
                <div key={index} className="reply-row">
                    <div className="avatar">
                        <img src={comment.userDetails.profileImage} alt={`${comment.userDetails.fullName}'s avatar`} />
                    </div>
                    <div className="reply-content">
                        <div className="user-details">
                            <span className="name">{comment.userDetails.fullName}</span>
                            <span className="handle">{comment.userDetails.fullName}</span>
                            <span className="timestamp">{comment.createdAt}</span>
                        </div>
                        <div className="text-content">{comment.content}</div>
                        <div className="media-container">
                            <img key={comment.userId} src={comment.userDetails.profileImage} alt={`Media ${comment.userId}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TwitterReplies;
