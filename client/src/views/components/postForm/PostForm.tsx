import { FC, useState } from 'react';
import './PostForm.scss';


interface PostFormProps {
    addPost: (newPost: any) => void;
}

const PostForm: FC<PostFormProps> = ({ addPost }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState<string | null>(null);

    const handlePostSubmit = (e: any) => {
        e.preventDefault();
        if (content.trim()) {
            addPost({ content, image });
            setContent('');
            setImage(null);
        }
    };

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
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
