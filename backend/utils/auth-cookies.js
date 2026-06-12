const refreshCookieName = "refreshToken";

function cookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api/auth",
    maxAge: 30 * 24 * 60 * 60 * 1000
  };
}

export function setRefreshCookie(res, refreshToken) {
  res.cookie(refreshCookieName, refreshToken, cookieOptions());
}

export function clearRefreshCookie(res) {
  res.clearCookie(refreshCookieName, {
    path: "/api/auth"
  });
}

export function getRefreshToken(req) {
  return req.cookies?.[refreshCookieName] || req.body?.refreshToken || null;
}
