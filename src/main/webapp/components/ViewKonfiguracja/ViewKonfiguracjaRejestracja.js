Vue.component('view-konfiguracja-rejestracja', {
    data: function () {
        return {
            konfiguracjaRejestracja: {}
        }
    },
    mounted() {
        this.load();
    },
    methods: {
        load() {
            this.$nextTick(function() {
                app.showLoadingToast();
                fetch("/euslugi-terminarz-server/ustawienia/konfiguracja")
                    .then(res => {
                        app.hideLoadingToast();
                        return app.handleErrors(res);
                    })
                    .then(res => res.json())
                    .then(json => {
                        if (json.blad === true) {
                            app.getMessageDialog()
                                .setMessage(json.komunikat)
                                .show();
                        } else {
                            this.konfiguracjaRejestracja = json.dane;
                        }
                    });
            });
        },
        _refresh() {
            this.load();
        },       
        _parse() {
            let self = this;
            fetch(
                "/euslugi-terminarz-server/ustawienia/konfiguracja/parse", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify(self.konfiguracjaRejestracja)
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
                        self._saveItem();                        
                    }
                });
        },
        _saveItem() {              
            fetch("/euslugi-terminarz-server/ustawienia/konfiguracja", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(this.konfiguracjaRejestracja)
            })
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        app.toast("Dane konfiguracyjne e-Rejestracji zostały zapisane");
                    }
                    this._refresh();
                });            
        },
        focus() {
            this.$nextTick(() => this.$refs.nazwaTerminarza.focus());
            return this;
        }
    },
    template: `
    <div class='view-konfiguracja-rejestracja'>
        <div class='view-header'>Konfiguracja e-Rejestracja</div>
        <form>
            <input type="hidden" name='id' v-model.number="konfiguracjaRejestracja.id"></input>
            <div class='grid'>
                <label class='label nowrap' for='viewKonfiguracjaRejestracja-nazwaTerminarza'>Nazwa terminarza</label>
                <sm-input id='viewKonfiguracjaRejestracja-nazwaTerminarza' ref='nazwaTerminarza' type='text' name='nazwaTerminarza' v-model.trim="konfiguracjaRejestracja.nazwaTerminarza" required></sm-input>

                <label class='label nowrap' for='viewKonfiguracjaRejestracja-szablonPotwierdzeniaRejestracjiSms'>Szablon treści SMS<br/>potwierdzenia rejestracji</label>
                <div>
                    <textarea id='viewKonfiguracjaRejestracja-szablonPotwierdzeniaRejestracjiSms' type='text' name='szablonPotwierdzeniaRejestracjiSms' v-model.trim="konfiguracjaRejestracja.szablonPotwierdzeniaRejestracjiSms" required></textarea>
                    <sm-input-warning ref="szablonPotwierdzeniaRejestracjiSms"></sm-input-warning>
                </div>

                <label class='label nowrap' for='viewKonfiguracjaRejestracja-szablonTematuPotwierdzeniaRejestracjiEmail'>Szablon tematu e-mail<br/>potwierdzenia rejestracji</label>
                <sm-input id='viewKonfiguracjaRejestracja-szablonTematuPotwierdzeniaRejestracjiEmail' ref='szablonTematuPotwierdzeniaRejestracjiEmail' type='text' name='szablonTematuPotwierdzeniaRejestracjiEmail' v-model.trim="konfiguracjaRejestracja.szablonTematuPotwierdzeniaRejestracjiEmail" required></sm-input>
                <label class='label nowrap' for='viewKonfiguracjaRejestracja-szablonPotwierdzeniaRejestracjiEmail'>Szablon treści e-mail<br/>potwierdzenia rejestracji</label>
                <div>
                    <textarea id='viewKonfiguracjaRejestracja-szablonPotwierdzeniaRejestracjiEmail' type='text' name='szablonPotwierdzeniaRejestracjiEmail' v-model.trim="konfiguracjaRejestracja.szablonPotwierdzeniaRejestracjiEmail" required></textarea>
                    <sm-input-warning ref="szablonPotwierdzeniaRejestracjiEmail"></sm-input-warning>
                </div>

                <label class='label nowrap' for='viewKonfiguracjaRejestracja-szablonTematuPrzypomnieniaEmail'>Szablon tematu e-mail<br/>przypomnienia o wizycie</label>
                <sm-input id='viewKonfiguracjaRejestracja-szablonTematuPrzypomnieniaEmail' ref='szablonTematuPrzypomnieniaEmail' type='text' name='szablonTematuPrzypomnieniaEmail' v-model.trim="konfiguracjaRejestracja.szablonTematuPrzypomnieniaEmail" required></sm-input>
                <label class='label nowrap' for='viewKonfiguracjaRejestracja-szablonPrzypomnieniaEmail'>Szablon treści e-mail<br/>przypomnienia o wizycie</label>
                <div>
                    <textarea id='viewKonfiguracjaRejestracja-szablonPrzypomnieniaEmail' type='text' name='szablonPrzypomnieniaEmail' v-model.trim="konfiguracjaRejestracja.szablonPrzypomnieniaEmail" required></textarea>
                    <sm-input-warning ref="szablonPrzypomnieniaEmail"></sm-input-warning>
                </div>

                <label class='label nowrap' for='viewKonfiguracjaRejestracja-szablonTematuPotwierdzeniaRezygnacjiEmail'>Szablon tematu e-mail<br/>potwierdzenia rezygnacji z wizyty</label>
                <sm-input id='viewKonfiguracjaRejestracja-szablonTematuPotwierdzeniaRezygnacjiEmail' ref='szablonTematuPotwierdzeniaRezygnacjiEmail' type='text' name='szablonTematuPotwierdzeniaRezygnacjiEmail' v-model.trim="konfiguracjaRejestracja.szablonTematuPotwierdzeniaRezygnacjiEmail" required></sm-input>
                <label class='label nowrap' for='viewKonfiguracjaRejestracja-szablonPotwierdzeniaRezygnacjiEmail'>Szablon treści e-mail<br/>potwierdzenia rezygnacji z wizyty</label>
                <div>
                    <textarea id='viewKonfiguracjaRejestracja-szablonPotwierdzeniaRezygnacjiEmail' type='text' name='szablonPotwierdzeniaRezygnacjiEmail' v-model.trim="konfiguracjaRejestracja.szablonPotwierdzeniaRezygnacjiEmail" required></textarea>
                    <sm-input-warning ref="szablonPotwierdzeniaRezygnacjiEmail"></sm-input-warning>
                </div>

                <div class='checkbox-container'>
                    <input id="viewKonfiguracjaRejestracja-potwierdzenieSmsRejestracjiZalogowanego" ref="potwierdzenieSmsRejestracjiZalogowanego" type="checkbox" name="potwierdzenieSmsRejestracjiZalogowanego" v-model="konfiguracjaRejestracja.potwierdzenieSmsRejestracjiZalogowanego">
                    <label class='label' for='viewKonfiguracjaRejestracja-potwierdzenieSmsRejestracjiZalogowanego'>Potwierdzenie rejestracji kodem SMS dla zalogowanych użytkowników</label>
                </div>
                <div class='checkbox-container'>
                    <input id="viewKonfiguracjaRejestracja-rejestracjaDlaNiezalogowanych" ref="'rejestracjaDlaNiezalogowanych" type="checkbox" name="rejestracjaDlaNiezalogowanych" v-model="konfiguracjaRejestracja.rejestracjaDlaNiezalogowanych">
                    <label class='label' for='viewKonfiguracjaRejestracja-rejestracjaDlaNiezalogowanych'>Rejestracja dostępna dla użytkowników niezalogowanych</label>
                </div>
                <div class='checkbox-container'>
                    <input id="viewKonfiguracjaRejestracja-uwagiPacjenta" ref="'uwagiPacjenta" type="checkbox" name="uwagiPacjenta" v-model="konfiguracjaRejestracja.uwagiPacjenta">
                    <label class='label' for='viewKonfiguracjaRejestracja-uwagiPacjenta'>Uwagi pacjenta</label>
                </div>
                <div class='checkbox-container'>
                    <input id="viewKonfiguracjaRejestracja-wysylajPrzypomnienia" ref="wysylajPrzypomnienia" type="checkbox" name="wysylajPrzypomnienia" v-model="konfiguracjaRejestracja.wysylajPrzypomnienia">
                    <label class='label' for='viewKonfiguracjaRejestracja-wysylajPrzypomnienia'>Wysyłanie przypomnień</label>
                </div>
            </div>
            <div class='buttons-panel'>
                <sm-button class='' label="Przywróć" @on-click='_refresh'></sm-button>
                <sm-button class='margin-left green-button' label="Zapisz" @on-click='_parse'></sm-button>
            </div>
        </form>
    </div>
    `
})