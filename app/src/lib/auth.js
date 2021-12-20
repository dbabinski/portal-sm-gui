import { getJSON } from "@/lib/cookies";

export function getCookie() {
  try {
    let cookie = getJSON();
    if (cookie) {
      return cookie
    }else {
      return ""
    }
  } catch (e) {
    console.error(e.name + ": " + e.message);
  }
}
