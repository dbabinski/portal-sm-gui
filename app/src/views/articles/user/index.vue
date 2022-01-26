<template>
  <v-container>
    <div>
      <div class="text-h6 text-uppercase text-left mb-3">Aktualności</div>
      <v-divider class="mb-12" />
      <article-card
        class="mx-auto"
        :color="bgColor"
        :data="artykul"
        v-for="(artykul, index) in artykuly"
        :key="index"
      />
    </div>
  </v-container>
</template>

<script>
export default {
  name: "ArticlesUser",
  components: {
    ArticleCard: () => import("./components/ArticleCard.vue"),
  },
  data() {
    return {
      bgColor: "#00CC" + ((Math.random() * 0xff) << 0).toString(16),
      artykuly: [],
    };
  },
  created() {
    this.loadData();
  },

  mounted() {},

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

    generator: function () {
      this.mycolor = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
      document.body.style.background = this.mycolor;
    },
  },
};
</script>

<style scoped>
.dash {
  color: #777777;
}
</style>