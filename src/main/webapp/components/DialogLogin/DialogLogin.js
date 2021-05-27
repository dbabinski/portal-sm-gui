Vue.component("dialog-login", {
    data() {
        return {
            message: null,
            daneLogowania: {
                login: null,
                haslo: null
            },
            logoSrc: null
        };
    },
    computed: {
        isMessage() {
            return !utils.isNull(this.message);
        }
    },
    mounted() {
        let self = this;
        fetch(
            "/sm-portal-server/serwis/konfiguracja/logo/", {
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(res => app.handleErrors(res))
            .then(res => res.json())
            .then(json => {
                if(json.blad === true){
                    console.log(json.komunikat);
                } else {
                    self.logoSrc = json.dane.logo;
                    if(!utils.isNull(self.logoSrc)) {
                        this.$refs.logo.classList.remove('hidden');
                    }
                }
            });
    },
    methods: {
        show(message) {
            this.message = message;
            this.$refs.formDialog.show();
            this.$nextTick(() => this.$refs.login.focus());
            return this;
        },
        login() {
            let self = this;
            fetch("/sm-portal-server/autentykacja/login", {
                method: "POST",
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify(this.daneLogowania)
            })
                .then(res => {
                    return res.json();
                })
                .then(json => {
                    if (json.blad === true) {
                        self.setMessage(json.komunikat).focus();
                    } else {
                        store.dispatch("login", {
                            email: json.email
                        });
                        app.checkLogin();
                        app.toast(json.komunikat);
                        this.clear();
                        this.$refs.formDialog.hide();
                        // router.go();
                    }
                })
                .catch(error => {
                    this.daneLogowania.login = null;
                    this.daneLogowania.haslo = null;
                    console.log(error);
                });
        },
        setMessage(message) {
            this.message = message;
            return this;
        },
        focus() {
            this.$nextTick(() => this.$refs.login.focus());
            return this;
        },
        passwordReset() {
            app.getDialogPasswordResetEmail().show();
        },
        addItemSelf() {
            this.$refs.formDialog.hide();
            this.$refs.formularzSamodzielnie.clear().load().focus();
            this.$refs.formDialogSamodzielnie.show();
        },
        saveItemSelf(object) {
            let self = this;
            fetch("/sm-portal-server/pacjenci/", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(object)
            })
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        app.toast("Dane pacjenta zostały zapisane");
                        self.$refs.formularzSamodzielnie.clear();
                        self.$refs.formDialogSamodzielnie.hide();
                        self.show();
                    }
                });
        },
        closeFormSelf() {
            this.$refs.formDialogSamodzielnie.hide();
        },
        cancel() {
            this.$refs.formDialog.hide();
            if(router.currentRoute.path != '/aktualnosci') {
                router.push("/aktualnosci");
            }
        },
        clear() {
            this.daneLogowania.login = null;
            this.daneLogowania.haslo = null;
            this.message = null;
            return this;
        }
    },
    template: `
    <div class='dialog-login'>
        <sm-form-dialog class='form-dialog-login' ref='formDialog'>
            <form>
                <div class='center'>
                    <img alt='Logo' ref='logo' class='logo hidden margin-bottom-2x' :src='logoSrc'/>
                </div>
                <div v-show='isMessage' class='login-message margin-bottom-2x error-message'>
                    {{message}}
                </div>
                <div class='grid'>
                    <label class='nowrap' for='login'>Login lub e-mail</label>
                    <input ref='login' type='text' name='login' v-model.trim="daneLogowania.login" required @keyup.enter="$refs.haslo.focus"></input>

                    <label for='haslo'>Hasło</label>
                    <input ref='haslo' type='password' name='haslo' v-model.trim="daneLogowania.haslo" required @keyup.enter="login"></input>

                    <div></div>
                    <div class='a' @click='passwordReset' title="Przypomnij hasło">Nie pamiętasz hasła?</div>

                    <div></div>
                    <div class='a' @click='addItemSelf' title="Załóż konto">Nie posiadasz konta?</div>
                </div>
                <div class='buttons-panel'>
                    <sm-button class='button margin-top-2x green-button' label="OK" @on-click='login'></sm-button>
                    <sm-button class='button margin-top-2x margin-left' label="Anuluj" @on-click='cancel'></sm-button>
                </div>
                <!-- ten przycisk jest niewidoczny, służy do współpracy z menadżerem haseł -->
                <input class='submit' type="submit" @click='login'/>
            </form>
        </sm-form-dialog>
        <sm-form-dialog ref='formDialogSamodzielnie' label="Nowe konto">
            <form-pacjent-samodzielnie ref='formularzSamodzielnie' @on-submit="saveItemSelf" @on-cancel='closeFormSelf'></form-pacjent-samodzielnie>
        </sm-form-dialog>
    </div>
    `
});
