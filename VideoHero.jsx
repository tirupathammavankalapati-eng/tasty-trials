import React from "react";

export default function VideoHero() {
  return (
    <div className="w-full aspect-video overflow-hidden rounded-lg">
      <video className="w-full h-full object-cover" src="https://cdn.coverr.co/videos/coverr-pouring-tomato-sauce-over-pasta-7713/1080p.mp4" autoPlay loop muted playsInline />
    </div>
  );
}
