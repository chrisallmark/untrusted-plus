"use client";
import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

const subscribe = () => () => {};
const getClientSnapshot = () =>
  window.innerWidth < 1344 || window.innerHeight < 768;
const getServerSnapshot = () => false;

export default function Home() {
  const router = useRouter();
  const isMobile = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    if (!getClientSnapshot()) {
      router.push("/untrusted/index.html");
    }
  }, [router]);

  if (!isMobile) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: "2rem",
        textAlign: "center",
        fontFamily: "monospace",
        backgroundColor: "#000",
        color: "#0f0",
      }}
    >
      <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠</p>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        Desktop Required
      </h1>
      <p style={{ maxWidth: "400px", lineHeight: 1.6, color: "#9f9" }}>
        Untrusted+ is intended to be played on a desktop computer. Please open
        this page on a device with a screen of at least 1344&times;768.
      </p>
    </div>
  );
}
