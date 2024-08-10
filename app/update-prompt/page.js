"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

import Form from "@components/Form";

const Component = () => {
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    prompt: "",
    tag: "",
  });

  const router = useRouter();

  const searchParams = new useSearchParams();
  const promptId = searchParams.get("id");

  useEffect(() => {
    const getPromptDetails = async () => {
      const response = await fetch(`/api/prompt/${promptId}`, {});

      const data = await response.json();

      setPost({
        prompt: data.prompt,
        tag: data.tag,
      });
    };

    if (promptId) {
      getPromptDetails();
    }
  }, [promptId]);

  const editPrompt = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitting(true);

      if (!promptId) return alert("Prompt not found");

      try {
        const response = await fetch(`/api/prompt/${promptId}`, {
          method: "PATCH",
          body: JSON.stringify({
            prompt: post.prompt,
            tag: post.tag,
          }),
        });

        if (response.ok) {
          router.push("/");
        }
      } catch (e) {
        console.log("Error on edit :", e);
      } finally {
        setSubmitting(false);
      }
    },
    [post, promptId],
  );
  return (
    <Form
      type="Edit"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={editPrompt}
    />
  );
};

const EditPrompt = () => (
  <Suspense>
    <Component />
  </Suspense>
);

export default EditPrompt;
