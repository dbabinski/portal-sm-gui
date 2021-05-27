Vue.component("view-konto", {
  data: function () {
    return {
      pacjent: {},
    };
  },
  computed: {
    pacjentIsNotEmpty() {
      return Object.keys(this.pacjent).length;
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      this.$nextTick(function () {
        app.showLoadingToast();
        fetch("/sm-portal-server/pacjenci/dane-pacjenta")
          .then((res) => {
            app.hideLoadingToast();
            return app.handleErrors(res);
          })
          .then((res) => res.json())
          .then((json) => {
            if (json.blad === false) {
              this.pacjent = json.dane;
            }
          });
      });
    },
  },
  template: `
        <div class='view-konto'>
            <view-konto-dane-konta></view-konto-dane-konta>
            <view-konto-dane-podstawowe v-show="pacjentIsNotEmpty" :pacjent.sync="pacjent"></view-konto-dane-podstawowe>
            <view-konto-dokument-tozsamosci v-show="pacjentIsNotEmpty" v-bind:pacjent="pacjent"></view-konto-dokument-tozsamosci>
            <view-konto-adres-email v-show="pacjentIsNotEmpty" v-bind:pacjent="pacjent"></view-konto-adres-email>
            <view-konto-numer-telefonu v-show="pacjentIsNotEmpty" v-bind:pacjent="pacjent"></view-konto-numer-telefonu>
        </div>
    `,
});
