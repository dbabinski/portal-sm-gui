Vue.component("view-portal", {
    data() {
        return {
        }
    },
    mounted() {
    },
    computed: {
        label() {
            return !utils.isNull(store.getters.email) ? store.getters.email : "Zaloguj się"
        }
    },
    methods: {
        showMenuUser() {
            let cookie = cookies.getJSON();
            if(cookie != null) {
                this.$refs.menuUser.show();
            } else {
                app.login();
            }
        }
    },
    template: `    
    <div class='view-portal'>
        <div class='portal-header-container'>
            <div class='portal-header'>
                <menu-main></menu-main>
                <div class='button-container'>
                    <sm-button class='button' :label='label' @on-click='showMenuUser'></sm-button>
                    <menu-user ref='menuUser'></menu-user>
                </div>
            </div>
        </div>
        <div class='portal-content'>
            <router-view></router-view>
        </div>
    </div>
    `
});