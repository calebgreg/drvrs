import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import DrvrsEngagement from "@/components/engagementRoom/DrvrsEngagement";
import ProjectTrackingView from "@/components/engagementRoom/ProjectTrackingView";

const COLORS = {
  bg: "#0a1a14",
  surface: "#0f2219",
  border: "rgba(245,240,232,0.06)",
  text: "#f5f0e8",
  textMuted: "#7a8a82",
  textDim: "rgba(245,240,232,0.3)",
  accent: "#2d8a6e",
  accentDim: "rgba(45,138,110,0.15)",
};
const fonts = {
  mono: "'JetBrains Mono', 'SF Mono', monospace",
  body: "'DM Sans', 'Helvetica Neue', sans-serif",
  display: "'DM Serif Display', Georgia, serif",
};

export default function RoomAccess() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = window.location.pathname.split("/room/")[1]?.split("?")[0];
  const keyParam = urlParams.get("key");
  const isPreview = urlParams.get("preview") === "1";

  const [state, setState] = useState("checking"); // checking | gate | room | error
  const [email, setEmail] = useState("");
  const [roomData, setRoomData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isPreview) {
      // Admin preview: load room directly without access check
      base44.entities.EngagementRoom.filter({ slug }).then(rooms => {
        if (rooms?.[0]) {
          setRoomData(rooms[0]);
          setState("room");
        } else {
          setState("gate");
        }
      });
      return;
    }

    const storedKey = localStorage.getItem(`room_key_${slug}`);
    const keyToUse = keyParam || storedKey;

    if (keyToUse) {
      verifyAccess({ key: keyToUse });
    } else {
      setState("gate");
    }
  }, []);

  const verifyAccess = async ({ key, email: emailInput }) => {
    setSubmitting(true);
    try {
      const res = await base44.functions.invoke("verifyRoomAccess", {
        slug,
        key: key || undefined,
        email: emailInput || undefined,
      });
      const room = res.data?.room;
      const returnedKey = res.data?.accessKey || key;
      if (room) {
        if (returnedKey) {
          localStorage.setItem(`room_key_${slug}`, returnedKey);
        }
        setRoomData(room);
        setState("room");
      } else {
        setErrorMsg("We couldn't verify your access. Please check your email address.");
        setState("gate");
      }
    } catch {
      setErrorMsg("We couldn't verify your access. Please check your email address.");
      setState("gate");
    } finally {
      setSubmitting(false);
    }
  };

  if (state === "checking") {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.textDim, letterSpacing: 2 }}>LOADING...</div>
      </div>
    );
  }

  if (state === "gate") {
    return (
      <div style={{
        minHeight: "100vh", background: COLORS.bg, display: "flex",
        alignItems: "center", justifyContent: "center", padding: 24,
      }}>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />

        <div style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.7rem", marginBottom: 48 }}>
            <div style={{ width: 22, height: 10, background: COLORS.text, borderRadius: 5 }} />
            <span style={{ fontFamily: fonts.body, fontSize: "1rem", fontWeight: 400, color: COLORS.text, letterSpacing: "0.1em" }}>drvrs</span>
          </div>

          <div style={{ fontFamily: fonts.display, fontSize: 28, fontWeight: 300, color: COLORS.text, marginBottom: 12 }}>
            We built this for you.
          </div>
          <div style={{ fontFamily: fonts.body, fontSize: 14, color: COLORS.textMuted, lineHeight: 1.7, marginBottom: 36 }}>
            Enter your email to access your private room.
          </div>

          {errorMsg && (
            <div style={{ fontFamily: fonts.mono, fontSize: 10, color: "#EF4444", marginBottom: 20, letterSpacing: 0.5 }}>
              {errorMsg}
            </div>
          )}

          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && verifyAccess({ email })}
            style={{
              width: "100%", background: COLORS.surface,
              border: `1px solid ${COLORS.border}`, borderRadius: 6,
              padding: "12px 16px", color: COLORS.text,
              fontFamily: fonts.body, fontSize: 14, outline: "none",
              boxSizing: "border-box", marginBottom: 12, textAlign: "center",
            }}
          />

          <button
            onClick={() => verifyAccess({ email })}
            disabled={submitting || !email}
            style={{
              width: "100%", background: COLORS.accentDim,
              border: `1px solid ${COLORS.accent}55`, borderRadius: 6,
              padding: "12px", cursor: "pointer",
              fontFamily: fonts.mono, fontSize: 11, color: COLORS.accent, letterSpacing: 1,
              opacity: submitting || !email ? 0.5 : 1,
            }}>
            {submitting ? "VERIFYING..." : "ACCESS MY ROOM"}
          </button>
        </div>
      </div>
    );
  }

  if (state === "room" && roomData) {
    if (roomData.status === "signed") {
      return <ProjectTrackingView room={roomData} isAdmin={false} />;
    }
    return <DrvrsEngagement roomData={roomData} />;
  }

  return null;
}