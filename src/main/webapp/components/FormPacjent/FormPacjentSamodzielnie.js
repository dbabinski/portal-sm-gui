Vue.component('form-pacjent-samodzielnie', {
    data() {
        return {
            pacjent: {
                dataUrodzenia: null,
                plec: "mężczyzna"
            },
            plci: ["kobieta", "mężczyzna"],
            ustawieniaPacjenta: {},
            polaWymagane: ["imie", "nazwisko", "pesel"],
            nadrzedne: true,
            recaptchaWidget: null
        };
    },
    computed: {
        formatNumeracjiOpis() {
            let self = this;
            if (self.pacjent !== null) {
                let item = self.typyDokumentow.find(item => item.id==self.pacjent.idTypDokumentuTozsamosci);
                if(item != undefined) {
                    return item.formatNumeracjiOpis;
                }
            }
            return null;
        }
    },
    methods: {
        async _renderRecaptcha() {
            await utils.waitUntil(() => app.recaptchaReady == true)
                .then(() => {
                    fetch("/euslugi-zarzadzanie-server/serwis/konfiguracja/recaptchaSiteKey")
                        .then(res => app.handleErrors(res))
                        .then(res => res.json())
                        .then(json => {
                            if (json.blad === true) {
                                app.getMessageDialog()
                                    .setMessage(json.komunikat)
                                    .show();
                            } else {
                                let recaptchaSiteKey = json.dane.recaptchaSiteKey;
                                if(!utils.isNull(recaptchaSiteKey)) {
                                    try{
                                        console.log('grecaptcha.render');
                                        grecaptcha.render("formPacjentSamodzielnie-recaptcha", {
                                            sitekey: recaptchaSiteKey
                                        });
                                    } catch(error) {
                                        console.log('grecaptcha.reset');
                                        grecaptcha.reset();
                                    }
                                }
                            }
                        });
                });
        },
        load() {
            this._renderRecaptcha();
            let loadUstawieniaPacjenta = fetch("/euslugi-zarzadzanie-server/serwis/ustawienia-pacjenta")
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
            let loadRegulamin = fetch("/euslugi-zarzadzanie-server/portal/regulamin")
                .then(res => app.handleErrors(res))
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        let regulamin = json.dane.regulamin;
                        if(!utils.isNull(regulamin)) {
                            this.$refs.regulaminFrame.src="javascript:'" + regulamin.tresc + "'";
                        }
                    }
                });
            return this;
        },
        onSubmit() {
            let self = this;
            self.setValid();
            if (this.nadrzedne) {
                if(utils.isNull(self.pacjent.hasloPonownie)) {
                    self.$refs['hasloPonownie'].message = "nie wprowadzono hasła";
                    return;
                }
                if(self.pacjent.haslo != self.pacjent.hasloPonownie) {
                    self.$refs['hasloPonownie'].message = "hasła nie są identyczne";2
                    return;
                }
                self.pacjent.samodzielnie = true;
                self.pacjent.reCaptchaToken = grecaptcha.getResponse();
            }
            fetch("/euslugi-zarzadzanie-server/pacjenci/parse/", {
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
        },
        _showRegulations() {
            this.$refs.dialogRegulamin.show();
        }
    },
    template: `
    <div class='form-pacjent-samodzielnie'>
        <form>
            <input type="hidden" name='id' v-model.number="pacjent.id"></input>
            <div class='grid'>
                <label for='formPacjentSamodzielnie-nazwisko'>Nazwisko</label>
                <sm-input id='formPacjentSamodzielnie-nazwisko' ref='nazwisko' type='text' name='nazwisko' v-model.trim="pacjent.nazwisko" required></sm-input>

                <label for='formPacjentSamodzielnie-imie'>Imię</label>
                <sm-input  id='formPacjentSamodzielnie-imie' ref='imie' type='text' name='imie' v-model.trim="pacjent.imie" required></sm-input>

                <label for='formPacjentSamodzielnie-pesel'>PESEL</label>
                <sm-input id='formPacjentSamodzielnie-pesel' ref='pesel' type='text' name='pesel' required v-model.trim="pacjent.pesel" @blur="onBlurPesel"></sm-input>

                <label for='formPacjentSamodzielnie-plec'>Płeć</label>
                <div>
                    <div class="select-wrap">
                        <select class='select' id='formPacjentSamodzielnie-plec' ref="select" v-model="pacjent.plec" name="plec" required>
                            <option v-for='plec in plci' :key='plec' :value='plec'>{{plec}}</option>
                        </select>
                    </div>
                    <sm-input-warning ref="plec"></sm-input-warning>
                </div>

                <label class='nowrap' for='formPacjentSamodzielnie-dataUrodzenia'>Data urodzenia</label>
                <sm-input id='formPacjentSamodzielnie-dataUrodzenia' ref='dataUrodzenia' type='text' name='dataUrodzenia' v-model.trim="pacjent.dataUrodzenia" :required='ustawieniaPacjenta.obowiazkoweDataUrodzeniaSamodzielnie' placeholder='RRRR-MM-DD'></sm-input>

                <label class='nowrap' for='formPacjentSamodzielnie-miejsceUrodzenia'>Miejsce urodzenia</label>
                <sm-input id='formPacjentSamodzielnie-miejsceUrodzenia' ref='miejsceUrodzenia' type='text' name='miejsceUrodzenia' v-model.trim="pacjent.miejsceUrodzenia" :required='ustawieniaPacjenta.obowiazkoweMiejceUrodzeniaSamodzielnie'></sm-input>

                <label for='formPacjentSamodzielnie-telefonKontaktowy'>Telefon</label>
                <sm-input id='formPacjentSamodzielnie-telefonKontaktowy' ref='telefonKontaktowy' type='text' name='telefonKontaktowy' v-model.trim="pacjent.telefonKontaktowy" :required='ustawieniaPacjenta.obowiazkoweTelefonSamodzielnie'></sm-input>

                <label for='formPacjentSamodzielnie-email'>E-mail</label>
                <sm-input id='formPacjentSamodzielnie-email' ref='email' type='text' name='email' v-model.trim="pacjent.email" :required='ustawieniaPacjenta.obowiazkoweEmailSamodzielnie'></sm-input>

                <label for='formPacjentSamodzielnie-miejscowosc'>Miejscowość</label>
                <sm-input id='formPacjentSamodzielnie-miejscowosc' ref='miejscowosc' type='text' name='miejscowosc' v-model.trim="pacjent.miejscowosc" :required='ustawieniaPacjenta.obowiazkoweDaneAdresoweSamodzielnie'></sm-input>

                <label for='formPacjentSamodzielnie-kodPocztowy'>Kod pocztowy</label>
                <sm-input id='formPacjentSamodzielnie-kodPocztowy' ref='kodPocztowy' type='text' name='kodPocztowy' v-model.trim="pacjent.kodPocztowy" :required='ustawieniaPacjenta.obowiazkoweDaneAdresoweSamodzielnie' placeholder="00-000"></sm-input>

                <label for='formPacjentSamodzielnie-ulica'>Ulica</label>
                <sm-input id='formPacjentSamodzielnie-ulica' ref='ulica' type='text' name='ulica' v-model.trim="pacjent.ulica" :required='ustawieniaPacjenta.obowiazkoweDaneAdresoweSamodzielnie'></sm-input>

                <label for='formPacjentSamodzielnie-nrDomu'>Nr domu</label>
                <sm-input id='formPacjentSamodzielnie-nrDomu' ref='nrDomu' type='text' name='nrDomu' v-model.trim="pacjent.nrDomu" :required='ustawieniaPacjenta.obowiazkoweDaneAdresoweSamodzielnie'></sm-input>

                <label for='formPacjentSamodzielnie-nrLokalu'>Nr lokalu</label>
                <sm-input id='formPacjentSamodzielnie-nrLokalu' ref='nrLokalu' type='text' name='nrLokalu' v-model.trim="pacjent.nrLokalu"></sm-input>

                <label v-if="nadrzedne" for='formPacjentSamodzielnie-login'>Login</label>
                <sm-input v-if="nadrzedne" id='formPacjentSamodzielnie-login' ref='login' type='text' name='login' v-model.trim="pacjent.login"></sm-input>

                <label v-if="nadrzedne" for='formPacjentSamodzielnie-haslo'>Hasło</label>
                <sm-input v-if="nadrzedne" id='formPacjentSamodzielnie-hasło' ref='haslo' type='password' name='haslo' v-model.trim="pacjent.haslo" required></sm-input>

                <label v-if="nadrzedne" class='nowrap' for='formPacjentSamodzielnie-hasloPonownie'>Hasło (ponownie)</label>
                <sm-input v-if="nadrzedne" id='formPacjentSamodzielnie-hasłoPonownie' ref='hasloPonownie' type='password' v-model.trim="pacjent.hasloPonownie" required></sm-input>

                <div v-if="nadrzedne"></div>
                <div v-if="nadrzedne">
                    <input class='inline' id="formPacjentSamodzielnie-regulamin" ref="regulaminInput" type="checkbox" name="regulamin" v-model="pacjent.regulamin">
                    <div class='inline'>Zapoznałem/am się i akceptuję <span class='a' @click='_showRegulations'>regulamin</span> usługi</div>
                    <sm-input-warning ref='regulamin'></sm-input-warning>
                </div>

                <div v-if="nadrzedne"></div>
                <div v-if="nadrzedne">
                    <div id='formPacjentSamodzielnie-recaptcha' class='g-recaptcha'></div>
                    <sm-input-warning ref='recaptcha'></sm-input-warning>
                </div>
            </div>

            <div class='buttons-panel'>
                <sm-button class='margin-top-2x margin-right green-button' label="Zapisz" @on-click='onSubmit'></sm-button>
                <sm-button class='margin-top-2x' label="Anuluj" @on-click='onCancel'></sm-button>
            </div>
        </form>

        <sm-modal-dialog class='dialog-regulamin' ref='dialogRegulamin' focusedButton='ok' okLabel='Zamknij' :showCancel='false'>
            <iframe class='frame-regulamin' ref='regulaminFrame'></iframe>
        </sm-modal-dialog>
    </div>
    `
})