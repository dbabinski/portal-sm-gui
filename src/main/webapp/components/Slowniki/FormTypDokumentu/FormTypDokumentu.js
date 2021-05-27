Vue.component('form-typ-dokumentu', {
    data: function () {
        return {
            typDokumentu: {}
        };
    },
    methods: {
        onSubmit: function() {
            let self = this;
            self.setValid();
            fetch(
                "/sm-portal-server/slowniki/typy-dokumentow/parse", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify(this.typDokumentu)
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
                        let nowyTypDokumentu = this.typDokumentu;
                        this.$emit('on-submit', nowyTypDokumentu);
                    }
                });
        },
        onCancel: function() {
            this.clear();
            this.$emit('on-cancel');
        },
        clear: function() {
            this.setValid();
            this.typDokumentu = {};
            return this;
        },
        setValid: function() {
            let self = this;
            Object.keys(self.$refs).forEach(function(key) {
                self.$refs[key].message = null;
            });
        },
        focus: function() {
            this.$nextTick(() => this.$refs.nazwaDokumentuTozsamosci.focus());
            return this;
        }
    },
    template: `
    <div class='form-typ-dokumentu'>
        <form>
            <input type="hidden" name='id'  v-model.number="typDokumentu.id"></input>
            <div class='grid'>
                <label for='formTypDokumentu-nazwaDokumentuTozsamosci'>Nazwa dokumentu tożsamości</label>
                <sm-input id="formTypDokumentu-nazwaDokumentuTozsamosci" ref='nazwaDokumentuTozsamosci' type='text' name='nazwaDokumentuTozsamosci' v-model.trim="typDokumentu.nazwaDokumentuTozsamosci" required></sm-input>

                <label for='formTypDokumentu-formatNumeracjiRegex'>Format numeracji (regex)</label>
                <sm-input id="formTypDokumentu-formatNumeracjiRegex" ref='formatNumeracjiRegex' type='text' name='formatNumeracjiRegex' v-model.trim="typDokumentu.formatNumeracjiRegex" required></sm-input>

                <label for='formTypDokumentu-formatNumeracjiOpis'>Format numeracji (opis)</label>
                <sm-input id="formTypDokumentu-formatNumeracjiOpis" ref='formatNumeracjiOpis' type='text' name='formatNumeracjiOpis' v-model.trim="typDokumentu.formatNumeracjiOpis" required></sm-input>
            </div>
            <div class='buttons-panel'>
                <sm-button class='margin-top-2x margin-right green-button' label="Zapisz" @on-click='onSubmit'></sm-button>
                <sm-button class='margin-top-2x' label="Anuluj" @on-click='onCancel'></sm-button>
            </div>
        </form>
    </div>
    `
})