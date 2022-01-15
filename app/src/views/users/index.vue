<template>
  <v-card elevation="2">
    <v-data-table :headers="headers" :items="konta" :search="search">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Lista użytkowników</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-radio-group v-model="search" row dense class="mt-5">
            <v-radio value="Administratorzy" label="Administratorzy"></v-radio>
            <v-radio value="Użytkownicy" label="Użytkownicy"></v-radio>
          </v-radio-group>
          <v-spacer></v-spacer>
          <v-text-field
            append-icon="fas fa-search"
            label="Szukaj"
            single-line
            hide-details
            v-model="search"
          />
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="1200px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Dodaj użytkownika
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="px-8 mb-4">
                <span class="text-h6 font-weight-medium text-uppercase">{{
                  formTitle
                }}</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col col="6" sm="12" md="6">
                      <v-row>
                        <v-col cols="5" sm="12" md="5">
                          <v-text-field
                            v-model="editedItem.imie"
                            label="Imię"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="5" sm="12" md="5">
                          <v-text-field
                            v-model="editedItem.nazwisko"
                            label="Nazwisko"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="10" sm="12" md="10">
                          <v-text-field
                            v-model="editedItem.email"
                            label="Adres e-mail"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6" sm="12" md="5">
                          <v-text-field
                            v-model="editedItem.login"
                            label="Login"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6" sm="12" md="5" class="mt-4">
                          <v-autocomplete
                            dense
                            small-chips
                            label="Grupa"
                            v-model="editedItem.grupaOpis"
                            :items="grupyUzytkownikow"
                          >
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="4" sm="12" md="4" class="my-0 py-0">
                          <v-switch
                            color="rgb(255,2,2)"
                            hint="zabl"
                            v-model="editedItem.blokadaKonta"
                            dense
                            label="Zablokowano"
                          >
                          </v-switch>
                        </v-col>
                        <v-col cols="6" sm="12" md="6" class="my-0 py-0">
                          <v-dialog
                            ref="dialogDate"
                            v-model="modalDate"
                            :return-value.sync="date"
                            persistent
                            width="290px"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="editedItem.blokadaKontaDo"
                                label="Blokada konta do:"
                                prepend-icon="far fa-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker v-model="date" scrollable>
                              <v-spacer></v-spacer>
                              <v-btn
                                text
                                color="primary"
                                @click="modalDate = false"
                              >
                                Cancel
                              </v-btn>
                              <v-btn
                                text
                                color="primary"
                                @click="$refs.dialogDate.save(date)"
                              >
                                OK
                              </v-btn>
                            </v-date-picker>
                          </v-dialog>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-divider vertical class="mt-14 mb-10"></v-divider>
                    <v-col cols="6" sm="12" md="6">
                      <div v-if="loading">
                        <v-progress-circular></v-progress-circular>
                      </div>
                      <div v-if="klienci.length">
                        <v-row>
                          <p class="mx-3 mt-3 mb-0 text-h6">Dane klienta</p>
                          <v-col class="mb-0 pb-0" cols="12" sm="12" md="12">
                            <v-text-field
                              readonly
                              dense
                              outlined
                              v-model="klienci[0].nrLicencji"
                              label="Numer licencji"
                            ></v-text-field>
                          </v-col>
                          <v-col class="my-0 py-0" cols="6" sm="12" md="6">
                            <v-text-field
                              readonly
                              dense
                              outlined
                              v-model="klienci[0].imie"
                              label="Imię"
                            ></v-text-field>
                          </v-col>
                          <v-col class="my-0 py-0" cols="6" sm="12" md="6">
                            <v-text-field
                              readonly
                              dense
                              outlined
                              v-model="klienci[0].nazwisko"
                              label="Nazwisko"
                            ></v-text-field>
                          </v-col>
                          <v-col class="my-0 py-0" cols="12" sm="12" md="12">
                            <v-text-field
                              readonly
                              dense
                              outlined
                              v-model="klienci[0].nazwaKklienta"
                              label="Nazwa Klienta"
                            ></v-text-field>
                          </v-col>
                          <v-col class="my-0 py-0" cols="12" sm="12" md="12">
                            <v-text-field
                              readonly
                              dense
                              outlined
                              v-model="klienci[0].nip"
                              label="Numer NIP"
                            ></v-text-field>
                          </v-col>
                          <v-col class="my-0 py-0" cols="6" sm="12" md="6">
                            <v-text-field
                              readonly
                              dense
                              outlined
                              v-model="klienci[0].email"
                              label="Adres e-mail"
                            ></v-text-field>
                          </v-col>
                          <v-col class="my-0 py-0" cols="6" sm="12" md="6">
                            <v-text-field
                              readonly
                              dense
                              outlined
                              v-model="klienci[0].telefonKontaktowy"
                              label="Numer telefonu"
                            ></v-text-field>
                          </v-col>
                          <v-col class="my-0 py-0" cols="12" sm="12" md="12">
                            <v-text-field
                              readonly
                              dense
                              outlined
                              v-model="klienci[0].adres"
                              label="Adres"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </div>

                      <div v-else>
                        <p class="font-weight-medium mt-8">
                          Brak podpiętego klienta dla tego konta
                        </p>
                        <v-dialog v-model="dialogSetKlient">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" v-bind="attrs" v-on="on"
                              >Wybierz klienta</v-btn
                            >
                          </template>
                          <v-card>
                            <v-card-title
                              ><p
                                class="
                                  text-h6
                                  font-weight-medium
                                  text-uppercase
                                "
                              >
                                Wybierz klienta
                              </p></v-card-title
                            >
                            <v-divider></v-divider>
                            <v-card-text>
                              <v-container>
                                <v-data-table
                                  dense
                                  :single-select="true"
                                  show-select
                                  :headers="headersKlienci"
                                  :items="klienciWszyscy"
                                  :search="searchKlienci"
                                  v-model="klienci"
                                >
                                  <template v-slot:top>
                                    <v-toolbar flat>
                                      <v-toolbar-title>Szukaj</v-toolbar-title>

                                      <v-text-field
                                        single-line
                                        hide-details
                                        v-model="searchKlienci"
                                        class="mr-12 pr-12 ml-1 pl-1"
                                      />
                                      <v-spacer></v-spacer>
                                    </v-toolbar>
                                  </template>
                                </v-data-table>
                              </v-container>
                            </v-card-text>
                          </v-card>
                        </v-dialog>
                        <v-dialog v-model="dialogSetNewKlient" max-width="700px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              class="mx-2"
                              color="primary"
                              outlined
                              v-bind="attrs"
                              v-on="on"
                              >Dodaj nowego klienta</v-btn
                            >
                          </template>
                          <v-card>
                            <v-card-title
                              ><p
                                class="text-h6 font-weight-light text-uppercase"
                              >
                                Dodaj klienta
                              </p>
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-card-text>
                              <v-container>
                                <div>
                                  <v-row>
                                    <p class="mx-3 mt-3 mb-0 text-h6">
                                      Dane klienta
                                    </p>
                                    <v-col
                                      class="mb-0 pb-0"
                                      cols="12"
                                      sm="12"
                                      md="12"
                                    >
                                      <v-text-field
                                        readonly
                                        dense
                                        outlined
                                        v-model="klienci.nrLicencji"
                                        label="Numer licencji"
                                      ></v-text-field>
                                    </v-col>
                                    <v-col
                                      class="my-0 py-0"
                                      cols="6"
                                      sm="12"
                                      md="6"
                                    >
                                      <v-text-field
                                        readonly
                                        dense
                                        outlined
                                        v-model="klienci.imie"
                                        label="Imię"
                                      ></v-text-field>
                                    </v-col>
                                    <v-col
                                      class="my-0 py-0"
                                      cols="6"
                                      sm="12"
                                      md="6"
                                    >
                                      <v-text-field
                                        readonly
                                        dense
                                        outlined
                                        v-model="klienci.nazwisko"
                                        label="Nazwisko"
                                      ></v-text-field>
                                    </v-col>
                                    <v-col
                                      class="my-0 py-0"
                                      cols="12"
                                      sm="12"
                                      md="12"
                                    >
                                      <v-text-field
                                        readonly
                                        dense
                                        outlined
                                        v-model="klienci.nazwaKklienta"
                                        label="Nazwa Klienta"
                                      ></v-text-field>
                                    </v-col>
                                    <v-col
                                      class="my-0 py-0"
                                      cols="12"
                                      sm="12"
                                      md="12"
                                    >
                                      <v-text-field
                                        readonly
                                        dense
                                        outlined
                                        v-model="klienci.nip"
                                        label="Numer NIP"
                                      ></v-text-field>
                                    </v-col>
                                    <v-col
                                      class="my-0 py-0"
                                      cols="6"
                                      sm="12"
                                      md="6"
                                    >
                                      <v-text-field
                                        readonly
                                        dense
                                        outlined
                                        v-model="klienci.email"
                                        label="Adres e-mail"
                                      ></v-text-field>
                                    </v-col>
                                    <v-col
                                      class="my-0 py-0"
                                      cols="6"
                                      sm="12"
                                      md="6"
                                    >
                                      <v-text-field
                                        readonly
                                        dense
                                        outlined
                                        v-model="klienci.telefonKontaktowy"
                                        label="Numer telefonu"
                                      ></v-text-field>
                                    </v-col>
                                    <v-col
                                      class="my-0 py-0"
                                      cols="12"
                                      sm="12"
                                      md="12"
                                    >
                                      <v-text-field
                                        readonly
                                        dense
                                        outlined
                                        v-model="klienci.adres"
                                        label="Adres"
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>
                                </div>
                              </v-container>
                            </v-card-text>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="blue darken-1" text>Zapisz Klienta</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Anuluj
                </v-btn>
                <v-btn color="blue darken-1" text @click="saveItem">
                  Zapisz</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Napewno chcesz usunąć użytkownika?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Anuluj</v-btn
                >
                <v-btn color="blue darken-1" text @click="confirmDelete"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-divider class="mx-16"></v-divider>
      </template>
      <template v-slot:[`item.grupaOpis`]="{ item }">
        <v-chip :color="getColorsOfPerrmission(item.grupaOpis)" dark>{{
          item.grupaOpis
        }}</v-chip>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-10" @click="editItem(item)"
          >fas fa-user-edit</v-icon
        >
        <v-icon small @click.stop="deleteItem(item)">
          fas fa-user-times
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="refreshData"> Odśwież </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
// import { mapState } from 'vuex';
//import { copyJSON } from "@/lib/utils";

export default {
  name: "Users",
  data() {
    return {
      date: null,
      modalDate: false,
      dialog: false,
      dialogDelete: false,
      dialogSetKlient: false,
      dialogSetNewKlient: false,
      loading: false,
      konta: [],
      grupyUzytkownikow: [],
      klienci: [],
      jsonKlient: [],
      klienciWszyscy: [],
      limit: 20,
      liczbaDostepnychRekordow: 0,
      loaded: Boolean,
      search: "",
      searchKlienci: "",
      headersKlienci: [
        { text: "Nr licencji", align: "start", value: "nrLicencji" },
        { text: "NIP", value: "nip" },
        { text: "Miejscowość", value: "miejscowosc" },
        { text: "Nazwa Klienta", value: "nazwaKklienta" },
        { text: "Imię", value: "imie" },
        { text: "Nazwisko", value: "nazwisko" },
        { text: "Telefon", value: "telefonKontaktowy" },
      ],
      headers: [
        { text: "ID", align: "start", value: "id" },
        { text: "Login", value: "login", width: "150px" },
        { text: "Rola", value: "grupaOpis", width: "60px" },
        { text: "Imię", value: "imie", width: "150px" },
        { text: "Nazwisko", value: "nazwisko", width: "150px" },
        { text: "Adres e-mail", value: "email" },
        {
          text: "Zarządzaj użytkownikami",
          value: "actions",
          sortable: false,
          align: "right",
        },
      ],
      editedIndex: -1,
      editedItem: {
        imie: "",
        nazwisko: "",
        email: "",
        login: "",
        grupa: {
          slownikTypyGrup: {
            id: null,
            nazwa: "",
          },
          aktywna: true,
          id: 0,
          idTypGrupy: 0,
          opis: "",
        },
      },
      defaultItem: {
        imie: "",
        nazwisko: "",
        email: "",
        login: "",
        grupa: {
          slownikTypyGrup: {
            id: null,
            nazwa: "",
          },
          aktywna: true,
          id: 0,
          idTypGrupy: 0,
          opis: "",
        },
      },
    };
  },

  props: {
    filterOptions: {
      type: Map,
      default: () =>
        new Map()
          .set("wszystkie", "")
          .set("aktywne", "true")
          .set("nieaktywne", "false"),
    },
  },

  computed: {
    isLoaded() {
      return this.konta.lenght == this.liczbaDostepnychRekordow;
    },
    formTitle() {
      return this.editedIndex === -1
        ? "Dodaj dane użytkownika"
        : "Edytuj dane użytkownika";
    },
  },

  mounted() {},

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.loadData();
  },

  methods: {
    getColorsOfPerrmission(grupaOpis) {
      if (grupaOpis) {
        if (grupaOpis === "Administratorzy") return "blue";
        if (grupaOpis === "Użytkownicy") return "green";
      } else return "white";
    },

    loadData() {
      this.konta = [];
      this.appendData();

      this.grupyUzytkownikow = [];
      this.getGrupy();

      this.getWszyscyKlienci();
    },
    refreshData() {
      this.appendData(true);
    },
    appendData(refresh) {
      this.$nextTick(() => {
        this.loaded = true;
        let params = {
          filter: "",
          limit: this.limit,
          aktywne: "",
          offset: this.konta.lenght,
          refresh: refresh != undefined ? refresh : false,
        };
        if (refresh === true) {
          this.konta = [];
        }
        fetch("../sm-portal-server/uzytkownicy/konta/lista", {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(params),
        })
          .then((res) => {
            // TODO: loading stop
            this.loaded = false;
            return res;
          })
          .then((res) => res.json())
          .then((json) => {
            if (json.blad === true) {
              // TODO: handle errors
            } else {
              this.liczbaDostepnychRekordow =
                json.dane.liczbaDostepnychRekordow;
              json.dane.konta.forEach((konto) => {
                this.konta.push(konto);
              });
            }
          });
      });
    },

    getGrupy() {
      this.$nextTick(() => {
        fetch("../sm-portal-server/uzytkownicy/grupy", {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF=8",
          },
        })
          .then((res) => {
            return res;
          })
          .then((res) => res.json())
          .then((json) => {
            if (json.blad) {
              //TODO: handle errors
              console.log("REST ERROR: /sm-portal-server/uzytkownicy/grupy");
            } else {
              json.dane.grupy.forEach((grupa) => {
                this.grupyUzytkownikow.push(grupa.opis);
              });
            }
          });
      });
    },

    getKlienci(item) {
      let kontoId = { konto: item.id };
      this.loading = true;
      this.$nextTick(() => {
        fetch("../sm-portal-server/uzytkownicy/konta/nadrzedni", {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(kontoId),
        })
          .then((res) => res.json())
          .then((json) => {
            //console.log(JSON.stringify(this.editedItem.id));
            if (json.blad) {
              //TODO: handleErrors
            } else {
              this.klienci = json.dane.nadrzedni;
              this.loading = false;
            }
          });
      });
    },

    getWszyscyKlienci(refresh) {
      this.loading = true;
      let params = {
        filter: "",
        limit: this.limit,
        aktywne: "",
        offset: this.klienci.lenght,
        refresh: refresh != undefined ? refresh : false,
      };
      this.klienci = [];
      this.$nextTick(() => {
        fetch("../sm-portal-server/klienci/lista", {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(params),
        })
          .then((res) => res.json())
          .then((json) => {
            //console.log(json);
            if (json.blad) {
              //TODO: handleErrors
            } else {
              json.dane.klienci.forEach((klient) => {
                this.klienciWszyscy.push(klient);
              });
              this.loading = false;
            }
          });
      });
    },

    setGrupy() {
      if (this.editedItem.grupaOpis === "Użytkownicy") {
        this.editedItem.idGrupa = 20;
        this.editedItem.grupa.idTypGrupy = 4;
        this.editedItem.grupa.opis = "Użytkownicy";
        this.editedItem.grupa.slownikTypyGrup.id = 4;
        this.editedItem.grupa.slownikTypyGrup.nazwa = "Użytkownicy";
        this.editedItem.grupa.id = 20;

        this.editedItem.kontoAktywne = true;
      } else {
        this.editedItem.idGrupa = 19;
        this.editedItem.grupa.idTypGrupy = 1;
        this.editedItem.grupa.opis = "Administratorzy";
        this.editedItem.grupa.slownikTypyGrup.id = 1;
        this.editedItem.grupa.slownikTypyGrup.nazwa = "Administratorzy";
        this.editedItem.grupa.id = 19;

        this.editedItem.kontoAktywne = true;
      }
    },

    addItem() {},

    saveItem() {
      this.setGrupy();
      fetch("../sm-portal-server/uzytkownicy/konta/", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(this.editedItem),
      })
        .then((res) => res.json())
        .then((json) => {
          //console.log(JSON.stringify(this.editedItem));
          if (json.blad) {
            //TODO: handleErrors
          } else {
            //TODO: konto zostało zapisane (zmienione/edytowane)
            if (this.editedIndex > -1) {
              Object.assign(this.konta[this.editedIndex], this.editedItem);
            } else {
              this.konta.push(this.editedItem);
            }
            this.close();
          }
          this.refreshData();
        });

      this.jsonKlient = {
        kontoId: this.editedItem.id,
        klient: this.klienci[0],
        nadrzedny: true,
      };
      console.log(this.jsonKlient);
      fetch("../sm-portal-server/klienci/do-konta/", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(this.jsonKlient),
      })
        .then((res) => res.json)
        .then((json) => {
          if (json.blad) {
            console.log("Błąd: " + json.blad);
          } else {
            console.log("Dodano klienta do konta: " + json.komunikat);
            console.log(JSON.stringify(this.jsonKlient));
          }
        });
    },

    editItem(item) {
      this.editedIndex = this.konta.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;

      this.getKlienci(item);
    },

    deleteItem(item) {
      this.editedIndex = this.konta.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    confirmDelete() {
      //TODO: parametr metody : "object"

      fetch("../sm-portal-server/uzytkownicy/konta/" + this.editedItem.id, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.blad) {
            //TODO: handleErrors
          } else {
            this.konta.splice(this.editedIndex, 1);
            this.closeDelete();
            this.refreshData;
          }
        });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    removeChips(item) {
      const index = this.values.indexOf(item.name);
      if (index >= 0) this.values.splice(index, 1);
    },

    setBanned() {
      if (this.date) {
        (this.editedItem.blokadaKonta = true),
          (this.editedItem.blokadaKontaDo = this.date);
      }
    },
  },
};
</script>

<style scoped>
.dash {
  color: #777777;
}
.theme--light.v-label {
  color: rgb(255, 0, 0) !important;
}
.v-data-table-header th {
  white-space: nowrap;
}
</style>