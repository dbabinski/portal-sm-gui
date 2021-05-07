Vue.component("view-konto-adres-email", {
  props: ["pacjent"],
  computed: {
    get() {
      return this.pacjent.email;
    },
    set(email){
      return email;
    } 
  },
  methods: {
    _changeEmail() {
      //TODO
    },
    _refresh() {
      this.$refs.email.value = this.pacjent.email;
    },
    focus() {
      this.$nextTick(() => this.$refs.email.focus());
      return this;
    },
  },
  template: `
      <div class='view-konto-adres-email'>
          <div class='view-header'>Adres e-mail</div>
          <form>
              <input type="hidden" name='id' v-model.number="pacjent.id"></input>
              <div class='grid'>
                  <label class='label nowrap' for='viewKontoAdresEmail-email'>Adres e-mail</label>
                  <input id='viewKontoAdresEmail-email' ref='email' type='email' name='email' v-bind:value="pacjent.email"></input>
              </div>
              <div class='buttons-panel'>
                  <sm-button class='margin-top-2x' label="Przywróć" @on-click='_refresh'></sm-button>
                  <sm-button class='margin-top-2x margin-left green-button' label="Zmień adres e-mail" @on-click='_changeEmail'></sm-button>
              </div>
          </form>
      </div>
      `,
});
