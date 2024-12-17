import { useContext, FC, useState, useRef } from "react";
import './PostForm.scss';
import { productionState } from "../../../pages/home/HomePage";

interface PostFormProps {
    addPost: (newPost: any) => void;
}

function getCookie(name: string): string {
    return document.cookie.split("; ").reduce((r, v) => {
        const parts = v.split("=");
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, "");
}

async function addPostImage(image: File, token: string, postId: string, url: string): Promise<void> {
    const imageFormData = new FormData();
    imageFormData.append("image", image);
    imageFormData.append("postId", postId);

    const imageResponse = await fetch(`${url}/api/post/upload-post-picture?postId=${postId}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: imageFormData,
    });

    if (imageResponse.ok) {
        const response = await imageResponse.json();
        console.log("Image uploaded successfully");
        return response;
    } else {
        console.error("Image upload failed", imageResponse);
    }
}

const PostForm: FC<PostFormProps> = ({ addPost }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const state = useContext(productionState);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]); // Update state with the selected file
        }
    };

    const handlePostSubmit = async (e: any) => {
        e.preventDefault();
        try {

            if (content.trim()) {
                const token: string = getCookie("userTwitter");
                console.log("token:", token);
                const formData = new FormData();
                formData.append("content", content);
                formData.append("userToken", getCookie("userTwitter"));
                const response = await fetch(`${state.url}/api/post`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (response.ok) {
                    const postResponse = await response.json();
                    const postId = postResponse._id;
                    console.log("postId:", postId);

                    //upload the image separately after post creation
                    if (selectedFile) {
                        const res = await addPostImage(selectedFile, token, postId, state.url);
                        addPost(res);
                        setSelectedFile(null);
                    }
                    else {
                        addPost(postResponse);
                    }
                    // Clear form state
                    setContent("");
                    setSelectedFile(null);
                    setImage(null);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = ""; // Clear the file input
                    }
                    console.log("Post created successfully");
                } else {
                    alert("Error creating post");
                }
            }
        } catch (err) {
            console.error("Error:", err);
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        }
    };

    return (
        <div className="postForm">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening?"
                className="postForm__textarea"
            />
            <div className="postForm__actions">
                <input type="file"
                    name='image'
                    className="upload-button"
                    onChange={handleFileChange}
                    ref={fileInputRef} // Attach the ref to the file input
                />
                <button onClick={handlePostSubmit} className="postForm__button">
                    Post
                </button>
            </div>
            {image && <img src={image} alt="Post preview" className="postForm__image" />}
        </div>
    );
}

export default PostForm;
