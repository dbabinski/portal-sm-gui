import router from "./router";
import { getCookie } from "@/lib/auth";
import { isNull } from "@/lib/utils";
import getPageTitle from "@/lib/get-page-title";

const whiteList = ["/login", "/auth-redirect"];

router.beforeEach(async (to, from, next) => {
  // after each change route - change page title
  // TODO - page load defult (app-test) title before loading:
  // TODO fix it
  document.title = getPageTitle(to.meta.title);

  try {
    // const hasToken = getCookie().jti;
    // const cookie = getCookie().permissions.administracja.add;
    // console.log(cookie);
    if (!isNull(getCookie().jti)) {
      if (getCookie().permissions.administracja.add === true) {
        if (to.path === "/login" || to.path === "/" ) {
          next({ path: "/admin" });
        } else {
          next();
        }
      } else {
        if (to.path === "/login") {
          next({ path: "/" });
        } else {
          next();
        }
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        next(`/login?redirect=${to.path}`);
      }
    }
  } catch (e) {
    console.error(e.name + ": " + e.message);
  }
});

// TODO - Add interval permissions check.

router.afterEach(() => {
  // TODO progres bar
});
