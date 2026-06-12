const https = require("https");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function json(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(data));
}

function postToSupabase(payload) {
  return new Promise((resolve, reject) => {
    const baseUrl = String(SUPABASE_URL || "").replace(/\/$/, "");
    const url = new URL(`${baseUrl}/rest/v1/site_visit_events`);

    const body = JSON.stringify(payload);

    const req = https.request(
      url,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          resolve({
            ok: response.statusCode >= 200 && response.statusCode < 300,
            statusCode: response.statusCode,
            body: data,
          });
        });
      }
    );

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return json(res, 405, {
        ok: false,
        error: "Method not allowed",
      });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return json(res, 500, {
        ok: false,
        error: "Missing Supabase environment variables",
        hasUrl: Boolean(SUPABASE_URL),
        hasServiceKey: Boolean(SUPABASE_SERVICE_ROLE_KEY),
      });
    }

    let body = req.body || {};

    if (typeof body === "string") {
      try {
        body = JSON.parse(body || "{}");
      } catch {
        body = {};
      }
    }

    const payload = {
      path: String(body.path || "/").slice(0, 500),
      page: String(body.page || "").slice(0, 500),
      language: String(body.language || "en").slice(0, 20),
      referrer: String(body.referrer || "").slice(0, 1000),
      user_agent: String(req.headers["user-agent"] || "").slice(0, 1000),
    };

    const result = await postToSupabase(payload);

    if (!result.ok) {
      return json(res, 500, {
        ok: false,
        error: "Supabase insert failed",
        statusCode: result.statusCode,
        details: result.body,
      });
    }

    return json(res, 200, {
      ok: true,
      tracked: true,
    });
  } catch (error) {
    return json(res, 500, {
      ok: false,
      error: error && error.message ? error.message : "Unknown visitor tracking error",
    });
  }
};
