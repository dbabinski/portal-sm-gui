Vue.component("menu-logowanie", {
    data: function() {
        return {
            domyslnaSciezka: "/logi",
            elementy: [
                {
                    id: 0,
                    nazwa: "Logi systemu",
                    sciezka: "/logi"
                },
                {
                    id: 1,
                    nazwa: "Logowania do systemu",
                    sciezka: "/logowania-do-systemu"
                },
                {
                    id: 2,
                    nazwa: "Aktualnie zalogowane konta",
                    sciezka: "/aktualnie-zalogowani"
                }
            ],
            selectMenu: false,
            wiersze: [
            ],
        };
    },
    created() {
        if(this.$route.path != this.domyslnaSciezka){
            this.selectMenu = true;
        }
    },
    computed: {
        logged() {
            return !utils.isNull(store.getters.email);
        },
        email() {
            return store.getters.email;
        },
    },
    methods: {
        logout(message) {
            app.logout(message)
        },
        login(message) {
            app.login(message)
        }
    },
    template: `
    <div class='menu-logowanie'>
        <ul class="container">
            <li :id='element.id' v-for='element in elementy' v-show='logged'><router-link tag="a" v-bind:to='element.sciezka'><div>{{element.nazwa}}</div></router-link></li>
        </ul>
    </div>
    `
});