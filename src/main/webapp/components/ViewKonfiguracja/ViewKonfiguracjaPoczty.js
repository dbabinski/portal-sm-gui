Vue.component('view-konfiguracja-poczty', {
    data: function () {
        return {
            konfiguracjaPoczty: {},
            ssls: ["Tak", "Nie"],
            polaWymagane: ["uzytkownik", "email", "haslo", "adresSerwera", "port", "ssl"],
        }
    },
    mounted() {
        this.load();
    },
    methods: {
        load() {
            this.$nextTick(function() {
                app.showLoadingToast();
                fetch("/sm-portal-server/serwis/konfiguracja-serwera-poczty")
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
                            this.konfiguracjaPoczty = json.dane.konfiguracjaSerweraPoczty[0];
                            if (this.konfiguracjaPoczty.ssl == true){
                                this.konfiguracjaPoczty.ssl_text = "Tak";
                            } else {
                                this.konfiguracjaPoczty.ssl_text = "Nie";
                            }
                        }
                    });
            });
        },
        _refresh() {
            this.load();
        },
        _save() {
            if(this.konfiguracjaPoczty.ssl_text == "Tak"){
                this.konfiguracjaPoczty.ssl = true;
            } else {
                this.konfiguracjaPoczty.ssl = false;
            }
            fetch("/sm-portal-server/serwis/konfiguracja-serwera-poczty", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(this.konfiguracjaPoczty)
            })
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        app.toast("Dane konfiguracyjne poczty zostały zapisane");
                    }
                    this._refresh();
                });
        },
        focus() {
            this.$nextTick(() => this.$refs.uzytkownik.focus());
            return this;
        }
    },
    template: `
    <div class='view-konfiguracja-poczty'>
        <div class='view-header'>Konfiguracja serwera pocztowego</div>
        <form>
            <input type="hidden" name='id' v-model.number="konfiguracjaPoczty.id"></input>
            <div class='grid'>
                <label class='label nowrap' for='viewKonfiguracjaPoczty-uzytkownik'>Użytkownik</label>
                <input id='viewKonfiguracjaPoczty-uzytkownik' ref='uzytkownik' type='text' name='uzytkownik' v-model.trim="konfiguracjaPoczty.uzytkownik" required></input>

                <label class='label nowrap' for='viewKonfiguracjaPoczty-email'>Adres e-mail</label>
                <input id='viewKonfiguracjaPoczty-email' ref='email' type='email' name='email' v-model.trim="konfiguracjaPoczty.email" required></input>

                <label class='label nowrap' for='viewKonfiguracjaPoczty-haslo'>Hasło</label>
                <input id='viewKonfiguracjaPoczty-haslo' ref='haslo' type='password' name='haslo' v-model.trim="konfiguracjaPoczty.hasloSerweraPoczty" required></input>

                <label class='label nowrap' for='viewKonfiguracjaPoczty-adresSerwera'>Adres serwera</label>
                <input id='viewKonfiguracjaPoczty-adresSerwera' ref='adresSerwera' type='text' name='adresSerwera' v-model.trim="konfiguracjaPoczty.adresSerweraPoczty" required></input>

                <label class='label nowrap' for='viewKonfiguracjaPoczty-port'>Port</label>
                <input id='viewKonfiguracjaPoczty-port' ref='port' type='text' name='port' v-model.trim="konfiguracjaPoczty.portSerweraPoczty" required></input>

                <label class='label nowrap' for='viewKonfiguracjaPoczty-ssl'>SSL</label>
                <div class="select-wrap">
                    <select  id='viewKonfiguracjaPoczty-ssl' ref="select" v-model="konfiguracjaPoczty.ssl_text" name="ssl" required>
                        <option v-for='ssl in ssls' :key='ssl' :value='ssl'>{{ssl}}</option>
                    </select>
                </div>
            
                <label class='label nowrap' for='viewKonfiguracjaPoczty-nadawca'>Nadawca</label>
                <input id='viewKonfiguracjaPoczty-nadawca' ref='nadawca' type='text' name='nadawca' v-model.trim="konfiguracjaPoczty.nadawca"></input>
            </div>
            <div class='buttons-panel'>
                <sm-button class='margin-top-2x' label="Przywróć" @on-click='_refresh'></sm-button>
                <sm-button class='margin-top-2x margin-left green-button' label="Zapisz" @on-click='_save'></sm-button>
            </div>
        </form>
    </div>
    `
})