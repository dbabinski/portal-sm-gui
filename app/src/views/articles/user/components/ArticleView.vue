<template>
  <v-card elevation="0">
    <v-btn text small  class="d-flex ml-6 mt-4" @click="$router.go(-1)"><span><v-icon small class="mr-2">fas fa-arrow-left</v-icon></span>Powrót</v-btn>
    <v-container>
      <div class="text-h4 text-left mt-1 ml-4">{{ this.artykul.tytul }}</div>
      <div class="text-caption text--secondary text-left ml-4">
        {{ this.artykul.autor }}
      </div>
      <div class="text-caption text--disabled text-left ml-4">
        {{ this.artykul.dataPublikacji }}
      </div>
      <v-divider></v-divider>
      <!-- <div  class="text-body-2 text-left ml-4 mt-6 mr-12 pr-12"> -->
        <!-- {{ this.artykul.tresc }} -->
      <!-- </div> -->
      <div slot="tresc" v-html="this.artykul.tresc" class="text-body-2 text-left ml-4 mt-6 mr-12 pr-12">
          {{ this.artykul.tresc}}
      </div>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "ArticleView",
  data() {
    return {
      artykul: [],
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    getArticlesId() {
      let id = this.$route.params.pathMatch;
      return id;
    },
    loadData() {
      (this.artykuly = []), this.appendData();
    },
    appendData() {
      this.$nextTick(() => {
        fetch(
          "../sm-portal-server/portal/aktualnosci/" + this.getArticlesId(),
          {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          }
        )
          .then((res) => res.json())
          .then((json) => {
            if (json.blad === true) {
              //TODO: handleErrors
            } else {
              this.artykul = json.dane;
            }
          });
      });
    },
  },
};
</script>