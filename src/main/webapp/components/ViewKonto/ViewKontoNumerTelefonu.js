Vue.component("view-konto-numer-telefonu", {
  props: ["pacjent"],
  computed: {
    get() {
      return this.pacjent.telefonKontaktowy;
    },
    set(telefonKontaktowy){
      return telefonKontaktowy;
    } 
  },
  methods: {
    _refresh() {
      this.$refs.telefon.value = this.pacjent.telefonKontaktowy;
    },
    _save() {},
    focus() {
      this.$nextTick(() => this.$refs.telefon.focus());
      return this;
    },
  },
  template: `
      <div class='view-konto-numer-telefonu'>
          <div class='view-header'>Numer telefonu</div>
          <form>
              <input type="hidden" name='id' v-model.number="pacjent.id"></input>
              <div class='grid'>
                  <label class='label nowrap' for='viewKontoNumerTelefonu-telefon'>Numer telefonu</label>
                  <input id='viewKontoNumerTelefonu-telefon' ref='telefon' type='text' name='telefon' v-bind:value="pacjent.telefonKontaktowy"></input>
              </div>
              <div class='buttons-panel'>
                  <sm-button class='margin-top-2x' label="Przywróć" @on-click='_refresh'></sm-button>
                  <sm-button class='margin-top-2x margin-left green-button' label="Zmień numer telefonu" @on-click='_save'></sm-button>
              </div>
          </form>
      </div>
      `,
});
