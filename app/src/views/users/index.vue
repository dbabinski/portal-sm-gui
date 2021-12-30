<template>
  <v-card elevation="2">
    <v-data-table :headers="headers" :items="konta" :search="search">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Lista użytkowników</v-toolbar-title>
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
          <v-dialog v-model="dialog" max-width="600px">
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
                    <v-col cols="6" sm="12" md="5">
                      <v-text-field
                        v-model="editedItem.imie"
                        label="Imię"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="12" md="5">
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
        <v-divider class="mx-6"></v-divider>
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
      dialog: false,
      dialogDelete: false,
      konta: [],
      grupyUzytkownikow: [],
      limit: 20,
      liczbaDostepnychRekordow: 0,
      loaded: Boolean,
      search: "",
      headers: [
        // { text: "ID", align: "start", value: "id" },
        { text: "Login", value: "login", width: "150px" },
        { text: "Rola", value: "grupaOpis", width: "60px" },
        { text: "Imię", value: "imie", width: "150px" },
        { text: "Nazwisko", value: "nazwisko", width: "150px" },
        { text: "Adres e-mail", value: "email", width: "900px" },
        { text: "Edytuj / Usuń", value: "actions", sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        imie: "",
        nazwisko: "",
        email: "",
        login: "",
      },
      defaultItem: {
        imie: "",
        nazwisko: "",
        email: "",
        login: "",
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
      } else return "whitedee";
    },

    loadData() {
      this.konta = [];
      this.appendData();
      this.grupyUzytkownikow = [];
      this.getGrupy(); 
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

    getGrupy(){
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
            if(json.blad) {
              //TODO: handle errors
              console.log("REST ERROR: /sm-portal-server/uzytkownicy/grupy");
            } else {
              json.dane.grupy.forEach((grupa) => {
                this.grupyUzytkownikow.push(grupa.opis);
              })
            }
          })
      })
    },

    setGrupy(){
      if(this.editedItem.grupaOpis === "Użytkownicy") {
        this.editedItem.idGrupa = 20;
        this.editedItem.grupa.idTypGrupy = 4; 
        this.editedItem.grupa.slownikTypyGrup.id = 4;
        this.editedItem.grupa.slownikTypyGrup.nazwa = "Użytkownicy";
        this.editedItem.grupa.id = 20;
      } else {
        this.editedItem.idGrupa = 19;
        this.editedItem.grupa.idTypGrupy = 1; 
        this.editedItem.grupa.slownikTypyGrup.id = 1;
        this.editedItem.grupa.slownikTypyGrup.nazwa = "Administratorzy";
        this.editedItem.grupa.id = 19;
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
    },

    editItem(item) {
      this.editedIndex = this.konta.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
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
  },
};
</script>

<style scoped>
.dash {
  color: #777777;
}
</style>