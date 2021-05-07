Vue.component('dialog-password-reset-email', {
    props: {
        placeholder: {
            default: 'Adres e-mail'
        }
    },
    data() {
        return {
            resetHasla: {
                email: null
            },
            emailReadOnly: false
        };
    },
    methods: {
        clear() {
            this.setValid();
            this.resetHasla = {
                email: null
            };
            return this;
        },
        show(label = "Nie pamiętasz hasła?") {
            this.$refs.dialog.label = label;
            this.$refs.dialog.show();
            this.focus();
        },
        hide() {
            this.$refs.dialog.hide();
        },
        focus() {
            this.$nextTick(() => this.$refs.email.focus());
            return this;
        },
        onSubmit() {
            let self = this;
            self.setValid();
            fetch(
                "/euslugi-zarzadzanie-server/uzytkownicy/zmiana-hasla/parse-mail", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify(self.resetHasla)
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
                        let daneDoWysylki = self.resetHasla;
                        self._submit(daneDoWysylki);
                        self.$emit('on-submit', daneDoWysylki);
                    }
                });
        },
        _submit(object) {
            app.showLoadingToast("Wysyłanie e-mail");
            this.clear();
            this.$refs.dialog.hide();
            fetch("/euslugi-zarzadzanie-server/uzytkownicy/zmiana-hasla/nie-pamietam", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(object)
            })
                .then(res => res.json())
                .then(json => {
                    app.hideLoadingToast();
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        app.toast("E-mail z linkiem umożliwiającym zmianę hasła został wysłany");
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
            this.clear();
            this.hide();
            this.$emit('on-cancel');
        }
    },
    template: `
    <div class='dialog-password-reset-email'>
        <sm-form-dialog ref='dialog'>
            <form>
                <div class='grid'>
                    <label class='margin-top-1x nowrap' for='formResetHasla-haslo'>Adres e-mail</label>
                    <sm-input id="formNiepamietaszHasla-email" ref='email' type='email' name='email' v-model.trim="resetHasla.email"
                        :placeholder="placeholder" required :readonly="emailReadOnly"></sm-input>
                </div>
                <div class='buttons-panel'>
                    <sm-button class='margin-top-2x margin-right green-button' label='Wyślij link resetujący hasło' @on-click='onSubmit'></sm-button>
                    <sm-button class='margin-top-2x' label="Anuluj" @on-click='onCancel'></sm-button>
                </div>
            </form>
        </sm-form-dialog>
    </div>
    `
})