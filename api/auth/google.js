export default function handler(req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return res.status(500).json({ error: "GOOGLE_CLIENT_ID not configured in Vercel env vars" });

  const redirectUri = `${process.env.APP_URL || "https://life-replay-os.vercel.app"}/auth/callback`;

  const params = new URLSearchParams({
    client_id:     clientId,
    redirect_uri:  redirectUri,
    response_type: "code",
    scope:         "https://www.googleapis.com/auth/gmail.readonly",
    access_type:   "offline",
    prompt:        "consent",
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return res.status(200).json({ url });
}
