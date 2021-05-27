Vue.component("view-zmiana-hasla", {
    props: {
        token: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            show: false,
            message: null,
            noweHaslo: {}
        }
    },
    mounted() {
        let self = this;
        self.$nextTick(
            function() {
                if(!utils.isNull(self.token)) {
                    fetch(
                        "/sm-portal-server/uzytkownicy/zmiana-hasla/" + self.token, {
                            headers: {
                                "Content-type": "application/json; charset=UTF-8"
                            }
                        })
                        .then(res => app.handleErrors(res))
                        .then(res => res.json())
                        .then(json => {
                            if(json.blad === true){
                                self.message = json.komunikat; 
                            } else {
                                self.noweHaslo.idKonta = json.dane.idKonta;
                            }
                            self.show = true;
                            self.focus();
                        });
                }
            }
        );
    },
    methods: {
        clear() {
            this.message = null;
            this.noweHaslo = {};
            return this;
        },
        focus() {
            this.$nextTick(() => this.$refs.haslo.focus());
            return this;
        },
        saveItem(object) {
            let self = this;
            fetch("/sm-portal-server/uzytkownicy/zmiana-hasla/", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(object)
            })
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        app.toast("Twoje hasło zostało zmienione");
                        self.clear();
                        router.push('/');
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
                        self.saveItem(hasloDoZapisu);
                    }
                });
        },
        setValid() {
            let self = this;
            Object.keys(self.$refs).forEach(function(key) {
                self.$refs[key].message = null;
            });
        },
    },
    template: `
    <div v-show='show' class='view-zmiana-hasla'>
        <div v-if='message' class='message-error'>{{message}}</div>
        <div v-else class='container'>        
            <div class='content'>
                <div class='header'>
                    Zmiana hasła
                </div>
                <div class='main'>
                    <form>
                        <input type="hidden" name='id' v-model.number="noweHaslo.idKonta"></input>
                        <div class='grid'>
                            <label class='nowrap' for='formZmianaHasla-haslo'>Nowe hasło</label>
                            <sm-input id="formZmianaHasla-haslo" ref='haslo' type='password' name='haslo' v-model.trim="noweHaslo.haslo" required></sm-input>
                    
                            <label class='nowrap' for='formZmianaHasla-potwierdzHaslo'>Potwierdź hasło</label>
                            <sm-input id="formZmianaHasla-potwierdzHaslo" ref='potwierdzoneHaslo' type='password' name='potwierdzoneHaslo' v-model.trim="noweHaslo.potwierdzoneHaslo" required></sm-input>
                        </div>
                        <div class='buttons-panel'>
                            <sm-button class='margin-top-2x margin-right green-button' label='Zapisz' @on-click='onSubmit'></sm-button>
                        </div>
                    </form>
                </div>                
            </div>
        </div>
    </div>
    `
});