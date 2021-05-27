Vue.component("view-konto-dane-podstawowe", {
  props: ["pacjent"],
  methods: {
    _refresh() {
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
              this.$emit('update:pacjent', json.dane);
            }
          });
      });
    },
    _save() {
      fetch("/sm-portal-server/pacjenci/", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(this.pacjent),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.blad === true) {
            app.getMessageDialog().setMessage(json.komunikat).show();
          } else {
            app.toast("Dane pacjenta zostały zapisane");
            this.$refs.formularz.clear();
            this.$refs.formDialog.hide();
          }
          this.refresh();
        });
    },
    focus() {
      this.$nextTick(() => this.$refs.uzytkownik.focus());
      return this;
    },
  },
  template: `
    <div class='view-konto-dane-podstawowe'>
        <div class='view-header'>Dane podstawowe</div>
        <form>
            <input type="hidden" name='id' v-model.number="pacjent.id"></input>
            <div class='grid'>
                <label class='label nowrap' for='viewKontoDanePodstawowe-imie'>Imię</label>
                <input id='viewKontoDanePodstawowe-imie' ref='imie' type='text' name='imie' v-model.trim="pacjent.imie" :disabled='true'></input>

                <label class='label nowrap' for='viewKontoDanePodstawowe-nazwisko'>Nazwisko</label>
                <input id='viewKontoDanePodstawowe-nazwisko' ref='nazwisko' type='text' name='nazwisko' v-model.trim="pacjent.nazwisko" :disabled='true'></input>

                <label class='label nowrap' for='viewKontoDanePodstawowe-pesel'>PESEL</label>
                <input id='viewKontoDanePodstawowe-pesel' ref='pesel' type='text' name='pesel' v-model.trim="pacjent.pesel" :disabled='true'></input>

                <label class='label nowrap' for='viewKontoDanePodstawowe-miejscowosc'>Miejscowość</label>
                <input id='viewKontoDanePodstawowe-miejscowosc' ref='miejscowosc' type='text' name='miejscowosc' v-model.trim="pacjent.miejscowosc"></input>

                <label class='label nowrap' for='viewKontoDanePodstawowe-kodPocztowy'>Kod pocztowy</label>
                <input id='viewKontoDanePodstawowe-kodPocztowy' ref='kodPocztowy' type='text' name='kodPocztowy' v-model.trim="pacjent.kodPocztowy"></input>
           
                <label class='label nowrap' for='viewKontoDanePodstawowe-ulica'>Ulica</label>
                <input id='viewKontoDanePodstawowe-ulica' ref='ulica' type='text' name='ulica' v-model.trim="pacjent.ulica"></input>

                <label class='label nowrap' for='viewKontoDanePodstawowe-nrDomu'>Nr domu</label>
                <input id='viewKontoDanePodstawowe-nrDomu' ref='nrDomu' type='text' name='nrDomu' v-model.trim="pacjent.nrDomu"></input>

                <label class='label nowrap' for='viewKontoDanePodstawowe-nrLokalu'>Nr lokalu</label>
                <input id='viewKontoDanePodstawowe-nrLokalu' ref='nrLokalu' type='text' name='nrLokalu' v-model.trim="pacjent.nrLokalu"></input>
            </div>
            <div class='buttons-panel'>
                <sm-button class='margin-top-2x margin-left' label="Przywróć" @on-click='_refresh'></sm-button>
                <sm-button class='margin-top-2x margin-left green-button' label="Zapisz" @on-click='_save'></sm-button>
            </div>
        </form>
    </div>
    `,
});
