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

function compactPreview(value, limit = 900) {
  try {
    return JSON.stringify(value).slice(0, limit);
  } catch {
    return String(value).slice(0, limit);
  }
}

function normalizeTokenResponse(payload) {
  if (!payload || typeof payload !== 'object') return payload;
  if (payload.access_token) return payload;

  const candidates = [payload.data, payload.result, payload.response, payload.token, payload.tokens];
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (Array.isArray(candidate)) {
      const found = candidate.find((item) => item?.access_token);
      if (found) return found;
    }
    if (candidate?.access_token) return candidate;
  }

  return payload;
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
  const tokens = normalizeTokenResponse(tokenResponse);
  if (!tokens?.access_token) {
    throw new Error(`RepairDesk token response did not include an access token. Response preview: ${compactPreview(tokenResponse)}`);
  }

  const expiresIn = Number(tokens.expires_in || 3600);
  const expiresAt = new Date(Date.now() + Math.max(expiresIn - 120, 60) * 1000).toISOString();
  const record = {
    id: 'primary',
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token || null,
    token_type: tokens.token_type || 'Bearer',
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
    throw new Error(`Could not save RepairDesk OAuth tokens: ${compactPreview(data, 500)}`);
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
    throw new Error(`Could not read RepairDesk OAuth tokens: ${compactPreview(data, 500)}`);
  }

  return Array.isArray(data) ? data[0] : null;
}

async function postRepairDeskTokenRequest(body) {
  const url = `${getOAuthBaseUrl()}/token`;

  const jsonResponse = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body)
  });
  const jsonData = await parseJsonResponse(jsonResponse);
  const normalizedJsonData = normalizeTokenResponse(jsonData);

  if (jsonResponse.ok && normalizedJsonData?.access_token) return normalizedJsonData;

  const formResponse = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: new URLSearchParams(body).toString()
  });
  const formData = await parseJsonResponse(formResponse);
  const normalizedFormData = normalizeTokenResponse(formData);

  if (formResponse.ok && normalizedFormData?.access_token) return normalizedFormData;

  if (!jsonResponse.ok && !formResponse.ok) {
    throw new Error(`RepairDesk OAuth token exchange failed. JSON response: ${compactPreview(jsonData, 500)}. Form response: ${compactPreview(formData, 500)}`);
  }

  throw new Error(`RepairDesk token response did not include an access token. JSON response: ${compactPreview(jsonData, 500)}. Form response: ${compactPreview(formData, 500)}`);
}

export async function exchangeRepairDeskCodeForTokens(code, redirectUri) {
  const clientId = process.env.REPAIRDESK_CLIENT_ID;
  const clientSecret = process.env.REPAIRDESK_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing REPAIRDESK_CLIENT_ID or REPAIRDESK_CLIENT_SECRET');
  }

  return postRepairDeskTokenRequest({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret
  });
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

  return postRepairDeskTokenRequest({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret
  });
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
