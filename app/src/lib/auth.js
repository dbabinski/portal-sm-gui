import { getJSON } from "@/lib/cookies";

export function getToken() {
  try {
    let cookie = getJSON();
    if (cookie) {
      return cookie.jti
    }else {
      return null
    }
  } catch (e) {
    console.error(e.name + ": " + e.message);
  }
}
