import { isNull } from "@/lib/utils"

const getters = {
    email(state) {
      return state.user.email;
    },
    isLogged(state) {
      return !isNull(state.user.email);
    },
    permissions(state) {
      return state.user.permissions;
    },
    scope(state) {
      return state.user.scope;
    },
    token(state) {
      return state.user.token;
    },
    sidebar(state) {
      return state.app.sidebar;
    }
}
export default getters