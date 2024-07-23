"use client";
import { useEffect, useRef } from "react";
import resize from "@tollbit/core-integrate-tile/resize";

export default function Tile({ src }: { src: string }) {
  const tileRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (tileRef.current) {
      resize(tileRef.current);
    }
  }, []);

  return (
    <iframe
      ref={tileRef}
      style={{ width: "100%", height: "100vh" }}
      sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-top-navigation-by-user-activation"
      src={src}
    />
  );
}
