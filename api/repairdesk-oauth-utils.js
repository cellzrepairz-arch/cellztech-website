export function getRepairDeskBaseUrl() {
  return (process.env.REPAIRDESK_BASE_URL || 'https://api.repairdesk.co/api/web/v1').replace(/\/+$/, '');
}

export function getOAuthBaseUrl() {
  return (process.env.REPAIRDESK_OAUTH_BASE_URL || `${getRepairDeskBaseUrl()}/oauth2`).replace(/\/+$/, '');
}

export function getRepairDeskRedirectUri(req) {
  if (process.env.REPAIRDESK_REDIRECT_URI) return process.env.REPAIRDESK_REDIRECT_URI;

  const host = req?.headers?.['x-forwarded-host'] || req?.headers?.host;
  const proto = req?.headers?.['x-forwarded-proto'] || 'https';
  if (host) return `${proto}://${host}/api/repairdesk/oauth/callback`;

  return 'https://cellztech-website.vercel.app/api/repairdesk/oauth/callback';
}

export async function parseJsonResponse(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function requireSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  return {
    supabaseUrl: supabaseUrl.replace(/\/+$/, ''),
    serviceKey,
    table: process.env.SUPABASE_REPAIRDESK_TOKENS_TABLE || 'repairdesk_oauth_tokens'
  };
}

function tokenTableUrl() {
  const { supabaseUrl, table } = requireSupabaseConfig();
  return `${supabaseUrl}/rest/v1/${table}`;
}

function supabaseHeaders(prefer) {
  const { serviceKey } = requireSupabaseConfig();
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
    ...(prefer ? { Prefer: prefer } : {})
  };
}

export async function saveRepairDeskTokens(tokenResponse) {
  if (!tokenResponse?.access_token) {
    throw new Error('RepairDesk token response did not include an access token');
  }

  const expiresIn = Number(tokenResponse.expires_in || 3600);
  const expiresAt = new Date(Date.now() + Math.max(expiresIn - 120, 60) * 1000).toISOString();
  const record = {
    id: 'primary',
    access_token: tokenResponse.access_token,
    refresh_token: tokenResponse.refresh_token || null,
    token_type: tokenResponse.token_type || 'Bearer',
    expires_at: expiresAt,
    raw_response: tokenResponse,
    updated_at: new Date().toISOString()
  };

  const response = await fetch(`${tokenTableUrl()}?on_conflict=id`, {
    method: 'POST',
    headers: supabaseHeaders('resolution=merge-duplicates,return=representation'),
    body: JSON.stringify(record)
  });
  const data = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(`Could not save RepairDesk OAuth tokens: ${JSON.stringify(data).slice(0, 500)}`);
  }

  return data;
}

export async function getSavedRepairDeskTokens() {
  const response = await fetch(`${tokenTableUrl()}?id=eq.primary&select=*`, {
    method: 'GET',
    headers: supabaseHeaders()
  });
  const data = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(`Could not read RepairDesk OAuth tokens: ${JSON.stringify(data).slice(0, 500)}`);
  }

  return Array.isArray(data) ? data[0] : null;
}

export async function exchangeRepairDeskCodeForTokens(code, redirectUri) {
  const clientId = process.env.REPAIRDESK_CLIENT_ID;
  const clientSecret = process.env.REPAIRDESK_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing REPAIRDESK_CLIENT_ID or REPAIRDESK_CLIENT_SECRET');
  }

  const response = await fetch(`${getOAuthBaseUrl()}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret
    })
  });
  const data = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(`RepairDesk OAuth token exchange failed: ${JSON.stringify(data).slice(0, 700)}`);
  }

  return data;
}

export async function refreshRepairDeskTokens(refreshToken) {
  const clientId = process.env.REPAIRDESK_CLIENT_ID;
  const clientSecret = process.env.REPAIRDESK_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing REPAIRDESK_CLIENT_ID or REPAIRDESK_CLIENT_SECRET');
  }
  if (!refreshToken) {
    throw new Error('Missing RepairDesk refresh token. Reconnect RepairDesk OAuth.');
  }

  const response = await fetch(`${getOAuthBaseUrl()}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret
    })
  });
  const data = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(`RepairDesk OAuth refresh failed: ${JSON.stringify(data).slice(0, 700)}`);
  }

  return data;
}

export async function getRepairDeskAccessToken() {
  const saved = await getSavedRepairDeskTokens();
  if (!saved?.access_token) {
    throw new Error('RepairDesk OAuth is not connected yet. Visit /api/repairdesk/oauth/start after deploying.');
  }

  const expiresAt = saved.expires_at ? new Date(saved.expires_at).getTime() : 0;
  const shouldRefresh = !expiresAt || expiresAt <= Date.now() + 120000;
  if (!shouldRefresh) return saved.access_token;

  const refreshed = await refreshRepairDeskTokens(saved.refresh_token);
  const merged = {
    ...refreshed,
    refresh_token: refreshed.refresh_token || saved.refresh_token
  };
  await saveRepairDeskTokens(merged);
  return merged.access_token;
}

export function buildRepairDeskApiUrl(path) {
  return `${getRepairDeskBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function repairDeskFetch(path, options = {}) {
  const accessToken = await getRepairDeskAccessToken();
  return fetch(buildRepairDeskApiUrl(path), {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {})
    }
  });
}
