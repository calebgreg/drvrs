export default function Layout({ children }) {
  return (
    <div style={{ margin: 0, padding: 0, background: "#0a1a14", minHeight: "100vh" }}>
      <style>{`
        body { margin: 0 !important; padding: 0 !important; background: #0a1a14 !important; }
        #root > div > div { padding: 0 !important; margin: 0 !important; }
        * { box-sizing: border-box; }
      `}</style>
      {children}
    </div>
  );
}