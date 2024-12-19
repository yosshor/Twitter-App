import React, { FC } from "react";
import "./Replies.scss";
import { formatTimeAgo } from "../../../utils/get-formated-date";

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
    state: { url: string };
}

const TwitterReplies: FC<Reply> = ({ commentsDetails, state }) => {
    console.log("commentsDetails", commentsDetails);
    return (
        <div className="replies-container">
            {commentsDetails.map((comment, index) => (
                <div key={index} className="reply-row">
                    <div className="avatar">
                        <img src={comment.userDetails.profileImage.includes('uploads\\users')
                            ? `${state.url.length > 0 ? state.url : '../../../../../'}/`
                            + comment.userDetails.profileImage
                            : comment.userDetails.profileImage} alt={`${comment.userDetails.fullName}'s avatar`} />
                    </div>
                    <div className="reply-content">
                        <div className="user-details">
                            <span className="name">{comment.userDetails.fullName}</span>
                            <span className="handle">@{comment.userDetails.fullName
                                .split(" ")
                                .map((part) => part.toLowerCase().trim())
                                .join("") || ""}</span>
                            <span className="timestamp">
                                {formatTimeAgo(comment.createdAt)}
                            </span>
                        </div>
                        <div className="text-content">{comment.content}</div>
                        {/* <div className="media-container">
                            <img key={comment.userId} src={comment.userDetails.profileImage} alt={`Media ${comment.userId}`} />
                        </div> */}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TwitterReplies;
