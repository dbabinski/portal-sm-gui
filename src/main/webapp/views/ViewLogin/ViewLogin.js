Vue.component('view-login', {
    data() {
        return {
            message: null,
            daneLogowania: {
                login: null,
                haslo: null
            },
            logoSrc: null,
        } 
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
                        // this.$refs.logo.classList.remove('hidden');
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
                            email: json.email,
                            permissions: json.permissions
                        });
                        app.login();
                        app.toast(json.komunikat);
                        this.clear();
                        // this.$refs.formDialog.hide();
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
            if(router.currentRoute.path != '/') {
                router.push("/");
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
    <div class="view-login" ref="formDialog">
        <v-app>
          <v-container>
            <v-row align="center" justify="center" >
              <v-col cols="12" sm="6">
                <v-card class="elevation-6 mt-14">
                <v-system-bar color="blue darken-2"></v-system-bar>
                  <v-row align="center" justify="center">
                    <v-col cols="12" md="7">
                      <v-card-text class="pa-10">
                        <h1 class="text-center">Zaloguj się</h1>
                        <h4 class="text-center  grey--text mt-3">aby uzyskać dostęp do swojego konta</h4>
                        <v-row align="center" class="mt-6">
                          <v-col cols="12" sm="10">   
                            <v-text-field
                              label="Email"
                              outlined
                              dense
                              color="blue"
                              autocomplete="false"
                              class="mt-1"
                              name="login"
                              v-model.trim="daneLogowania.login"
                              required
                              ref="login"
                            />
                            <v-text-field
                              label="Hasło"
                              outlined
                              dense
                              color="blue"
                              autocomplete="false"
                              type="password"  
                              name="haslo"
                              v-model.trim="daneLogowania.haslo"
                              required
                              @keyup.enter="login"
                              ref="haslo"
                            />
                            <v-row>
                              <v-col cols="12" sm="7">
                                <v-checkbox
                                  label="Zapamiętaj mnie"
                                  class="mt-n1"
                                  color="blue"
                                ></v-checkbox>
                              </v-col>
                              <v-col cols="12" sm="5">
                                <span class="caption blue--text">Zapomniałem hasła</span>
                              </v-col>
                            </v-row>
                            <v-btn color="blue" dark block tile @click="login">Zaloguj się</v-btn>
                            <div v-show='isMessage'>
                              {{message}}
                            </div>
                          </v-col>
                        </v-row>  
                      </v-card-text>
                    </v-col>
                    <v-col cols="12" md="5">

                            <v-card-text>
                              <h3 class="text-center ">Nie posiadasz konta?</h3>
                              <h4
                                class="text-center"
                              >Załóże je, aby w pełni korzystać z oferowanych funkcjo</h4>
                            </v-card-text>
                            <div class="text-center">
                              <v-btn tile color="blue darken-2" outlined>Załóż konto</v-btn>
                            </div>
                          
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-app>
    </div>
    `
});