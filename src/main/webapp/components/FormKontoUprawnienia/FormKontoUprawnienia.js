Vue.component('form-konto-uprawnienia', {
    data: function () {
        return {
            konto: {},
            rekordUprawnienia: {}
        };
    },
    computed: {
        opisGrupy() {
            return (!utils.isNull(this.rekordUprawnienia) && !utils.isNull(this.rekordUprawnienia.grupa)) ? this.rekordUprawnienia.grupa.opis : null;
        }
    },
    methods: {
        load(object) {
            fetch("/euslugi-zarzadzanie-server/uzytkownicy/uprawnienia/konto/" + object.id, {
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                },
              })
                .then((res) => app.handleErrors(res))
                .then((res) => res.json())
                .then((json) => {
                  if (json.blad === true) {
                    app.getMessageDialog().setMessage(json.komunikat).show();
                  } else {
                    this.rekordUprawnienia = json.dane;
                  }
                });
        },
        onSubmit: function() {
            var errors = [];
            let labels = document.getElementsByTagName("LABEL");
            let noweUprawnienia = this.rekordUprawnienia;
            if(errors.length > 0) {
                var message = "";
                for (var i=0; i < errors.length; i++) {
                    message += errors[i] + '<br/>';
                }
                app.getMessageDialog().setMessage(message).show();
            } else {
                this.$emit('on-submit', noweUprawnienia);
            }
        },
        onCancel: function() {
            this.clear();
            this.$emit('on-cancel');
        },
        clear: function() {
            this.rekordUprawnienia = {};
            return this;
        },
        focus: function() {
            this.$nextTick(() => this.$refs.dostepDoKartotekiPacjentaPowiazanego.focus());
            return this;
        }
    },
    template: `
    <div class='form-uzytkownicy-uprawnienia'>
        <form>
            <input type="hidden" name='id' v-model.number="rekordUprawnienia.id"></input>
            <div class='grid'>
                <label for='dostepDoKartotekiPacjentaPowiazanego'>Dostęp do kartoteki pacjenta powiązanego</label>
                <input ref="dostepDoKartotekiPacjentaPowiazanego" type="checkbox" name="dostepDoKartotekiPacjentaPowiazanego" v-model="rekordUprawnienia.dostepDoKartotekiPacjentaPowiazanego">
            </div>
            <div class='buttons-panel'>
                <sm-button class='margin-top-2x margin-right green-button' label="Zapisz" @on-click='onSubmit'></sm-button>
                <sm-button class='margin-top-2x' label="Anuluj" @on-click='onCancel'></sm-button>
            </div>
        </form>
    </div>
    `
})