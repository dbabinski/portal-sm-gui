<template>
  <v-card>
    <v-card>
      <v-card-title>
        Lista użytkowników
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-text-field
          append-icon="fas fa-search"
          label="Szukaj"
          single-line
          hide-details
          v-model="search"
        >
        </v-text-field>
      </v-card-title>
      <v-data-table 
        :headers="headers" 
        :items="konta" 
        :search="search"
        dense

      > 
      </v-data-table>
    </v-card>
  </v-card>
</template>

<script>
export default {
  name: "Users",
  data() {
    return {
      konta: [],
      limit: 20,
      liczbaDostepnychRekordow: 0,
      loaded: Boolean,
      search: '',
      headers: [
        { text: "Imię", align: "start", value: "imie" },
        { text: "Nazwisko", value: "nazwisko" },
        { text: "Adres e-mail", value: "email" },
        { text: "Login", value: "login" },
      ],
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
  },
  mounted() {
    this.loadData();
  },

  methods: {
    loadData() {
      this.konta = [];
      this.appendData();
    },
    refreshData() {
      this.appendData(true);
    },
    appendData(refresh) {
      // this.$nextTick(() => {
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
      // });
    },
  },
};
</script>

<style scoped>
.dash{
  color: #777777;
}
</style>