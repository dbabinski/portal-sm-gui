import router from "./router";
import { getCookie } from "@/lib/auth";
import { isNull } from "@/lib/utils";
import getPageTitle from "@/lib/get-page-title";

// const whiteList = ["/", "/auth-redirect", "/login", "/dashboard-user", "/articles", "/articles/{*}"];
const blackList = ["/admin", '/admin/dashboard', '/admin/documentation', '/admin/users', '/admin/clients', '/admin/articles' ]
router.beforeEach(async (to, from, next) => {
  // after each change route - change page title
  // TODO - page load defult (app-test) title before loading:
  // TODO fix it
  document.title = getPageTitle(to.meta.title);


  try {
    if (isNull(getCookie().jti)) {

      if (!blackList.indexOf(to.path) !== -1) {
        next();
      } else {
        next(`/login?redirect=${to.path}`);
      }


    } else {
      if (getCookie().permissions.administracja.add === true) {
        if (to.path === "/login") {
          next({ path: "/admin" });
        } else {
          next();
        }
      } else {
        if(to.path === "/admin" 
                        || to.path === '/admin/dashboard'
                        || to.path === '/admin/documentation'
                        || to.path === '/admin/users'
                        || to.path === '/admin/clients'
                        || to.path === '/admin/articles' ) next({path: "/"})
        if (to.path === "/login") {
          next({ path: "/" });
        } else {
          next();
        }
      }
    }
  } catch (e) {
    // console.error(e.name + ": " + e.message);
  }
});

// TODO - Add interval permissions check.

router.afterEach(() => {
  // TODO progres bar
});
