<template>

    <v-btn text>{{ user.fullName }}</v-btn>

</template>

<script>
import store from "@/store/index";

export default {
  name: "UserName",
  data() {
    return {
      user: {
        fullName: null,
        email: null,
      },
      storeData: {
        id: null,
        email: null,
      },
    };
  },

  created() {
    this.appendData();
    this.loadData();
  },

  methods: {
    loadData() {
      this.storeData.id = store.getters.id;
      this.storeData.email = store.getters.email;
    },
    async appendData() {
      if (store.getters.id == undefined) {
        console.log("id: " +  this.storeData.id );
      } else {
        let params = { konto: store.getters.id };
        fetch("../sm-portal-server/uzytkownicy/konta/nadrzedni", {
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
              let name = json.dane.nadrzedni[0].imie;
              let surName = json.dane.nadrzedni[0].nazwisko;
              this.user.fullName = name + " " + surName;
            }
          });
      }
    },
  },
};
</script>

<style scoped>
.logoutButton {
  background-color: #0078e9;
  cursor: pointer;
}
.logoutButton:hover {
  background-color: #0061bd;
}
</style>
