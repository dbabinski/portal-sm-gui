const ViewPortal = { template: "<view-portal></view-portal>" };
const ViewAktualnosci = { template: "<view-aktualnosci></view-aktualnosci>" };
const ViewPacjenci = { template: "<view-pacjenci></view-pacjenci>" };
const ViewUzytkownicyKonta = { template: "<view-uzytkownicy-konta></view-uzytkownicy-konta>" };
const ViewSlowniki = {  template: "<view-slowniki></view-slowniki>" };
const ViewLogowanie = {  template: "<view-logowanie></view-logowanie>" };
const ViewKonfiguracja = { template: "<view-konfiguracja></view-konfiguracja>" };
const ViewKonto = { template: "<view-konto></view-konto>" };

const ViewImport = { template: "<view-import></view-import>" };
const ViewAktywacjaKonta = { template: "<view-aktywacja-konta :uuid='$route.params.uuid'></view-aktywacja-konta>" };
const ViewZmianaHasla = { template: "<view-zmiana-hasla :token='$route.params.token'></view-zmiana-hasla>" };
const ViewKodyJednorazowe = { template: "<view-kody-jednorazowe></view-kody-jednorazowe>" };
const ViewLogi = { template: "<view-logi></view-logi>" };
const ViewLogowaniaDoSystemu = { template: "<view-logowania-do-systemu></view-logowania-do-systemu>" };
const ViewAktualnieZalogowani = { template: "<view-aktualnie-zalogowani></view-aktualnie-zalogowani>" };
const ViewTypyDokumentow = { template: "<view-typy-dokumentow></view-typy-dokumentow>"};
const ViewTypyEDokumentow = { template: "<view-typy-edokumentow></view-typy-edokumentow>"};
const ViewTypyGrup = { template: "<view-typy-grup></view-typy-grup>"};
const ViewGrupyUzytkownikow = { template: "<view-uzytkownicy-grupy></view-uzytkownicy-grupy>"};
const ViewUzytkownicyUprawnienia = { template: "<view-uzytkownicy-uprawnienia></view-uzytkownicy-uprawnienia>"};
const ViewTypyKomunikatow = { template: "<view-typy-komunikatow></view-typy-komunikatow>"};
const ViewKomorkiOrganizacyjne = { template: "<view-komorki-organizacyjne></view-komorki-organizacyjne>"};
const ViewTypyPowiadomień = { template: "<view-typy-powiadomien></view-typy-powiadomien>"};

const routes = [
    { path: '*', redirect: "/aktualnosci" },
    { path: "/", redirect: "/aktualnosci" },
    { path: "/aktualnosci", component: ViewAktualnosci},
    { path: "/pacjenci", component: ViewPacjenci },
    { path: "/uzytkownicy-konta", component: ViewUzytkownicyKonta },
    { path: "/slowniki", component: ViewSlowniki,
        children: [
            { path: '/', redirect: "/komorki-organizacyjne" },
            { path: "/typy-dokumentow", component: ViewTypyDokumentow},
            { path: "/typy-e-dokumentow", component: ViewTypyEDokumentow},
            { path: "/typy-grup-uzytkownikow", component: ViewTypyGrup},
            { path: "/grupy-uzytkownikow", component: ViewGrupyUzytkownikow},
            { path: "/uzytkownicy-grupy-uprawnienia", component: ViewUzytkownicyUprawnienia},
            { path: "/typy-komunikatow", component: ViewTypyKomunikatow},
            { path: "/komorki-organizacyjne", component: ViewKomorkiOrganizacyjne},
            { path: "/typy-powiadomien", component: ViewTypyPowiadomień},
        ]
    },
    { path: "/konfiguracja", component: ViewKonfiguracja },
    { path: "/import", component: ViewImport },
    { path: "/kody-jednorazowe", component: ViewKodyJednorazowe },
    { path: "/aktywacja-konta/:uuid", component: ViewAktywacjaKonta },
    { path: "/zmiana-hasla/:token", component: ViewZmianaHasla},
    { path: "/logowanie", component: ViewLogowanie,
		children: [
			{ path: '/', redirect: "/logi" },
			{ path: "/logi", component: ViewLogi},
            { path: "/logowania-do-systemu", component: ViewLogowaniaDoSystemu},
            { path: "/aktualnie-zalogowani", component: ViewAktualnieZalogowani},
		]
	},
    { path: "/nowe-konto",
        beforeEnter: (to, from, next) => {
            router.push('/aktualnosci');
            app.newAccount();
        }
    },
    { path: "/konto", component: ViewKonto }
];

const router = new VueRouter({
    routes: routes
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
    },
    mutations: {
        //synchronicznie
        initialiseStore(state) {
            let cookie = cookies.getJSON();
            if(cookie != null) {
                state.email = cookie.email;
            }
        },
        login(state, payload) {
            state.email = payload.email;
        },
        logout(state) {
            localStorage.removeItem("e-uslug.store");
            state.email = "";
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
        }
    }
});
//-----------------------------------------------------------------------------
var app = new Vue({
    router,
    el: "#app",
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
                localStorage.setItem("e-uslugi.store", JSON.stringify(state));
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
            app.getDialogLogin().clear().show(message);
        },
        logout(message) {
            const self = this;
            fetch("/euslugi-zarzadzanie-server/autentykacja/logout")
                .then(res => {
                    store.dispatch("logout");
                    router.push("/");
                    app.getDialogLogin().show(message);
                    self.logged = false;
                    return res.json();
                })
                .then(json => {
                    // app.toast(json.komunikat);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        checkLogin() {
            let cookie = cookies.getJSON();
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
                        email: cookie.email
                    });
                }
            }
        },
        newAccount() {
            this.getDialogLogin().addItemSelf();
        }
    }
});