Vue.component('form-reset-hasla', {
    props: {
        label: {
            default: "Resetowanie hasła"
        },
        placeholder: {
            default: 'Nowe hasło'
        }
    },
    data() {
        return {
            noweHaslo: {},
        };
    },
    mounted() {
    },
    methods: {
        clear() {
            this.setValid();
            this.noweHaslo = {};
            return this;
        },
        focus() {
            this.$nextTick(() => this.$refs.haslo.focus());
            return this;
        },
        generujNoweHaslo() {
            let getNoweHaslo = fetch(
                "/sm-portal-server/uzytkownicy/zmiana-hasla/generator-hasla")
                .then(res => app.handleErrors(res))
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                       this.noweHaslo = json.dane;
                    }
                });
        },
        onSubmit() {
            let self = this;
            self.setValid();
            fetch(
                "/sm-portal-server/uzytkownicy/zmiana-hasla/parse/", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify(self.noweHaslo)
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
                        let hasloDoZapisu = self.noweHaslo;
                        self.$emit('on-submit', hasloDoZapisu);
                    }
                });
        },
        setValid() {
            let self = this;
            Object.keys(self.$refs).forEach(function(key) {
                self.$refs[key].message = null;
            });
        },
        onCancel() {
            // this.$refs.autocomplete.clear();
            this.$emit('on-cancel');
        }
    },
    template: `
    <div class='form-reset-hasla'>
        <form>
            <div class='grid'>
                <label class='margin-top-1x' for='formResetHasla-haslo'>Nowe hasło</label>
                <sm-input id="formResetHasla-haslo" ref='haslo' type='text' name='haslo' v-model.trim="noweHaslo.haslo" required></sm-input>            
            </div>
            <div class='buttons-panel'>
                <sm-button class='margin-top-2x' label="Generuj nowe hasło" @on-click='generujNoweHaslo'></sm-button>
                <sm-button class='margin-top-2x margin-left-3x green-button' label='Zapisz' @on-click='onSubmit'></sm-button>
                <sm-button class='margin-top-2x margin-left' label="Anuluj" @on-click='onCancel'></sm-button>
            </div>
        </form>
    </div>
    `
})