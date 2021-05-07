Vue.component('view-konfiguracja-sms', {
    data: function () {
        return {
            konfiguracjaSms: {},
        }
    },
    mounted() {
        this.load();
    },
    methods: {
        load() {
            this.$nextTick(function() {
                app.showLoadingToast();
                fetch("/euslugi-zarzadzanie-server/serwis/konfiguracja-serwera-sms")
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
                            this.konfiguracjaSms = json.dane.konfiguracjaSerweraSms[0];
                        }
                    });
            });
        },
        _refresh() {
            this.load();
        },
        _save() {
            fetch("/euslugi-zarzadzanie-server/serwis/konfiguracja-serwera-sms", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(this.konfiguracjaSms)
            })
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        app.toast("Dane konfiguracyjne sms zostały zapisane");
                    }
                    this._refresh();
                });
        },
        focus() {
            this.$nextTick(() => this.$refs.smsApiLogin.focus());
            return this;
        }
    },
    template: `
    <div class='view-konfiguracja-sms'>
        <div class='view-header'>Konfiguracja bramek SMS</div>
        <form>
            <input type="hidden" name='id' v-model.number="konfiguracjaSms.id"></input>
            <div class='grid'>

                <div class='sms-logo-container'>
                    <a href='https://www.smsapi.pl/' target='_blank'>
                        <img  class='sms-logo' src="/images/smsapi.logo.png">
                    </a>
                </div>
                <label class='label' for='viewKonfiguracjaSms-smsApiLogin'>Login</label>
                <input id='viewKonfiguracjaSms-smsApiLogin' ref='smsApiLogin' type='text' name='smsApiLogin' v-model.trim="konfiguracjaSms.smsApiLogin"></input>


                <label class='label' for='viewKonfiguracjaSms-smsApiPassword'>Hasło</label>
                <input id='viewKonfiguracjaSms-smsApiPassword' ref='smsApiPassword' type='password' name='smsApiPassword' v-model.trim="konfiguracjaSms.smsApiPassword"></input>

                <div class='separator'></div>

                <div class='sms-logo-container'>
                    <a href='https://serwersms.pl/' target='_blank'>
                        <img  class='sms-logo' src="/images/serwersms.logo.png">
                    </a>
                </div>
                <label class='label' for='viewKonfiguracjaSms-serwerSmsLogin'>Login</label>
                <input id='viewKonfiguracjaSms-serwerSmsLogin' ref='serwerSmsLogin' type='text' name='serwerSmsLogin' v-model.trim="konfiguracjaSms.serwerSmsLogin"></input>

                <label class='label' for='viewKonfiguracjaSms-serwerSmsPassword'>Hasło</label>
                <input id='viewKonfiguracjaSms-serwerSmsPassword' ref='serwerSmsPassword' type='password' name='serwerSmsPassword' v-model.trim="konfiguracjaSms.serwerSmsPassword"></input>
            </div>
            <div class='buttons-panel'>
                <sm-button class='margin-top-2x' label="Przywróć" @on-click='_refresh'></sm-button>
                <sm-button class='margin-top-2x margin-left green-button' label="Zapisz" @on-click='_save'></sm-button>
            </div>
        </form>
    </div>
    `
})