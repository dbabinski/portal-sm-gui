<template>
  <v-card class="my-5" max-width="">
    <v-img
      class="white--text align-end"
      height="200px"
      src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
    >
      <v-card-title>{{ data.tytul }}</v-card-title>
    </v-img>

    <v-card-subtitle class="text-left pb-0">{{ data.autor }} </v-card-subtitle>

    <v-card-text class="mb-0 pb-0 text-left text--primary">
        {{ data.skrot }}
    </v-card-text>
    <v-card-text class="py-0 my-0 text-left text-caption">
        {{ data.dataPublikacji }}
    </v-card-text>

    <v-card-actions>
      <v-btn color="primary" text> Czyta dalej .. </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  components: {},
  name: "ArticleCard",
  data() {
    return {};
  },
  props: {
      data: Object,
  }
};
</script>