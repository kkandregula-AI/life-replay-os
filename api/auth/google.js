export default function handler(req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return res.status(500).json({ error: "GOOGLE_CLIENT_ID not configured" });

  const redirectUri = `${process.env.APP_URL || "https://life-replay-os.vercel.app"}/auth/callback`;

  const params = new URLSearchParams({
    client_id:     clientId,
    redirect_uri:  redirectUri,
    response_type: "code",
    // gmail.readonly allows REST API reads — no MCP needed
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
    access_type: "offline",
    prompt:      "consent",
  });

  return res.status(200).json({
    url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  });
}
