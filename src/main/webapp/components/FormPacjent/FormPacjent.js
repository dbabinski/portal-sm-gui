Vue.component('form-pacjent', {
    data() {
        return {
            pacjent: {
                dataUrodzenia: null,
                plec: "mężczyzna"
            },
            plci: ["kobieta", "mężczyzna"],
            typyDokumentow: [],
            ustawieniaPacjenta: {}
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
        load() {
            let loadUstawieniaPacjenta = fetch(
                "/euslugi-zarzadzanie-server/serwis/ustawienia-pacjenta/")
                .then(res => app.handleErrors(res))
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                       this.ustawieniaPacjenta = json.dane.ustawieniaPacjenta;
                       this.polaWymagane = this.ustawieniaPacjenta.polaWymagane;
                    }
                });
            let loadTypyDokumentow = fetch("/euslugi-zarzadzanie-server/slowniki/typy-dokumentow/")
                .then(res => app.handleErrors(res))
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        this.typyDokumentow = [{}].concat(json.dane.typyDokumentow);
                    }
                });
            return this;
        },
        onSubmit() {
            let self = this;
            self.setValid(); 
            self.pacjent.samodzielnie = false;                       
            fetch(
                "/euslugi-zarzadzanie-server/pacjenci/parse/", {
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
            let pesel = self.pacjent.pesel;
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
                self.$refs[key].message = null;
            });            
        },
        focus() {
            this.$nextTick(() => this.$refs.nazwisko.focus());
            return this;
        }
    },
    template: `
    <div class='form-pacjent'>
        <form>
            <input type="hidden" name='id' v-model.number="pacjent.id"></input>
            <div class='grid'>                
                <label for='formPacjent-nazwisko'>Nazwisko</label>
                <sm-input id='formPacjent-nazwisko' ref='nazwisko' type='text' name='nazwisko' v-model.trim="pacjent.nazwisko" required></sm-input >
            
                <label for='formPacjent-imie'>Imię</label>
                <sm-input id='formPacjent-imie' ref='imie' type='text' name='imie' v-model.trim="pacjent.imie" required></sm-input >
            
                <label for='formPacjent-pesel'>PESEL</label>
                <sm-input id='formPacjent-pesel' ref='pesel' type='text' name='pesel' v-model.trim="pacjent.pesel" required  @blur="onBlurPesel"></sm-input >
            
                <label for='formPacjent-typDokumentuTozsamosci'>Typ dokumentu tożsamości</label>
                <div class="select-wrap">
                    <select id='formPacjent-typDokumentuTozsamosci' ref="select" v-model="pacjent.idTypDokumentuTozsamosci" name="typDokumentuTozsamosci">
                        <option v-for='typDokumentu in typyDokumentow' :key='typDokumentu.id' :value='typDokumentu.id'>{{typDokumentu.nazwaDokumentuTozsamosci}}</option>
                    </select>
                </div>                
            
                <label for='formPacjent-numerDokumentuTozsamosci'>Nr dokumentu tożsamości</label>
                <sm-input id='formPacjent-numerDokumentuTozsamosci' ref='numerDokumentuTozsamosci' type='text' name='numerDokumentuTozsamosci' v-model.trim="pacjent.numerDokumentuTozsamosci" :placeholder='formatNumeracjiOpis'></sm-input >
            
                <label for='formPacjentSamodzielnie-plec'>Płeć</label>
                <div>
                    <div class="select-wrap">
                        <select class='select' id='formPacjent-plec' ref="select" v-model="pacjent.plec" name="plec" required>
                            <option v-for='plec in plci' :key='plec' :value='plec'>{{plec}}</option>
                        </select>
                    </div>
                    <sm-input-warning ref="plec"></sm-input-warning>
                </div>
            
                <label class='nowrap' for='formPacjent-dataUrodzenia'>Data urodzenia</label>
                <sm-input id='formPacjent-dataUrodzenia' ref='dataUrodzenia' type='text' name='dataUrodzenia' v-model.trim="pacjent.dataUrodzenia" :required='ustawieniaPacjenta.obowiazkoweDataUrodzenia' placeholder='RRRR-MM-DD'></sm-input >
            
                <label class='nowrap' for='formPacjent-miejsceUrodzenia'>Miejsce urodzenia</label>
                <sm-input id='formPacjent-miejsceUrodzenia' ref='miejsceUrodzenia' type='text' name='miejsceUrodzenia' v-model.trim="pacjent.miejsceUrodzenia" :required='ustawieniaPacjenta.obowiazkoweMiejceUrodzenia'></sm-input >
            
                <label for='formPacjent-telefonKontaktowy'>Telefon</label>
                <sm-input id='formPacjent-telefonKontaktowy' ref='telefonKontaktowy' type='text' name='telefonKontaktowy' v-model.trim="pacjent.telefonKontaktowy" :required='ustawieniaPacjenta.obowiazkoweTelefon'></sm-input >
            
                <label for='formPacjent-email'>E-mail</label>
                <sm-input id='formPacjent-email' ref='email' type='text' name='email' v-model.trim="pacjent.email" :required='ustawieniaPacjenta.obowiazkoweEmail'></sm-input >
            
                <label for='formPacjent-miejscowosc'>Miejscowość</label>
                <sm-input id='formPacjent-miejscowosc' ref='miejscowosc' type='text' name='miejscowosc' v-model.trim="pacjent.miejscowosc" :required='ustawieniaPacjenta.obowiazkoweDaneAdresowe'></sm-input >
            
                <label for='formPacjent-kodPocztowy'>Kod pocztowy</label>
                <sm-input id='formPacjent-kodPocztowy' ref='kodPocztowy' type='text' name='kodPocztowy' v-model.trim="pacjent.kodPocztowy" :required='ustawieniaPacjenta.obowiazkoweDaneAdresowe' placeholder="00-000"></sm-input >
            
                <label for='formPacjent-ulica'>Ulica</label>
                <sm-input id='formPacjent-ulica' ref='ulica' type='text' name='ulica' v-model.trim="pacjent.ulica" :required='ustawieniaPacjenta.obowiazkoweDaneAdresowe'></sm-input >
            
                <label for='formPacjent-nrDomu'>Nr domu</label>
                <sm-input id='formPacjent-nrDomu' ref='nrDomu' type='text' name='nrDomu' v-model.trim="pacjent.nrDomu" :required='ustawieniaPacjenta.obowiazkoweDaneAdresowe'></sm-input >
            
                <label for='formPacjent-nrLokalu'>Nr lokalu</label>
                <sm-input id='formPacjent-nrLokalu' ref='nrLokalu' type='text' name='nrLokalu' v-model.trim="pacjent.nrLokalu"></sm-input >
            </div>            
            <div class='buttons-panel'>
                <sm-button class='margin-top-2x margin-right green-button' label="Zapisz" @on-click='onSubmit'></sm-button>
                <sm-button class='margin-top-2x' label="Anuluj" @on-click='onCancel'></sm-button>
            </div>
        </form>
    </div>
    `
})