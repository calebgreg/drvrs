import { useState } from "react";
import { base44 } from "@/api/base44Client";

const COLORS = {
  surface: "#0f2219",
  border: "rgba(245,240,232,0.06)",
  text: "#f5f0e8",
  textMuted: "#7a8a82",
  textDim: "rgba(245,240,232,0.3)",
  accent: "#2d8a6e",
  accentDim: "rgba(45,138,110,0.15)",
  warning: "#F59E0B",
  warningDim: "rgba(245, 158, 11, 0.15)",
  constraint: "#EF4444",
};
const fonts = {
  mono: "'JetBrains Mono', 'SF Mono', monospace",
  body: "'DM Sans', 'Helvetica Neue', sans-serif",
};

const STATUS_COLORS = {
  draft: { color: COLORS.textMuted, bg: "rgba(122,138,130,0.1)", label: "DRAFT" },
  invited: { color: COLORS.warning, bg: COLORS.warningDim, label: "INVITED" },
  viewed: { color: COLORS.accent, bg: COLORS.accentDim, label: "VIEWED" },
};

export default function RoomsList({ rooms, loading, onEdit, onRefresh }) {
  const [sending, setSending] = useState(null);
  const [copied, setCopied] = useState(null);

  const handleSendInvite = async (room) => {
    setSending(room.id);
    try {
      await base44.functions.invoke("sendRoomInvite", { roomId: room.id });
      onRefresh();
    } finally {
      setSending(null);
    }
  };

  const handleCopyLink = (room) => {
    const url = `${window.location.origin}/room/${room.slug}?key=${room.accessKey}`;
    navigator.clipboard.writeText(url);
    setCopied(room.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = async (room) => {
    if (!confirm(`Delete room for ${room.companyName}?`)) return;
    await base44.entities.EngagementRoom.delete(room.id);
    onRefresh();
  };

  if (loading) {
    return (
      <div style={{ fontFamily: fonts.mono, fontSize: 11, color: COLORS.textDim, letterSpacing: 1 }}>
        Loading rooms...
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div style={{ textAlign: "center", paddingTop: 80 }}>
        <div style={{ fontFamily: fonts.mono, fontSize: 11, color: COLORS.textDim, letterSpacing: 2, marginBottom: 16 }}>
          NO ROOMS YET
        </div>
        <div style={{ fontFamily: fonts.body, fontSize: 14, color: COLORS.textMuted }}>
          Create your first engagement room to get started.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.textDim, letterSpacing: 2, marginBottom: 24, textTransform: "uppercase" }}>
        {rooms.length} Room{rooms.length !== 1 ? "s" : ""}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rooms.map((room) => {
          const statusStyle = STATUS_COLORS[room.status] || STATUS_COLORS.draft;
          return (
            <div key={room.id} style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              padding: "20px 24px",
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontFamily: fonts.body, fontSize: 16, color: COLORS.text, fontWeight: 600 }}>
                    {room.companyName}
                  </span>
                  <span style={{
                    fontFamily: fonts.mono, fontSize: 8, color: statusStyle.color,
                    background: statusStyle.bg, padding: "2px 8px", borderRadius: 4, letterSpacing: 1.5,
                  }}>
                    {statusStyle.label}
                  </span>
                </div>
                <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.textMuted, letterSpacing: 0.5 }}>
                  {room.prospectEmail} · /{room.slug}
                </div>
                {room.invitedAt && (
                  <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.textDim, marginTop: 4 }}>
                    Invited {new Date(room.invitedAt).toLocaleDateString()}
                    {room.lastViewedAt && ` · Last viewed ${new Date(room.lastViewedAt).toLocaleDateString()}`}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={() => window.open(`/room/${room.slug}?preview=1`, "_blank")} style={{
                  background: "transparent", border: `1px solid ${COLORS.border}`,
                  borderRadius: 6, padding: "7px 14px", cursor: "pointer",
                  fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1,
                }}>VIEW</button>

                <button onClick={() => onEdit(room)} style={{
                  background: "transparent", border: `1px solid ${COLORS.border}`,
                  borderRadius: 6, padding: "7px 14px", cursor: "pointer",
                  fontFamily: fonts.mono, fontSize: 9, color: COLORS.textMuted, letterSpacing: 1,
                }}>EDIT</button>

                {room.accessKey && (
                  <button onClick={() => handleCopyLink(room)} style={{
                    background: "transparent", border: `1px solid ${COLORS.border}`,
                    borderRadius: 6, padding: "7px 14px", cursor: "pointer",
                    fontFamily: fonts.mono, fontSize: 9,
                    color: copied === room.id ? COLORS.accent : COLORS.textMuted, letterSpacing: 1,
                  }}>
                    {copied === room.id ? "COPIED" : "COPY LINK"}
                  </button>
                )}

                <button
                  onClick={() => handleSendInvite(room)}
                  disabled={sending === room.id}
                  style={{
                    background: COLORS.accentDim, border: `1px solid ${COLORS.accent}55`,
                    borderRadius: 6, padding: "7px 14px", cursor: "pointer",
                    fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1,
                    opacity: sending === room.id ? 0.5 : 1,
                  }}>
                  {sending === room.id ? "SENDING..." : room.status === "draft" ? "SEND INVITE" : "RESEND"}
                </button>

                <button onClick={() => handleDelete(room)} style={{
                  background: "transparent", border: `1px solid rgba(239,68,68,0.2)`,
                  borderRadius: 6, padding: "7px 14px", cursor: "pointer",
                  fontFamily: fonts.mono, fontSize: 9, color: COLORS.constraint, letterSpacing: 1,
                }}>DELETE</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}