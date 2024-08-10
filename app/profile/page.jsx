"use client";

import Profile from "@components/Profile";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  const handleEdit = async (id) => {
    router.push(`/update-prompt?id=${id}`);
  };

  const handleDelete = async (id) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?",
    );
    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${id.toString()}`, {
          method: "DELETE",
        });

        const filteredPost = posts.filter((posts) => posts._id !== id);
        setPosts(filteredPost);
      } catch (e) {
        console.log("Error on delete post:", e);
      }
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session.user.id}/posts`);
      const data = await response.json();

      setPosts(data);
    };

    if (session?.user.id) {
      fetchPosts();
    }
  }, [session]);

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default ProfilePage;
