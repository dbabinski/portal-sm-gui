Vue.component("view-konto-dane-konta", {
  data: function () {
    return {
      konto: {},
      grupy: [],
    };
  },
  mounted() {
      this.load();
  },
  methods: {
    load() {
      let loadGrupy = fetch("/sm-portal-server/uzytkownicy/grupy/")
        .then((res) => app.handleErrors(res))
        .then((res) => res.json())
        .then((json) => {
          if (json.blad === true) {
            app.getMessageDialog().setMessage(json.komunikat).show();
          } else {
            this.grupy = [{}].concat(json.dane.grupy);
          }
        });
      this.$nextTick(function () {
        app.showLoadingToast();
        fetch("/sm-portal-server/uzytkownicy/konta/dane-konta")
          .then((res) => {
            app.hideLoadingToast();
            return app.handleErrors(res);
          })
          .then((res) => res.json())
          .then((json) => {
            if (json.blad === true) {
              app.getMessageDialog().setMessage(json.komunikat).show();
            } else {
              this.konto = json.dane;
            }
          });
      });
    },
    resetHasla() {
      this.$refs.dialogResetHasla.show();
      this.$refs.formResetHasla.focus();
    },
    resetHaslaEmail() {
      let dialog = app.getDialogPasswordResetEmail();
      dialog.resetHasla.email = this.konto.email;
      dialog.emailReadOnly = true;
      dialog.show("Reset hasła przez e-mail");
    },
    closeFormResetHasla() {
      this.$refs.formResetHasla.clear();
      this.$refs.dialogResetHasla.hide();
    },
    saveNoweHaslo(object) {
      object.idKonta = this.konto.id;
      fetch("/sm-portal-server/uzytkownicy/zmiana-hasla", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(object),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.blad === true) {
            app.getMessageDialog().setMessage(json.komunikat).show();
          } else {
            app.toast("Hasło użytkownika zostało zmienione");
            this.$refs.formResetHasla.clear();
            this.$refs.dialogResetHasla.hide();
          }
        });
    },
  },
  template: `
        <div class='view-konto-dane-konta'>
            <div class='view-header'>Konto</div>
            <div class='grid'>
            <label for='viewKontoDaneKonta-idTypGrupy'>Grupa</label>
            <div class="select-wrap">
                <select id="viewKontoDaneKonta-idGrupa" ref="idGrupaSelect" v-model="konto.idGrupa" name="idGrupa" :disabled='true'>
                    <option v-for='grupa in grupy' :key='grupa.id' :value='grupa.id'>{{grupa.opis}}</option>
                </select>
                <sm-input-warning ref='idGrupa'></sm-input-warning>
            </div>
            <label for='viewKontoDaneKonta-login'>Login</label>
            <sm-input id="viewKontoDaneKonta-login" ref='login' type='text' name='login' v-model.trim="konto.login" :disabled='true'></sm-input>
            </div>
            <div class='buttons-panel'>
                <sm-button class='margin-top-2x red-button' label="Resetuj hasło" @on-click='resetHasla'></sm-button>
                <sm-button class='margin-top-2x margin-left red-button' label="Reset hasła przez e-mail" @on-click='resetHaslaEmail'></sm-button>
            </div>
            <sm-form-dialog ref='dialogResetHasla' label="Resetowanie hasła" maxwidth="400px">
                <form-reset-hasla ref='formResetHasla'
                    @on-cancel='closeFormResetHasla'
                    @on-submit='saveNoweHaslo'
                />
            </sm-form-dialog>
        </div>
        `,
});
