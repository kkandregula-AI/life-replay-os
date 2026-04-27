export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { refresh_token } = req.body;
  if (!refresh_token) return res.status(400).json({ error: "Missing refresh_token" });

  const clientId     = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  try {
    const resp = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        refresh_token,
        client_id:     clientId,
        client_secret: clientSecret,
        grant_type:    "refresh_token",
      }).toString(),
    });
    const data = await resp.json();
    if (data.error) throw new Error(data.error_description || data.error);
    return res.status(200).json({ access_token: data.access_token, expires_in: data.expires_in });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
