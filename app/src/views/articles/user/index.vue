<template>
  <v-container>
    <div>
      <div class="text-h6 text-uppercase text-left mb-3">Aktualności</div>
      <v-divider class="mb-12"/>
      <article-card class="mx-auto" :data="artykul" v-for="(artykul, index) in artykuly" :key="index" />
    </div>
  </v-container>
    <!-- <v-container>
    <div >
      <div class="d-flex justify-space-between" v-for="(artykul, index) in artykuly" :key="index">
        <article-card :data="artykul" />
      </div>
    </div>
  </v-container> -->
</template>

<script>

export default {
  name: "ArticlesUser",
  components: {
    ArticleCard: () => import("./components/ArticleCard.vue"),
  },
  data() {
    return {
      artykuly: [],
    };
  },
  created() {
    this.loadData();
  },

  computed: {},

  methods: {
    loadData() {
      (this.artykuly = []), this.appendData();
    },
    appendData() {
      this.$nextTick(() => {
        fetch("../sm-portal-server/portal/aktualnosci/wszystkie", {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.blad === true) {
              //TODO: handleErrors
            } else {
              json.dane.aktualnosci.forEach((aktualnosc) => {
                this.artykuly.push(aktualnosc);
              });
            }
          });
      });
    },
  },
};
</script>

<style scoped>
.dash {
  color: #777777;
}
</style>