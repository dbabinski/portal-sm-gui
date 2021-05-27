Vue.component('form-kod-jednorazowy', {
    data() {
        return {
            kod: {
                pesel: null,
                kod: null,
                waznyDo: null
            },
        };
    },
    methods: {
        onSubmit() {
            let self = this;
            self.setValid();
            fetch(
                "/sm-portal-server/jednorazowe-kody-dostepu/parse/", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify(self.kod)
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
                        let nowyKod = self.kod;
                        self.$emit('on-submit', nowyKod);
                    }
                });
        },
        onCancel() {
            this.clear();
            this.$emit('on-cancel');
        },
        onGenerate() {
            let self = this;
            fetch(
                "/sm-portal-server/jednorazowe-kody-dostepu/generuj/", {
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
                .then(res => app.handleErrors(res))
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        let nowyKod = json.dane;
                        if(!utils.isNull(nowyKod)) {
                            self.kod.kod = nowyKod.kod;
                            if(utils.isNull(self.kod.waznyDo)) {
                                self.kod.waznyDo = nowyKod.waznyDo;
                            }
                        }
                    }
                });
        },
        clear() {
            this.setValid();
            this.kod = {
                pesel: null,
                kod: null,
                waznyDo: null
            };
            return this;
        },
        setValid() {
            let self = this;
            Object.keys(self.$refs).forEach(function(key) {
                self.$refs[key].message = null;
            });
        },
        focus() {
            this.$nextTick(() => this.$refs.pesel.focus());
            return this;
        }
    },
    template: `
    <div class='form-kod-jednorazowy'>
        <form>
            <input type="hidden" name='id' v-model.number="kod.id"></input>
            <div class='grid'>
                <label for='formKodJednorazowy-pesel'>PESEL</label>
                <sm-input id='formKodJednorazowy-pesel' ref='pesel' type='text' name='pesel' v-model.trim="kod.pesel" required></sm-input>

                <label for='formKodJednorazowy-kod'>Kod</label>
                <div class='grid grid-button'>
                    <sm-input id='formKodJednorazowy-kod' ref='kod' type='text' name='kod' v-model.trim="kod.kod" required></sm-input>
                    <sm-button label="Generuj" @on-click='onGenerate'></sm-button>
                </div>

                <label for='formKodJednorazowy-waznyDo'>Ważny do</label>
                <sm-input id='formKodJednorazowy-waznyDo' ref='waznyDo' type='text' name='waznyDo' v-model.trim="kod.waznyDo" placeholder='RRRR-MM-DD gg:mm' required></sm-input>
            </div>
            <div class='buttons-panel'>
                <sm-button class='margin-top-2x margin-right green-button' label="Zapisz" @on-click='onSubmit'></sm-button>
                <sm-button class='margin-top-2x' label="Anuluj" @on-click='onCancel'></sm-button>
            </div>
        </form>
    </div>
    `
})