Vue.component("form-uzytkownicy-konto", {
  data: function () {
    return {
      konto: {},
      grupy: [],
      pacjenciNadrzedni: {},
      pacjenciPodrzedni: {},
    };
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
    },
    onSubmit() {
      let self = this;
      self.setValid();
      fetch("/sm-portal-server/uzytkownicy/konta/parse", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(this.konto),
      })
        .then((res) => app.handleErrors(res))
        .then((res) => res.json())
        .then((json) => {
          if (json.blad === true) {
            app.getMessageDialog().setMessage(json.komunikat).show();
          } else if (json.uwaga === true) {
            let uwagi = json.dane;
            Object.keys(uwagi).forEach(function (key) {
              if (!utils.isNull(self.$refs[key]) && uwagi[key].length > 0) {
                self.$refs[key].message = uwagi[key].join(", ");
              }
            });
          } else {
            let noweKonto = this.konto;
            this.$emit("on-submit", noweKonto);
          }
        });
    },
    onCancel() {
      this.clear();
      this.$emit("on-cancel");
    },
    clear() {
      this.setValid();
      this.konto = {};
      this.grupy = [];
      return this;
    },
    setValid() {
      let self = this;
      Object.keys(self.$refs).forEach(function (key) {
        self.$refs[key].message = null;
      });
    },
    focus() {
      this.$nextTick(() => {
        this.$refs.idGrupaSelect.focus();
        this.loadPacjenciNadrzedni();
        this.loadPacjenciPodrzedni();
      });
      return this;
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
    addItem(id) {
      this.$refs.dialogWyborNiepowiazaneKonto.show();
      this.$refs.formWyborNiepowiazaneKonto.clear().focus();
      let excludedIDs = [];
      excludedIDs.push(id),
        this.konto.kontaPodrzedne.forEach(function (item) {
          excludedIDs.push(item.id);
        });
      this.$refs.formWyborNiepowiazaneKonto.excludedIDs = excludedIDs;
    },
    confirmDeleteItem(pacjentPodrzedny) {
      this.$refs.dialogUsun
        .setMessage("Czy usunąć powiązanie?")
        .setObject(pacjentPodrzedny)
        .show();
    },
    deleteItem(pacjentPodrzedny) {
      let params = {
        kontoId: this.konto.id,
        pacjentId: pacjentPodrzedny.id,
      };
      app.send(
        "DELETE",
        "/sm-portal-server/pacjenci/usun-powiazanie-pacjenta",
        params,
        this.loadPacjenciPodrzedni
      );
    },
    closeFormWyborNiepowiazaneKonto() {
      this.$refs.formWyborNiepowiazaneKonto.clear();
      this.$refs.dialogWyborNiepowiazaneKonto.hide();
    },
    submitFormWyborNiepowiazaneKonto() {
      this.$refs.dialogWyborNiepowiazaneKonto.hide();
      let obj = this.$refs.formWyborNiepowiazaneKonto.getSelectedObject();
      if (!utils.isNull(obj)) {
        this.konto.kontaPodrzedne.push(obj);
      }
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
    loadPacjenciNadrzedni() {
      const self = this;
      if (self.konto.id != null) {
        let kontoId = { konto: self.konto.id };
        fetch("/sm-portal-server/uzytkownicy/konta/nadrzedni", {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(kontoId),
        })
          .then((res) => app.handleErrors(res))
          .then((res) => res.json())
          .then((json) => {
            if (json.blad === true) {
              app.getMessageDialog().setMessage(json.komunikat).show();
            } else {
              self.pacjenciNadrzedni = json.dane.nadrzedni;
            }
          });
      }
    },
    loadPacjenciPodrzedni() {
      const self = this;
      if (self.konto.id != null) {
        let kontoId = { konto: self.konto.id };
        fetch("/sm-portal-server/uzytkownicy/konta/podrzedni", {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(kontoId),
        })
          .then((res) => app.handleErrors(res))
          .then((res) => res.json())
          .then((json) => {
            if (json.blad === true) {
              app.getMessageDialog().setMessage(json.komunikat).show();
            } else {
              self.pacjenciPodrzedni = json.dane.podrzedni;
            }
          });
      }
    },
    addPacjentPodrzedny() {
      this.$refs.dialogDialogSamodzielnie.show();
      this.$refs.formularzSamodzielnie.nadrzedne = false;
      this.$refs.formularzSamodzielnie.clear().load().focus();
    },
    saveItemSelf(object) {
      let pacjentPodrzedny = {
        kontoId: this.konto.id,
        pacjent: object,
        nadrzedny: false,
      };
      fetch("/sm-portal-server/pacjenci/do-konta", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(pacjentPodrzedny),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.blad === true) {
            app.getMessageDialog().setMessage(json.komunikat).show();
          } else {
            app.toast("Dane pacjenta zostały zapisane");
            this.$refs.formularzSamodzielnie.clear();
            this.$refs.dialogDialogSamodzielnie.hide();
            this.loadPacjenciPodrzedni();
          }
        });
    },
    closeFormSelf() {
      this.$refs.dialogDialogSamodzielnie.hide();
    },
    editUprawnienia(object) {
      this.$refs.formUprawnienia.load(object);
      this.$refs.formUprawnienia.focus();
      this.$refs.dialogUprawnienia.show();
    },
    closeFormUprawnienia() {
      this.$refs.formUprawnienia.clear();
      this.$refs.dialogUprawnienia.hide();
    },
    saveItemUprawnienia(object) {
      fetch("/sm-portal-server/uzytkownicy/uprawnienia/konto", {
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
            app.toast("Uprawnienia zostały zapisane");
            this.$refs.formUprawnienia.clear();
            this.$refs.dialogUprawnienia.hide();
          }
          this.load();
        });
    },
    addPacjentNadrzedny() {
      this.$refs.dialogPacjentNadrzedny.show();
      this.$refs.formPacjentNadrzedny.clear().load().focus();
    },
    saveItemPacjentNadrzedny(object) {
      let pacjentNadrzedny = {
        kontoId: this.konto.id,
        pacjent: object,
        nadrzedny: true,
      };
      fetch("/sm-portal-server/pacjenci/do-konta", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(pacjentNadrzedny),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.blad === true) {
            app.getMessageDialog().setMessage(json.komunikat).show();
          } else {
            app.toast("Dane pacjenta zostały zapisane");
            this.$refs.formPacjentNadrzedny.clear();
            this.$refs.dialogPacjentNadrzedny.hide();
            this.loadPacjenciNadrzedni();
          }
        });
    },
    closeFormPacjentNadrzedny() {
      this.$refs.formPacjentNadrzedny.clear();
      this.$refs.dialogPacjentNadrzedny.hide();
    },
    editPacjentPodrzedny(object) {
      // pobieranie świeżych danych
      fetch("/sm-portal-server/pacjenci/" + object.id)
        .then((res) => app.handleErrors(res))
        .then((res) => res.json())
        .then((json) => {
          if (json.blad === true) {
            app.getMessageDialog().setMessage(json.komunikat).show();
          } else {
            this.$refs.formularzSamodzielnie.clear().load();
            this.$refs.formularzSamodzielnie.pacjent = utils.copyJSON(
              json.dane
            );
            this.$refs.formularzSamodzielnie.nadrzedne = false;
            this.$refs.formularzSamodzielnie.focus();
            this.$refs.dialogDialogSamodzielnie.label = 'Edycja danych pacjenta';
            this.$refs.dialogDialogSamodzielnie.show();
          }
        });
    },
    editPacjentNadrzedny(object) {
      fetch("/sm-portal-server/pacjenci/" + object.id)
        .then((res) => app.handleErrors(res))
        .then((res) => res.json())
        .then((json) => {
          if (json.blad === true) {
            app.getMessageDialog().setMessage(json.komunikat).show();
          } else {
            this.$refs.formPacjentNadrzedny.clear().load();
            this.$refs.formPacjentNadrzedny.pacjent = utils.copyJSON(json.dane);
            this.$refs.formPacjentNadrzedny.nadrzedne = false;
            this.$refs.formPacjentNadrzedny.focus();
            this.$refs.dialogPacjentNadrzedny.label = 'Edycja danych pacjenta';
            this.$refs.dialogPacjentNadrzedny.show();
          }
        });
    },
  },
  template: `
    <div class='form-uzytkownicy-konto'>
        <form>
            <input type="hidden" name='id' v-model.number="konto.id"></input>
            <input type="hidden" name='kontaPodrzedne' v-model.number="konto.kontaPodrzedne"></input>
            <div class='grid'>
                <label for='formUzytkownicyKonto-idTypGrupy'>Grupa</label>
                <div class="select-wrap">
                    <select id="formUzytkownicyKonto-idGrupa" ref="idGrupaSelect" v-model="konto.idGrupa" name="idGrupa" required>
                        <option v-for='grupa in grupy' :key='grupa.id' :value='grupa.id'>{{grupa.opis}}</option>
                    </select>
                    <sm-input-warning ref='idGrupa'></sm-input-warning>
                </div>

                <label for='formUzytkownicyKonto-login'>Login</label>
                <sm-input id="formUzytkownicyKonto-login" ref='login' type='text' name='login' v-model.trim="konto.login"></sm-input>

                <label for='formUzytkownicyKonto-email'>E-mail</label>
                <sm-input id="formUzytkownicyKonto-email" ref='email' type='text' name='email' v-model.trim="konto.email" required></sm-input>

                <label for='formUzytkownicyKonto-kontoAktywne'>Konto aktywne</label>
                <input id="formUzytkownicyKonto-kontoAktywne" ref="kontoAktywne" type="checkbox" name="kontoAktywne" v-model="konto.kontoAktywne">

                <label for='formUzytkownicyKonto-akceptacjaRegulaminu'>Akceptacja regulaminu</label>
                <sm-input id="formUzytkownicyKonto-akceptacjaRegulaminu" ref="akceptacjaRegulaminu" type="text" name="akceptacjaRegulaminu" v-model="konto.akceptacjaRegulaminu" placeholder='RRRR-MM-DD gg:mm:ss'></sm-input>

                <label for='formUzytkownicyKonto-blokadaKonta'>Blokada konta</label>
                <input id="formUzytkownicyKonto-blokadaKonta" ref="blokadaKonta" type="checkbox" name="blokadaKonta" v-model="konto.blokadaKonta">

                <label for='formUzytkownicyKonto-blokadaKontaDo'>Blokada konta do</label>
                <sm-input id="formUzytkownicyKonto-blokadaKontaDo" ref="blokadaKontaDo" type="text" name="blokadaKontaDo" v-model="konto.blokadaKontaDo"
                    placeholder='RRRR-MM-DD gg:mm:ss' :disabled='!(konto.blokadaKonta === true)'></sm-input>

                <div></div>
                <div class='buttons-panel'>
                    <sm-button class='margin-top-2x button' :object="konto" label="Uprawnienia" @on-click='editUprawnienia'></sm-button>
                    <sm-button class='margin-top-2x margin-left red-button' label="Resetuj hasło" @on-click='resetHasla'></sm-button>
                    <sm-button class='margin-top-2x margin-left red-button' label="Reset hasła przez e-mail" @on-click='resetHaslaEmail'></sm-button>
                </div>
            </div>
            
            <div v-show='!konto.isKontrahent' v-if='konto' class='row-container'>
                <div class='sub-header'>Pacjent nadrzędny</div>
                <table class='konta'>
                    <tr>
                        <th>Imię</th>
                        <th>Nazwisko</th>
                        <th>PESEL</th>
                        <th>Dane potwierdzone</th>
                        <th></th>
                        <th v-if="!pacjenciNadrzedni.length" class='button-td'>
                            <span>Dodaj pacjenta przypisanego do konta</span>
                            <sm-button class='green-button button-fill' label='<i class="fas fa-plus"></i>' title='Dodaj pacjenta przypisanego do konta' @on-click='addPacjentNadrzedny'></sm-button>
                        </th>
                    </tr>
                    <tr class='row' v-for='pacjentNadrzedny in pacjenciNadrzedni' :key="pacjentNadrzedny.id">
                        <td class='cell'><span>Imię</span>{{pacjentNadrzedny.imie}}</td>
                        <td class='cell'><span>Nazwisko</span>{{pacjentNadrzedny.nazwisko}}</td>
                        <td class='cell'><span>PESEL</span>{{pacjentNadrzedny.pesel}}</td>
                        
                        <td v-if='pacjentNadrzedny.potwierdzenie_danych'><span>Dane potwierdzone</span><i class="icon-blue fas fa-check"></i>Tak</td>
                        <td v-else><span>Dane potwierdzone</span><i class="icon-red fas fa-times"></i>Nie</td>
                        <td class='button-td'>
                            <sm-button label='<i class="fas fa-pen"></i>' :object="pacjentNadrzedny" title='Edytuj konto' @on-click='editPacjentNadrzedny'></sm-button>
                        </td>
                    </tr>
                </table>
            </div>
            <div v-if='konto.id' class='row-container'>
                <div class='sub-header'>Pacjenci podrzędni</div>
                <table class='konta'>
                    <tr>
                        <th>Imię</th>
                        <th>Nazwisko</th>
                        <th>PESEL</th>
                        <th>Dane potwierdzone</th>
                        <th class='button-td'>
                            <span>Dodaj powiązanie</span>
                            <sm-button class='green-button button-fill' label='<i class="fas fa-plus"></i>' title='Dodaj powiązanie' @on-click='addPacjentPodrzedny'></sm-button>
                        </th>
                    </tr>
                    <tr class='row' v-for='pacjentPodrzedny in pacjenciPodrzedni' :key="pacjentPodrzedny.id">
                        <td class='cell'><span>Imię</span>{{pacjentPodrzedny.imie}}</td>
                        <td class='cell'><span>Nazwisko</span>{{pacjentPodrzedny.nazwisko}}</td>
                        <td class='cell'><span>PESEL</span>{{pacjentPodrzedny.pesel}}</td>
                        
                        <td v-if='pacjentPodrzedny.potwierdzenie_danych'><span>Dane potwierdzon</span><i class="icon-blue fas fa-check"></i><Tak/td>
                        <td v-else><span>Dane potwierdzone</span><i class="icon-red fas fa-times"></i>Nie</td>
                        
                        <td class='button-td'>
                            <sm-button label='<i class="fas fa-pen"></i>' :object="pacjentPodrzedny" title='Edytuj konto' @on-click='editPacjentPodrzedny'></sm-button>
                            <sm-button class='red-button' label='<i class="fas fa-trash-alt"></i>' title="Usuń powiązanie" :object="pacjentPodrzedny" @on-click='confirmDeleteItem'></sm-button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class='buttons-panel'>
                <sm-button class='margin-top-2x margin-right green-button' label="Zapisz" @on-click='onSubmit'></sm-button>
                <sm-button class='margin-top-2x' label="Anuluj" @on-click='onCancel'></sm-button>
            </div>
        </form>

        <sm-form-dialog ref='dialogWyborNiepowiazaneKonto' label="Konta niepowiązane">
            <form-wybor-niepowiazane-konto ref='formWyborNiepowiazaneKonto'
                @on-cancel='closeFormWyborNiepowiazaneKonto'
                @on-submit='submitFormWyborNiepowiazaneKonto'
            />
        </sm-form-dialog>

        <sm-modal-dialog ref='dialogUsun' focusedButton='cancel' okLabel="Usuń" okClass="red-button" @on-click-ok="deleteItem">
            <i class="fas fa-exclamation-triangle fa-3x icon warning-icon"></i>
        </sm-modal-dialog>

        <sm-form-dialog ref='dialogResetHasla' label="Resetowanie hasła" maxwidth="400px">
            <form-reset-hasla ref='formResetHasla'
                @on-cancel='closeFormResetHasla'
                @on-submit='saveNoweHaslo'
            />
        </sm-form-dialog>

        <sm-form-dialog ref='dialogDialogSamodzielnie' label="Nowe dane pacjenta">
            <form-pacjent-samodzielnie ref='formularzSamodzielnie'
                @on-submit="saveItemSelf"
                @on-cancel='closeFormSelf'>
            </form-pacjent-samodzielnie>
        </sm-form-dialog>

        <sm-form-dialog ref='dialogUprawnienia' label="Uprawnienia">
            <form-konto-uprawnienia ref='formUprawnienia' @on-submit="saveItemUprawnienia" @on-cancel='closeFormUprawnienia'></form-konto-uprawnienia>
        </sm-form-dialog>

        <sm-form-dialog ref='dialogPacjentNadrzedny' label="Nowe dane pacjenta przypisanego do konta">
            <form-pacjent-nadrzedny ref='formPacjentNadrzedny' @on-submit="saveItemPacjentNadrzedny" @on-cancel='closeFormPacjentNadrzedny'></form-pacjent-nadrzedny>
        </sm-form-dialog>
    </div>
    `,
});
