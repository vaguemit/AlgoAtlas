"use client";

import dynamic from "next/dynamic";

const MotionComponent = dynamic(() => import("./MotionComponent"), {
  ssr: false,
});

export default function MyDynamicFramerComponent() {
  return <MotionComponent />;
} 