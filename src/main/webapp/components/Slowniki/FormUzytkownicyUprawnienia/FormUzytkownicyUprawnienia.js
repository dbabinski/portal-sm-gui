Vue.component('form-uzytkownicy-uprawnienia', {
    data: function () {
        return {
            rekordUprawnienia: {}
        };
    },
    computed: {
        opisGrupy() {
            return (!utils.isNull(this.rekordUprawnienia) && !utils.isNull(this.rekordUprawnienia.grupa)) ? this.rekordUprawnienia.grupa.opis : null;
        }
    },
    methods: {
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
            this.$nextTick(() => this.$refs.dodawaniePacjentowPowiazanych.focus());
            return this;
        }
    },
    template: `
    <div class='form-uzytkownicy-uprawnienia'>
        <form>
            <input type="hidden" name='id'  v-model.number="rekordUprawnienia.id"></input>
            <label class='padding-bottom-2x' for='nazwaGrupy'>Nazwa grupy <strong>{{opisGrupy}}</strong></label>
            <div class='grid'>
                <label for='dodawaniePacjentowPowiazanych'>Dodawanie pacjentów powiązanych</label>
                <input ref="dodawaniePacjentowPowiazanych" type="checkbox" name="dodawaniePacjentowPowiazanych" v-model="rekordUprawnienia.dodawaniePacjentowPowiazanych">

                <label for='dostepDoListyPacjentow'>Dostęp do listy pacjentów</label>
                <input ref="dostepDoListyPacjentow" type="checkbox" name="dostepDoListyPacjentow" v-model="rekordUprawnienia.dostepDoListyPacjentow">

                <label for='planowanieWizyt'>Planowanie wizyt</label>
                <input ref="planowanieWizyt" type="checkbox" name="planowanieWizyt" v-model="rekordUprawnienia.planowanieWizyt">

                <label for='dostepDoKartotekiPacjentaPowiazanego'>Dostęp do kartoteki pacjenta powiązanego</label>
                <input ref="dostepDoKartotekiPacjentaPowiazanego" type="checkbox" name="dostepDoKartotekiPacjentaPowiazanego" v-model="rekordUprawnienia.dostepDoKartotekiPacjentaPowiazanego">

                <label for='blokowanieKonta'>Blokowanie konta</label>
                <input ref="blokowanieKonta" type="checkbox" name="blokowanieKonta" v-model="rekordUprawnienia.blokowanieKonta">
            </div>
            <div class='buttons-panel'>
                <sm-button class='margin-top-2x margin-right green-button' label="Zapisz" @on-click='onSubmit'></sm-button>
                <sm-button class='margin-top-2x' label="Anuluj" @on-click='onCancel'></sm-button>
            </div>
        </form>
    </div>
    `
})