"use client";
import { ReactNode, useRef, useEffect } from "react";
import init from "@tollbit/core-integrate-tile/resize";

export default function TileWrapper({ children }: { children: ReactNode }) {
  const tileContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tileContentRef.current) {
      init(tileContentRef.current);
    }
  }, []);
  return <div ref={tileContentRef}>{children}</div>;
}
