Vue.component('form-pacjent-nadrzedny', {
    data() {
        return {
            pacjent: {
                dataUrodzenia: null,
                plec: "mężczyzna"
            },
            plci: ["kobieta", "mężczyzna"],
            ustawieniaPacjenta: {},
            polaWymagane: ["imie", "nazwisko", "pesel"]
        };
    },
    methods: {
        load() {
            let loadUstawieniaPacjenta = fetch("/sm-portal-server/serwis/ustawienia-pacjenta")
                .then(res => app.handleErrors(res))
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                       this.ustawieniaPacjenta = json.dane.ustawieniaPacjenta;
                       this.polaWymagane = this.ustawieniaPacjenta.polaWymaganeSamodzielnie;
                    }
                });
            return this;
        },
        onSubmit() {
            let self = this;
            self.setValid();
            fetch("/sm-portal-server/pacjenci/parse/", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify(self.pacjent)
                })
                .then(res => app.handleErrors(res))
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else if(json.uwaga === true) {
                        let uwagi = json.dane;
                        Object.keys(uwagi).forEach(function(key) {
                            if(!utils.isNull(self.$refs[key])
                                && uwagi[key].length > 0) {
                                self.$refs[key].message = uwagi[key].join(', ');
                            }
                        });
                        //grecaptcha.reset();
                    } else {
                        let nowyPacjent = self.pacjent;
                        self.$emit('on-submit', nowyPacjent);
                    }
                });
        },
        onCancel() {
            this.clear();
            this.$emit('on-cancel');
        },
        onBlurPesel() {
            let self = this;
            let pesel = this.pacjent.pesel;
            if(utils.czyPeselPrawidlowy(pesel, true)) {
                self.pacjent.plec = utils.plecNaPodstawiePesel(pesel);
                if(utils.isNull(self.pacjent.dataUrodzenia)) {
                        self.pacjent.dataUrodzenia = utils.dataNaPodstawiePesel(pesel);
                }
            }
        },
        clear() {
            this.setValid();
            this.pacjent = {plec: "mężczyzna", dataUrodzenia: null};
            return this;
        },
        setValid() {
            let self = this;
            Object.keys(self.$refs).forEach(function(key) {
                if(self.$refs[key]){
                    self.$refs[key].message = null;
                }
            });
        },
        focus() {
            this.$nextTick(() => this.$refs.nazwisko.focus());
            return this;
        }
    },
    template: `
    <div class='form-pacjent-nadrzedny'>
        <form>
            <input type="hidden" name='id' v-model.number="pacjent.id"></input>
            <div class='grid'>
                <label for='formPacjentNadrzedny-nazwisko'>Nazwisko</label>
                <sm-input id='formPacjentNadrzedny-nazwisko' ref='nazwisko' type='text' name='nazwisko' v-model.trim="pacjent.nazwisko" required></sm-input>

                <label for='formPacjentNadrzedny-imie'>Imię</label>
                <sm-input  id='formPacjentNadrzedny-imie' ref='imie' type='text' name='imie' v-model.trim="pacjent.imie" required></sm-input>

                <label for='formPacjentNadrzedny-pesel'>PESEL</label>
                <sm-input id='formPacjentNadrzedny-pesel' ref='pesel' type='text' name='pesel' required v-model.trim="pacjent.pesel" @blur="onBlurPesel"></sm-input>

                <label for='formPacjentNadrzedny-plec'>Płeć</label>
                <div>
                    <div class="select-wrap">
                        <select class='select' id='formPacjentNadrzedny-plec' ref="select" v-model="pacjent.plec" name="plec" required>
                            <option v-for='plec in plci' :key='plec' :value='plec'>{{plec}}</option>
                        </select>
                    </div>
                    <sm-input-warning ref="plec"></sm-input-warning>
                </div>

                <label class='nowrap' for='formPacjentNadrzedny-dataUrodzenia'>Data urodzenia</label>
                <sm-input id='formPacjentNadrzedny-dataUrodzenia' ref='dataUrodzenia' type='text' name='dataUrodzenia' v-model.trim="pacjent.dataUrodzenia" :required='ustawieniaPacjenta.obowiazkoweDataUrodzeniaSamodzielnie' placeholder='RRRR-MM-DD'></sm-input>

                <label class='nowrap' for='formPacjentNadrzedny-miejsceUrodzenia'>Miejsce urodzenia</label>
                <sm-input id='formPacjentNadrzedny-miejsceUrodzenia' ref='miejsceUrodzenia' type='text' name='miejsceUrodzenia' v-model.trim="pacjent.miejsceUrodzenia" :required='ustawieniaPacjenta.obowiazkoweMiejceUrodzeniaSamodzielnie'></sm-input>

                <label for='formPacjentNadrzedny-telefonKontaktowy'>Telefon</label>
                <sm-input id='formPacjentNadrzedny-telefonKontaktowy' ref='telefonKontaktowy' type='text' name='telefonKontaktowy' v-model.trim="pacjent.telefonKontaktowy" :required='ustawieniaPacjenta.obowiazkoweTelefonSamodzielnie'></sm-input>

                <label for='formPacjentNadrzedny-email'>E-mail</label>
                <sm-input id='formPacjentNadrzedny-email' ref='email' type='text' name='email' v-model.trim="pacjent.email" :required='ustawieniaPacjenta.obowiazkoweEmailSamodzielnie'></sm-input>

                <label for='formPacjentNadrzedny-miejscowosc'>Miejscowość</label>
                <sm-input id='formPacjentNadrzedny-miejscowosc' ref='miejscowosc' type='text' name='miejscowosc' v-model.trim="pacjent.miejscowosc" :required='ustawieniaPacjenta.obowiazkoweDaneAdresoweSamodzielnie'></sm-input>

                <label for='formPacjentNadrzedny-kodPocztowy'>Kod pocztowy</label>
                <sm-input id='formPacjentNadrzedny-kodPocztowy' ref='kodPocztowy' type='text' name='kodPocztowy' v-model.trim="pacjent.kodPocztowy" :required='ustawieniaPacjenta.obowiazkoweDaneAdresoweSamodzielnie' placeholder="00-000"></sm-input>

                <label for='formPacjentNadrzedny-ulica'>Ulica</label>
                <sm-input id='formPacjentNadrzedny-ulica' ref='ulica' type='text' name='ulica' v-model.trim="pacjent.ulica" :required='ustawieniaPacjenta.obowiazkoweDaneAdresoweSamodzielnie'></sm-input>

                <label for='formPacjentNadrzedny-nrDomu'>Nr domu</label>
                <sm-input id='formPacjentNadrzedny-nrDomu' ref='nrDomu' type='text' name='nrDomu' v-model.trim="pacjent.nrDomu" :required='ustawieniaPacjenta.obowiazkoweDaneAdresoweSamodzielnie'></sm-input>

                <label for='formPacjentNadrzedny-nrLokalu'>Nr lokalu</label>
                <sm-input id='formPacjentNadrzedny-nrLokalu' ref='nrLokalu' type='text' name='nrLokalu' v-model.trim="pacjent.nrLokalu"></sm-input>
            </div>

            <div class='buttons-panel'>
                <sm-button class='margin-top-2x margin-right green-button' label="Zapisz" @on-click='onSubmit'></sm-button>
                <sm-button class='margin-top-2x' label="Anuluj" @on-click='onCancel'></sm-button>
            </div>
        </form>
    </div>
    `
})