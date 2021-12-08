import router from "./router";
import { getToken } from "@/lib/auth";
import { isNull } from "@/lib/utils";
import getPageTitle from "@/lib/get-page-title";

const whiteList = ["/login", "/auth-redirect"];

router.beforeEach(async (to, from, next) => {
  // after each change route - change page title
  // TODO - page load defult (app-test) title before loading:
  // TODO fix it
  document.title = getPageTitle(to.meta.title);

  try {
    const hasToken = getToken();

    if (!isNull(hasToken)) {
      if (to.path === "/login") {
        next({ path: "/" });
      } else {
        next();
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        next(`/login?redirect=${to.path}`);
      }
    }
  } catch(e) {
    console.error(e.name + ": " + e.message);
  }
});

// TODO - Add interval permissions check.

router.afterEach(() => {
  // TODO progres bar
});
