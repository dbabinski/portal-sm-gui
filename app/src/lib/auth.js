import { getCookieMeta } from "@/lib/cookies";

export function getToken() {
  try {
    return getCookieMeta();
  } catch (e) {
    console.error(e.name + ": " + e.message);
  }
}
