import { useContext, FC, useState } from "react";
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

async function addPostImage(image: File, token: string, postId: string, url:string): Promise<void> {
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
        console.log("Image uploaded successfully");
    } else {
        console.error("Image upload failed", imageResponse);
    }
}

const PostForm: FC<PostFormProps> = () => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const state = useContext(productionState);

    const handlePostSubmit = async (e: any) => {
        e.preventDefault();
        try {
            let file = null;
            if (file) {
                file = dataURItoBlob(file); // Convert base64 image to Blob
            }

            if (content.trim()) {
                const token: string = getCookie("auth");
                console.log("token:", token);
                const formData = new FormData();
                formData.append("content", content);
                // formData.append("image", file as Blob);
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
                    // Upload the image separately after post creation
                    // if (file) {
                    //     const fileWithProperties = new File([file], "image.jpg", { type: file.type });
                    //     console.log("fileWithProperties:", fileWithProperties);
                    //     await addPostImage(fileWithProperties, token, postId, state.url);
                    // }

                    // Add the post to the state (UI updates)
                    // addPost({ content, image });

                    // Clear form state
                    setContent('');
                    setImage(null);
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

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    };

    const dataURItoBlob = (dataURI: string): Blob => {
        const byteString = atob(dataURI.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/jpeg' });
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
                <input type="file" onChange={handleImageChange} />
                <button onClick={handlePostSubmit} className="postForm__button">
                    Post
                </button>
            </div>
            {image && <img src={image} alt="Post preview" className="postForm__image" />}
        </div>
    );
}

export default PostForm;
