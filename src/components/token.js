function isTokenExpired(token) {
  if (!token) return true;

  const payload = JSON.parse(atob(token.split(".")[1]));
  const exp = payload.exp * 1000; // convert to ms

  return Date.now() > exp;
}

export function getToken() {
  const token = localStorage.getItem("token");

  if (isTokenExpired(token)) {
    localStorage.removeItem("token");
    return null;
  }

  return token;
}
