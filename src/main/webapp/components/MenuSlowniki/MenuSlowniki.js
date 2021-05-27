Vue.component("menu-slowniki", {
    data: function() {
        return {
            domyslnaSciezka: "/komorki-organizacyjne",
            elementy: [
                {
                    id: 0,
                    nazwa: "Komórki organizacyjne",
                    sciezka: "/komorki-organizacyjne"
                },
                {
                    id: 1,
                    nazwa: "Typy dokumentów",
                    sciezka: "/typy-dokumentow"
                },
                 {
                    id: 2,
                    nazwa: "Typy e-dokumentów",
                    sciezka: "/typy-e-dokumentow"
                },
                {
                    id: 3,
                    nazwa: "Typy grup użytkowników",
                    sciezka: "/typy-grup-uzytkownikow"
                },
                {
                    id: 4,
                    nazwa: "Typy komunikatów",
                    sciezka: "/typy-komunikatow"
                },
                {
                    id: 5,
                    nazwa: "Typy powiadomień",
                    sciezka: "/typy-powiadomien"
                },
                {
                    id: 6,
                    nazwa: "Grupy użytkowników",
                    sciezka: "/grupy-uzytkownikow"
                },
                {
                    id: 7,
                    nazwa: "Uprawnienia grup użytkowników",
                    sciezka: "/uzytkownicy-grupy-uprawnienia"
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
    <div class='menu-slowniki'>
        <ul class="container">
            <li :id='element.id' v-for='element in elementy' v-show='logged'><router-link tag="a" v-bind:to='element.sciezka'><div>{{element.nazwa}}</div></router-link></li>
        </ul>
    </div>
    `
});