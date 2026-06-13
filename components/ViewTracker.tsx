"use client"

import { useEffect, useRef } from "react"

export default function ViewTracker({ postId }: { postId: string }) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    
    // Call the tracking API
    fetch(`/api/posts/${postId}/view`, { method: 'POST' }).catch(console.error);
  }, [postId])

  return null;
}
