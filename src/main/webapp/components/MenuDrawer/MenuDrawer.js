Vue.component("menu-drawer", {
    data: function() {
        return {
            translateX: "translateX(-360px)",
            visibility: "hidden"
        }
    },
    
    created(){
        this.$root.$refs.menuDrawer = this;
    },

    computed: {
        logged() {
            return !utils.isNull(store.getters.email);
        },
        email() {
            return store.getters.email;
        }
    },

    methods: {
        logout(message) {
            app.logout(message)
        },
        login(message) {
            app.login(message)
        },
        hideMenuDrawer(){
            this.translateX = "translateX(-360px)";
        },
        show: function(){
            this.translateX = "translateX(0px)";
        }
    },
    template: `
        <div class='menu-drawer' ref='menuDrawer' v-bind:style="{ 'transform': translateX}">
            <div class="menu-drawer-header">
                <sm-button-close class='button' label="" @on-click='hideMenuDrawer'></sm-button-close>
            </div>
            <div class="menu-drawer-content">
                <ul>
                    <li><router-link tag="a" to="/aktualnosci">Aktualności</router-link></li>
                    <li><router-link tag="a" to="/aktualnosci">O nas</router-link></li>
                    <li v-show='logged'><router-link tag="a" to="/pacjenci">Kontrahenci</router-link></li>
                    <li v-show='logged'><router-link tag="a" to="/uzytkownicy-konta">Konta</router-link></li>
                    <!--<li v-show='logged'><router-link tag="a" to="/kody-jednorazowe">Kody</router-link></li>-->
                    <li v-show='logged'><router-link tag="a" to="/slowniki">Słowniki</router-link></li>
                    <li v-show='logged'><router-link tag="a" to="/konfiguracja">Konfiguracja</router-link></li>   
                    <li v-show='logged'><router-link tag="a" to="/logowanie">Logowanie</router-link></li>   

                    <li v-if="$route.path.includes('/zmiana-hasla/')"><router-link tag="a" to="/zmiana-hasla">Zmiana hasła</router-link></li>
                    <li v-if="$route.path.includes('/aktywacja-konta/')"><router-link tag="a" to="/aktywacja-konta">Aktywacja konta</router-link></li>
                    <!--
                    <li v-show='logged'><router-link tag="a" to="/typy-dokumentow">Typy dokumentów</router-link></li>
                    <li v-show='logged'><router-link tag="a" to="/typy-edokumentow">Typy e-dokumentów</router-link></li>
                    <li v-show='logged'><router-link tag="a" to="/typy-grup">Typy grup</router-link></li>
                    <li v-show='logged'><router-link tag="a" to="/typy-komunikatow">Typy komunikatów</router-link></li>
                    <li v-show='logged'><router-link tag="a" to="/komorki-organizacyjne">Komórki organizacyjne</router-link></li>
                    -->
                </ul>
            </div>
        </div>
    `
});