<template>
  <v-btn class="btn-red" plain text :to="{ path: data.path }">
    <div>{{ data.title }}</div>
  </v-btn>
</template>

<script>
export default {
  name: "MenuItem",
  props: {
    data: Object,
  },
  data() {
    return {};
  },
  computed: {
    getPath() {
      return this.data.path;
    },
  },
  methods: {},
};
</script>

<style>
.test{
  border-left: 2px solid red;
}
.btn-red {
  margin-left: 20px;
}
</style>
