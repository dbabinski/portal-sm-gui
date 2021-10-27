const ViewLogIn = { template: "<view-login></view-login>"};
const ViewPortalMain = { template: "<view-portal-main></view-portal-main>"};
const ViewAdmin = { template: "<view-admin></view-admin>" };
const ViewPanel = { template: "<view-panel></view-panel>"}
const ViewPacjenci = { template: "<view-pacjenci></view-pacjenci>" };
const ViewUzytkownicyKonta = { template: "<view-uzytkownicy-konta></view-uzytkownicy-konta>" };
const ViewKonfiguracja = { template: "<view-konfiguracja></view-konfiguracja>" };

const ViewPanelKlienta = { template: "<view-panel-klienta></view-panel-klienta>" };

const routes = [
    { path: '*', redirect: "/login" },
    { path: "/", redirect: "/login" },
    { path: "/login", component: ViewLogIn},
    { path: "/admin", component: ViewAdmin,
        children: [
            { path: '/', redirect: "panel" },
            { path: 'panel', component: ViewPanel },
            { path: 'uzytkownicy', component: ViewUzytkownicyKonta },
            { path: 'ustawienia', component: ViewKonfiguracja },
            { path: 'pacjenci', component: ViewPacjenci },
        ]},
    { path: "/klient", component: ViewPanelKlienta }
];

const router = new VueRouter({
    routes: routes,
    mode: 'history',
});

router.beforeEach(async (to, from, next) => {
    if(utils.isNull(app)) {        
        await Vue.nextTick(); //oczekiwanie na załadowanie się aplikacji
    }
    next();
});
//-----------------------------------------------------------------------------
var cookies = new Cookies();
//-----------------------------------------------------------------------------
const store = new Vuex.Store({
    strict: true,
    state: {
        email: "",
        permissions: {}
    },
    mutations: {
        //synchronicznie
        initialiseStore(state) {
            let cookie = cookies.baset64ToJSON();
            if(cookie != null) {
                state.email = cookie.email;
                state.permissions = cookie.permissions;
            }
        },
        login(state, payload) {
            state.email = payload.email;
            state.permissions = payload.permissions;
        },
        logout(state) {
            localStorage.removeItem("sm-portal.store");
            state.email = "";
            state.permissions = {};
        }
    },
    actions: {
        //asynchronicznie
        login(state, payload) {
            state.commit("login", payload);
        },
        logout(state) {
            state.commit("logout");
        }
    },
    getters: {
        email(state) {
            return state.email;
        },
        isLogged(state) {
            return !utils.isNull(state.email);
        },
        permissions(state) {
            return state.permissions;
        }
    }
});
//-----------------------------------------------------------------------------
var app = new Vue({
    router,
    el: "#app",
    vuetify: new Vuetify(),
    data: {
        logged: false,
        recaptchaReady: false,
        getMessageDialog() {
            return this.$refs.messageDialog;
        },
        getDialogLogin() {
            return this.$refs.dialogLogin;
        },
        getDialogPasswordResetEmail() {
            return this.$refs.dialogPasswordResetEmail;
        }
    },
    created() {
        let self = this;
        //UWAGA! Blokada zdarzenia "submit", używaj fetch!
        document.body.addEventListener("submit", async function(event) {
            event.preventDefault();
        });

        store.subscribe((mutation, state) => {
            if (mutation == 'initialiseStore' || mutation.type == "login" || mutation.type == "logout") {
                localStorage.setItem("sm-portal.store", JSON.stringify(state));
            }
        });
        store.commit("initialiseStore");
        this.checkLogin()
        var check = setInterval(function() {
            self.checkLogin();
        }, 5000);
    },

    methods: {
        toast(message) {
            this.$refs.toast.show(message);
        },
        showLoadingToast(label) {
            this.$refs.loadingToast.show(label);
        },
        hideLoadingToast() {
            this.$refs.loadingToast.hide();
        },
        send(method, url, object, onReqest, onSucess, onError) {
            fetch(url, {
                method: method,
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: object ? JSON.stringify(object) : null
            })
                .then(res => app.handleErrors(res))
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                        if (typeof onSucess === "function") {
                            onError();
                        }
                    } else {
                        if (typeof onSucess === "function") {
                            onSucess(json);
                        } else {
                            app.toast(json.komunikat);
                        }
                    }
                    if (typeof onReqest === "function") {
                        onReqest();
                    }
                });
        },
        handleErrors(response) {
            if (!response.ok) {
                if (response.status == "401") {
                    // response.json().then(json => {
                    //     let message = json.komunikat;
                    //     app.logout(message);
                    // });
                    app.logout();
                }
                throw Error(response.statusText + " " + response.url);
            }
            return response;
        },
        login(message) {
            if ( store.getters.permissions.administracja.read ) {
                router.push("/admin");
            } else {
                router.push("/klient");
            }

        },
        logout(message) {
            const self = this;
            fetch("/sm-portal-server/autentykacja/logout")
                .then(res => {
                    store.dispatch("logout");
                    router.push("/");
                    self.logged = false;
                    return res.json();
                })
                .then(json => {
                    app.toast(json.komunikat);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        checkLogin() {
            let cookie = cookies.baset64ToJSON();
            if(utils.isNull(cookie)) {
                this.logged = false;
                if(store.getters.isLogged) {
                    store.dispatch("logout");
                    router.push("/");
                }
            } else {
                this.logged = true;
                if(!store.getters.isLogged) {
                    store.dispatch("login", {
                        email: cookie.email,
                        permissions: cookie.permissions
                    });
                     
                }
            }
        },
        newAccount() {
            this.getDialogLogin().addItemSelf();
        }
    }
});