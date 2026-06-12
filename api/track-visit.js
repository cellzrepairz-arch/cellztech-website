const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function json(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(data));
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, {
      ok: false,
      error: "Method not allowed",
    });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return json(res, 500, {
        ok: false,
        error: "Missing Supabase environment variables",
      });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

    const payload = {
      path: String(body.path || "/").slice(0, 500),
      page: String(body.page || "").slice(0, 500),
      language: String(body.language || "en").slice(0, 20),
      referrer: String(body.referrer || "").slice(0, 1000),
      user_agent: String(req.headers["user-agent"] || "").slice(0, 1000),
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/site_visit_events`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      return json(res, 500, {
        ok: false,
        error: "Supabase insert failed",
        details: text,
      });
    }

    return json(res, 200, {
      ok: true,
      tracked: true,
    });
  } catch (error) {
    return json(res, 500, {
      ok: false,
      error: error.message || "Unknown visitor tracking error",
    });
  }
};
