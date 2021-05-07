Vue.component("view-konto-dokument-tozsamosci", {
  props: ["pacjent"],
  data() {
    return {
      typyDokumentow: [],
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      fetch("/euslugi-zarzadzanie-server/slowniki/typy-dokumentow/")
        .then((res) => app.handleErrors(res))
        .then((res) => res.json())
        .then((json) => {
          if (json.blad === true) {
            app.getMessageDialog().setMessage(json.komunikat).show();
          } else {
            this.typyDokumentow = [{}].concat(json.dane.typyDokumentow);
          }
        });
    },
    _refresh() {},
    _save() {},
    focus() {
      this.$nextTick(() => this.$refs.select.focus());
      return this;
    },
  },
  template: `
      <div class='view-konto-dokument-tozsamosci'>
          <div class='view-header'>Dokument tożsamości</div>
          <form>
              <input type="hidden" name='id' v-model.number="pacjent.id"></input>
              <div class='grid'>
                  <label class='label nowrap' for='viewKontoDokumentTozsamosci-typDokumentu'>Typ dokumentu tożsamości</label>
                  <div class="select-wrap">
                    <select id='viewKontoDokumentTozsamosci-typDokumentuTozsamosci' ref="select" v-model="pacjent.idTypDokumentuTozsamosci" name="typDokumentuTozsamosci">
                        <option v-for='typDokumentu in typyDokumentow' :key='typDokumentu.id' :value='typDokumentu.id'>{{typDokumentu.nazwaDokumentuTozsamosci}}</option>
                    </select>
                </div>  
                  
                  <label class='label nowrap' for='viewKontoDokumentTozsamosci-nrDokumentu'>Nr dokumentu tożsamości</label>
                  <input id='viewKontoDokumentTozsamosci-email' ref='nrDokumentu' type='email' name='nrDokumentu' v-model.trim="pacjent.numerDokumentuTozsamosci"></input>
              </div>
              <div class='buttons-panel'>
                  <sm-button class='margin-top-2x' label="Przywróć" @on-click='_refresh'></sm-button>
                  <sm-button class='margin-top-2x margin-left green-button' label="Zmień informacje o dokumencie tożsamości" @on-click='_save'></sm-button>
              </div>
          </form>
      </div>
      `,
});
