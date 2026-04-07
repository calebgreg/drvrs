import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import RoomBuilder from "@/components/engagementRoom/RoomBuilder";
import RoomsList from "@/components/engagementRoom/RoomsList";

const COLORS = {
  bg: "#0a1a14",
  surface: "#0f2219",
  border: "rgba(245,240,232,0.06)",
  text: "#f5f0e8",
  textMuted: "#7a8a82",
  accent: "#2d8a6e",
  accentDim: "rgba(45,138,110,0.15)",
};
const fonts = {
  mono: "'JetBrains Mono', 'SF Mono', monospace",
  body: "'DM Sans', 'Helvetica Neue', sans-serif",
  display: "'DM Serif Display', Georgia, serif",
};

export default function AdminRooms() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("list"); // "list" | "create" | "edit"
  const [editingRoom, setEditingRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(setUser);
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setLoading(true);
    const data = await base44.entities.EngagementRoom.list("-created_date");
    setRooms(data);
    setLoading(false);
  };

  if (!user || user.role !== "admin") {
    return (
      <div style={{
        minHeight: "100vh", background: COLORS.bg, display: "flex",
        alignItems: "center", justifyContent: "center",
        fontFamily: fonts.mono, color: COLORS.textMuted, fontSize: 13,
      }}>
        Admin access required.
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: fonts.body }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "20px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a href="/" style={{
            display: "flex", alignItems: "center", gap: "0.7rem",
            textDecoration: "none",
          }}>
            <div style={{ width: 22, height: 10, background: COLORS.text, borderRadius: 5 }} />
            <span style={{ fontFamily: fonts.body, fontSize: "1rem", fontWeight: 400, color: COLORS.text, letterSpacing: "0.1em" }}>drvrs</span>
          </a>
          <span style={{ color: COLORS.border, fontSize: 18 }}>|</span>
          <span style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.textMuted, letterSpacing: 2, textTransform: "uppercase" }}>
            Engagement Rooms
          </span>
        </div>
        {view === "list" && (
          <button onClick={() => { setEditingRoom(null); setView("create"); }} style={{
            background: COLORS.accentDim, border: `1px solid ${COLORS.accent}55`,
            borderRadius: 6, padding: "8px 20px", cursor: "pointer",
            fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 1,
          }}>
            + NEW ROOM
          </button>
        )}
        {(view === "create" || view === "edit") && (
          <button onClick={() => { setView("list"); setEditingRoom(null); loadRooms(); }} style={{
            background: "transparent", border: `1px solid ${COLORS.border}`,
            borderRadius: 6, padding: "8px 20px", cursor: "pointer",
            fontFamily: fonts.mono, fontSize: 10, color: COLORS.textMuted, letterSpacing: 1,
          }}>
            ← BACK
          </button>
        )}
      </div>

      <div style={{ padding: "40px" }}>
        {view === "list" && (
          <RoomsList
            rooms={rooms}
            loading={loading}
            onEdit={async (room) => {
              const fresh = await base44.entities.EngagementRoom.get(room.id);
              setEditingRoom(fresh);
              // Use setTimeout to ensure state has flushed before switching view
              setTimeout(() => setView("edit"), 0);
            }}
            onRefresh={loadRooms}
          />
        )}
        {(view === "create" || view === "edit") && (
          <RoomBuilder
            key={editingRoom?.id || "new"}
            room={editingRoom}
            onSaved={() => { setView("list"); loadRooms(); }}
          />
        )}
      </div>
    </div>
  );
}