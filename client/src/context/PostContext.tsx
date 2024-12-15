import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type PostType = {
  _id: string;
  content: string;
  imageURL: string;
  author: {
    _id: string;
    username: string;
    image: string;
  };
  likes: string[];
  comments: any[];
  createdAt: string;
};

type PostContextType = {
  posts: PostType[];
  loading: boolean;
  fetchPosts: () => Promise<void>;
};

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
};

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/posts/getPosts");
      const jsonResponse = await response.json();
      if (jsonResponse.posts) {
        setPosts(jsonResponse.posts);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostContext.Provider value={{ posts, loading, fetchPosts }}>
      {children}
    </PostContext.Provider>
  );
};
