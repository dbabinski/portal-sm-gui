<template>
  <v-app class="body">
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="6">
          <v-card class="elevation-24 mt-14">
            <v-system-bar color="blue darken-2"></v-system-bar>

            <v-window v-model="step">
              <v-window-item :value="1">
                <v-row align="center" justify="center">
                  <v-col cols="12" sm="7">
                    <v-card-text class="pl-10 py-10">
                      <h1 class="text-center">Zaloguj się</h1>
                      <h4 class="text-center grey--text mt-3">
                        aby uzyskać dostęp do konta
                      </h4>
                      <v-row align="center" class="mt-6">
                        <v-col cols="12" sm="12">
                          <div v-show="isMessage">
                            <h5 class="red--text">{{ message }}</h5>
                          </div>
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
                            <v-col cols="12" sm="6">
                              <v-btn color="blue" dark tile @click="login"
                                >Zaloguj się</v-btn
                              >
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-btn text color="blue darken-2"
                                >Zapomniałem hasła</v-btn
                              >
                            </v-col>
                          </v-row>
                          <v-row align="center" justify="center"> </v-row>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-col>
                  <v-col cols="12" md="5">
                    <v-card-text class="pr-10 py-10">
                      <v-row align="center" justify="center" class="pr-10">
                        <h3 class="text-center">Nie posiadasz konta?</h3>
                        <h4 class="text-center grey--text">
                          Załóż je, aby w pełni korzystać z oferowanych
                          funkcjonalności
                        </h4>
                      </v-row>
                      <v-row align="center" justify="center" class="pr-10 pt-5">
                        <v-btn
                          tile
                          color="blue darken-2"
                          outlined
                          @click="step = 2"
                          >Załóż konto</v-btn
                        >
                      </v-row>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-window-item>

              <v-window-item :value="2">
                <v-row justify="center">
                  <v-col cols="12" md="6">
                    <v-card-text class="pl-10 py-10">
                      <h1 class="text-center">Załóż konto</h1>
                      <h4 class="text-center grey--text">
                        Jeśli posiadasz konto
                        <v-btn text color="blue darken-2" @click="step = 1"
                          >Zaloguj się</v-btn
                        >
                      </h4>
                      <v-row align="center" class="mt-6">
                        <v-col cols="12" sm="12">
                          <v-text-field
                            label="NIP firmy"
                            :rules="[
                              () => !!daneRejestracji.nip || 'Wpisz NIP!',
                            ]"
                            :error-messages="errorMessage"
                            required
                            placeholder="xxx-xxx-xx-xx"
                            outlined
                            color="blue"
                            autocomplete="false"
                            name="nip"
                            v-model.trim="daneRejestracji.nip"
                            dense
                            ref="nip"
                          />

                          <v-text-field
                            label="E-mail"
                            :rules="[
                              () =>
                                !!daneRejestracji.email || 'Wpisz adres email!',
                            ]"
                            :error-messages="errorMessage"
                            placeholder="xxxx@xxxxx.xx"
                            outlined
                            color="blue"
                            autocomplete="false"
                            name="email"
                            v-model.trim="daneRejestracji.email"
                            dense
                            ref="email"
                          />

                          <v-text-field
                            label="Hasło"
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show1 ? 'text' : 'password'"
                            :rules="[
                              () => !!daneRejestracji.haslo || 'Wpisz hasło!',
                            ]"
                            :error-messages="errorMessage"
                            placeholder="********"
                            outlined
                            color="blue"
                            autocomplete="false"
                            name="haslo"
                            v-model.trim="daneRejestracji.haslo"
                            dense
                            ref="haslo"
                            @click:append="show1 = !show1"
                          />

                          <v-text-field
                            label="Potwierdź hasło"
                            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show2 ? 'text' : 'password'"
                            :rules="[
                              () => !!daneRejestracji.reHaslo || 'Wpisz hasło!',
                              potwierdzenieHasla,
                            ]"
                            :error-messages="errorMessage"
                            placeholder="********"
                            outlined
                            color="blue"
                            autocomplete="false"
                            name="input-10-1"
                            v-model.trim="daneRejestracji.reHaslo"
                            dense
                            ref="reHaslo"
                            @click:append="show2 = !show2"
                          />

                          <v-text-field
                            label="Telefon"
                            :rules="[
                              () =>
                                !!daneRejestracji.telefon ||
                                'Wpisz numer telefonu!',
                            ]"
                            :error-messages="errorMessage"
                            placeholder="123-456-789"
                            outlined
                            color="blue"
                            autocomplete="false"
                            name="telefon"
                            v-model.trim="daneRejestracji.telefon"
                            dense
                            ref="telefon"
                          />

                          <v-text-field
                            label="Numer licencji"
                            :rules="[
                              () =>
                                !!daneRejestracji.nrLicencji ||
                                'Wpisz numer telefonu!',
                            ]"
                            :error-messages="errorMessage"
                            placeholder="123-456-789"
                            outlined
                            color="blue"
                            autocomplete="false"
                            name="nrLicencji"
                            v-model.trim="daneRejestracji.nrLicencji"
                            dense
                            ref="nrLicencji"
                          />

                          <v-text-field
                            label="Login"
                            :rules="[
                              () =>
                                !!daneRejestracji.login ||
                                'Wpisz numer telefonu!',
                            ]"
                            :error-messages="errorMessage"
                            placeholder="admin"
                            outlined
                            color="blue"
                            autocomplete="false"
                            name="login"
                            v-model.trim="daneRejestracji.login"
                            dense
                            ref="login"
                          />

                          <v-row>
                            <v-col cols="12" sm="12">
                              <v-checkbox v-model="daneRejestracji.regulamin">
                                <template v-slot:label>
                                  <div>
                                    Zapoznałem się z
                                    <v-tooltip bottom>
                                      <template v-slot:activator="{ on }">
                                        <a
                                          target="_blank"
                                          href="https://vuetifyjs.com"
                                          @click.stop
                                          v-on="on"
                                        >
                                          regulaminem
                                        </a>
                                      </template>
                                      Opens in new window
                                    </v-tooltip>
                                  </div>
                                </template>
                              </v-checkbox>
                            </v-col>
                          </v-row>
                          <v-row
                            ><div
                              id="formPacjentSamodzielnie-recaptcha"
                              class="g-recaptcha"
                            ></div
                          ></v-row>
                          <v-row align="center" justify="center">
                            <v-btn color="blue" dark tile
                              >Zarejestruj się</v-btn
                            >
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-card-text class="pr-10 py-10">
                      <h1 class="text-center">Dane firmy</h1>
                      <h4 class="text-center grey--text">
                        Dane uzupełniane automatycznie
                      </h4>
                      <v-row class="mt-8">
                        <v-col cols="12" sm="12">
                          <v-textarea
                            label="Nazwa Klienta"
                            outlined
                            color="blue"
                            name="nazwa_klienta"
                            v-model.trim="daneRejestracji.nazwaKlienta"
                            ref="nazwa_klienta"
                          />

                          <v-text-field
                            label="Ulica"
                            outlined
                            color="blue"
                            name="ulica"
                            v-model.trim="daneRejestracji.ulica"
                            dense
                            ref="ulica"
                          />
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-window-item>
            </v-window>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<style scoped>
#app {
  margin: 0;
  padding: 0;
  background-color: rgb(0, 0, 0, 0.2);
}
</style>

<script>
import { isNull } from "@/lib/utils";
import store from "@/store";
import router from "@/router/index";
// import  toast  from '@/main'

export default {
  data() {
    return {
      step: 1,
      message: null,
      errorMessage: null,
      show1: null,
      show2: null,
      sheet: null,
      daneLogowania: {
        login: null,
        haslo: null,
      },
      daneRejestracji: {
        nip: null,
        email: null,
        haslo: null,
        reHaslo: null,
        telefon: null,
        nazwa_firmy: null,
        ulica: null,
        kod_pocztowy: null,
        miejscowosc: null,
      },
      nadrzedne: true,
      recaptchaWidget: null,
    };
  },

  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },

  computed: {
    isMessage() {
      return !isNull(this.message);
    },
    potwierdzenieHasla() {
      return () =>
        this.daneRejestracji.haslo === this.daneRejestracji.reHaslo ||
        "Nieprawidłowe hasło!";
    },
  },

  methods: {
    setMessage(message) {
      this.message = message;
      return this;
    },

    login() {
      let self = this;
      fetch("/sm-portal-server/autentykacja/login", {
        method: "POST",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(this.daneLogowania),
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          if (json.blad === true) {
            self.setMessage(json.komunikat);
          } else {
            if (json.permissions.administracja.add === true) {
              router.push({ path: this.redirect || "/admin" });
            } else {
              router.push({ path: this.redirect || "/" });
            }
            // router.push("/");
            store.dispatch("user/login", {
              email: json.email,
              permissions: json.permissions,
              token: json.token,
              scope: json.scope,
            });
            // toast(json.komunikat);
            // this.clear();
          }
        })
        .catch((error) => {
          this.daneLogowania.login = null;
          this.daneLogowania.haslo = null;
          console.log(error);
        });
    },

    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
  },
};
</script>
