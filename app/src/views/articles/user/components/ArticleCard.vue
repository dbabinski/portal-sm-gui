<template>
  <v-card class="my-5" max-width="1000">
    <v-card class="white--text align-end" height="150px" :color="color">
      <v-card-title>{{ data.tytul }}</v-card-title>
    </v-card>

    <v-card-subtitle class="text-left pb-0">{{ data.autor }} </v-card-subtitle>

    <v-card-text class="mb-0 pb-0 text-left text--primary">
      {{ data.skrot }}
    </v-card-text>
    <v-card-text class="py-0 my-0 text-left text-caption">
      {{ data.dataPublikacji }}
    </v-card-text>

    <v-card-actions>
      <v-btn outlined color="primary" text :to="{path: this.pathTo }">
        Czyta dalej ..
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  components: {},
  name: "ArticleCard",
  props: {
    data: Object,
    color: String,
  },
  data() {
    return {
        pathTo: this.$route.path + "/" + this.data.id,
    };
  },

  computed: {
    getPath() {
      return this.data.path + "/" + this.data.id;
    },
  },
};
</script>