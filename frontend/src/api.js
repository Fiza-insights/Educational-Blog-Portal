const TOKEN = "emberly_token";
const USER = "emberly_user";

export function getToken() {
  try { return localStorage.getItem(TOKEN); } catch (e) { return null; }
}

export function getUser() {
  try { return JSON.parse(localStorage.getItem(USER) || "null"); } catch (e) { return null; }
}

export function saveLogin(token, user) {
  try { localStorage.setItem(TOKEN, token); localStorage.setItem(USER, JSON.stringify(user)); } catch (e) {}
}

export function clearLogin() {
  try { localStorage.removeItem(TOKEN); localStorage.removeItem(USER); } catch (e) {}
}

export async function api(path, options) {
  const opts = options || {};
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = "Bearer " + token;
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  let res;
  try {
    res = await fetch("/api" + path, {
      method: opts.method || "GET",
      headers: headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
  } catch (e) {
    throw new Error("Request failed. Is the server running?");
  }
  let data = null;
  try { data = await res.json(); } catch (e) {}
  if (res.status === 401 && token && path.indexOf("/auth/login") !== 0) {
    clearLogin();
    window.location.href = "/login";
  }
  if (!res.ok) throw new Error((data && data.error) || "Request failed");
  return data;
}
