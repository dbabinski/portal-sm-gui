Vue.component('form-komorka-organizacyjna', {
    data: function () {
        return {
            komorkaOrganizacyjna: {},
            komorkiOrganizacyjne: []
        };
    },
    watch: {
        //uniemożliwia powiązania komórki z samą sobą
        komorkaOrganizacyjna: function() {
            this.checkSelfRelation();
        },
        komorkiOrganizacyjne: function() {
            this.checkSelfRelation();
        }
    },
    methods: {
        load: function() {
            let loadKomorkiOrganizacyjne = fetch("/sm-portal-server/slowniki/komorki-organizacyjne/")
                .then(res => app.handleErrors(res))
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        this.komorkiOrganizacyjne = [{}].concat(json.dane.komorkiOrganizacyjne);
                    }
                });
        },
        onSubmit: function() {
            let self = this;
            self.setValid();
            fetch(
                "/sm-portal-server/slowniki/komorki-organizacyjne/parse", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify(this.komorkaOrganizacyjna)
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
                        let nowaKomorkaOrganizacyjna = this.komorkaOrganizacyjna;
                        this.$emit('on-submit', nowaKomorkaOrganizacyjna);
                    }
                });
        },
        onCancel: function() {
            this.clear();
            this.$emit('on-cancel');
        },
        clear: function() {
            this.setValid();
            this.komorkaOrganizacyjna = {};
            this.komorkiOrganizacyjne = [];
            return this;
        },
        setValid() {
            let self = this;
            Object.keys(self.$refs).forEach(function(key) {
                self.$refs[key].message = null;
            });            
        },
        focus: function() {
            this.$nextTick(() => this.$refs.nazwa.focus());
            return this;
        },
        checkSelfRelation: function() {
            //uniemożliwia powiązania komórki z samą sobą
            if(!utils.isNull(this.komorkiOrganizacyjne) && !utils.isNull(this.komorkaOrganizacyjna)) {
                for (let i = this.komorkiOrganizacyjne.length - 1; i > 0; i--) {
                    if(this.komorkiOrganizacyjne[i].id == this.komorkaOrganizacyjna.id) {
                        this.komorkiOrganizacyjne.splice(i, 1);
                    }
                }
            }
        }
    },
    template: `
    <div class='form-komorka-organizacyjna'>
        <form>            
            <input type="hidden" name='id' v-model.number="komorkaOrganizacyjna.id"></input>
            <div class='grid'>
                <label for='formKomorkaOrganizacyjna-nazwa'>Nazwa</label>
                <sm-input  id='formKomorkaOrganizacyjna-nazwa' ref='nazwa' type='text' name='nazwa' v-model.trim="komorkaOrganizacyjna.nazwa" required></sm-input>

                <label for='formKomorkaOrganizacyjna-opis'>Opis</label>
                <sm-input id="formKomorkaOrganizacyjna-opis" ref='opis' type='text' name='opis' v-model.trim="komorkaOrganizacyjna.opis" required></sm-input>

                <label for="formKomorkaOrganizacyjna-komorkaNadrzedna">Komorka nadrzędna</label>
                    <div class="select-wrap">
                        <select  id="formKomorkaOrganizacyjna-komorkaNadrzedna" ref="select" v-model="komorkaOrganizacyjna.idKomorkiOrganizacyjnej" name="komorkaNadrzedna">
                            <option v-for='komorkaOrganizacyjna in komorkiOrganizacyjne' :key='komorkaOrganizacyjna.id' :value='komorkaOrganizacyjna.id'>{{komorkaOrganizacyjna.nazwa}}</option>
                        </select>
                    </div>
                </label>
            </div>
            <div class='buttons-panel'>
                <sm-button class='margin-top-2x margin-right green-button' label="Zapisz" @on-click='onSubmit'></sm-button>
                <sm-button class='margin-top-2x' label="Anuluj" @on-click='onCancel'></sm-button>
            </div>
        </form>
    </div>
    `
})