<template>
  <v-card elevation="2">
    <v-data-table :headers="headers" :items="klienci" :search="search">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Lista klientów</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            append-icon="fas fa-search"
            label="Szukaj"
            single-line
            hide-details
            v-model="search"
          />
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="800px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Dodaj klienta
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
                    <v-col col="5" sm="12" md="5">
                      <v-row>
                        <v-col cols="12" sm="12" md="12" class="mt-5">
                          <v-text-field
                            dense
                            v-model="editedItem.nazwaKklienta"
                            label="Nazwa Klienta"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6" sm="12" md="6">
                          <v-text-field
                            dense
                            v-model="editedItem.imie"
                            label="Imię"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6" sm="12" md="6">
                          <v-text-field
                            dense
                            v-model="editedItem.nazwisko"
                            label="Nazwisko"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6" sm="12" md="6">
                          <v-text-field
                            dense
                            v-model="editedItem.nrLicencji"
                            label="Numer Licencji"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6" sm="12" md="6">
                          <v-text-field
                            dense
                            v-model="editedItem.nip"
                            label="NIP"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-divider vertical class="mt-6 mx-6"></v-divider>
                    <v-col col="5" sm="12" md="5">
                      <v-row>
                        <v-col cols="12" sm="12" md="12" class="mt-5">
                          <v-text-field
                            dense
                            v-model="editedItem.adres"
                            label="Adres"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                          <v-text-field
                            dense
                            v-model="editedItem.email"
                            label="Adres email"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6" sm="12" md="6">
                          <v-text-field
                            dense
                            v-model="editedItem.telefonKontaktowy"
                            label="Numere Telefonu"
                          ></v-text-field>
                        </v-col>
                      </v-row>
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
  name: "Clients",
  data() {
    return {
      date: null,
      modalDate: false,
      dialog: false,
      dialogDelete: false,
      loading: false,
      klienci: [],
      jsonKlient: [],
      limit: 20,
      liczbaDostepnychRekordow: 0,
      loaded: Boolean,
      search: "",
      headers: [
        { text: "ID", align: "start", value: "id" },
        { text: "Nr licencji", align: "start", value: "nrLicencji" },
        { text: "NIP", value: "nip" },
        { text: "Nazwa Klienta", value: "nazwaKklienta" },
        { text: "Imię i nazwisko", value: "imie" },
        { text: "Nazwisko", value: "nazwisko" },
        { text: "Telefon", value: "telefonKontaktowy" },
        { text: "Adres e-mail", value: "email" },
        {
          text: "Zarządzaj klientami",
          value: "actions",
          sortable: false,
          align: "right",
        },
      ],
      editedIndex: -1,
      editedItem: {},
      defaultItem: {
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
      return this.klienci.lenght == this.liczbaDostepnychRekordow;
    },
    formTitle() {
      return this.editedIndex === -1
        ? "Dodaj dane klienta"
        : "Edytuj dane klienta";
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
    },
    refreshData() {
      this.appendData(true);
    },
    appendData(refresh) {
      this.$nextTick(() => {
        this.loading = true;
        let params = {
          filter: "",
          limit: this.limit,
          aktywne: "",
          offset: this.klienci.lenght,
          refresh: refresh != undefined ? refresh : false,
        };
        this.klienci = [];
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
                this.klienci.push(klient);
              });
              this.loading = false;
            }
          });
      });
    },

    addItem() {},

    saveItem() {
      fetch("../sm-portal-server/klienci/", {
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
              Object.assign(this.klienci[this.editedIndex], this.editedItem);
            } else {
              this.klienci.push(this.editedItem);
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
      this.editedIndex = this.klienci.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.klienci.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    confirmDelete() {
      fetch("../sm-portal-server/klienci/" + this.editedItem.id, {
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
            this.klienci.splice(this.editedIndex, 1);
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