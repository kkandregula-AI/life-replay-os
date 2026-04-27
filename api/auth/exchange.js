export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "Missing authorization code" });

  const clientId     = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri  = `${process.env.APP_URL || "https://life-replay-os.vercel.app"}/auth/callback`;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: "Google OAuth credentials not configured" });
  }

  try {
    const resp = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id:     clientId,
        client_secret: clientSecret,
        redirect_uri:  redirectUri,
        grant_type:    "authorization_code",
      }).toString(),
    });

    const data = await resp.json();
    if (data.error) throw new Error(data.error_description || data.error);

    // Return access token + expiry to frontend (stored in localStorage)
    return res.status(200).json({
      access_token:  data.access_token,
      refresh_token: data.refresh_token,
      expires_in:    data.expires_in,
      token_type:    data.token_type,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
