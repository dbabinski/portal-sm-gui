Vue.component('form-uzytkownicy-grupa', {
    data: function () {
        return {
            grupa: {},
            typyGrup: []
        };
    },
    methods: {
        load: function() {
            let loadTypyGrup = fetch(
                "/sm-portal-server/slowniki/typy-grup/")
                .then(res => app.handleErrors(res))
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        this.typyGrup = [{}].concat(json.dane.typyGrup);
                    }
                });
        },
        onSubmit: function() {
            let self = this;
            self.setValid();
            fetch(
                "/sm-portal-server/uzytkownicy/grupy/parse", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify(this.grupa)
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
                        let nowaGrupa = this.grupa;
                        this.$emit('on-submit', nowaGrupa);
                    }
                });
        },
        onCancel: function() {
            this.clear();
            this.$emit('on-cancel');
        },
        clear: function() {
            this.setValid();
            this.grupa = {};
            this.typyGrup = [];
            return this;
        },
        setValid: function() {
            let self = this;
            Object.keys(self.$refs).forEach(function(key) {
                self.$refs[key].message = null;
            });
        },
        focus: function() {
            this.$nextTick(() => this.$refs.idTypGrupySelect.focus());
            return this;
        }
    },
    template: `
    <div class='form-uzytkownicy-grupa'>
        <form>
            <input type="hidden" name='id'  v-model.number="grupa.id"></input>
            <div class='grid'>
                <label for='formUzytkownicyGrupa-idTypGrupy'>Typ grupy</label>
                <div class="select-wrap">
                    <select id="formUzytkownicyGrupa-idTypGrupy" ref="idTypGrupySelect" v-model="grupa.idTypGrupy" name="idTypGrupy" required>
                        <option v-for='typGrupy in typyGrup' :key='typGrupy.id' :value='typGrupy.id'>{{typGrupy.nazwa}}</option>
                    </select>
                    <sm-input-warning ref='idTypGrupy'></sm-input-warning>
                </div>
            
                <label for='formUzytkownicyGrupa-opis'>Opis</label>
                <sm-input id="formUzytkownicyGrupa-opis" ref='opis' type='text' name='opis' v-model.trim="grupa.opis" required></sm-input>

                <label for='formUzytkownicyGrupa-aktywna'>Aktywna</label>
                <input id="formUzytkownicyGrupa-aktywna" ref="aktywna" type="checkbox" name="aktywna" v-model="grupa.aktywna">
            </div>
            <div class='buttons-panel'>
                <sm-button class='margin-top-2x margin-right green-button' label="Zapisz" @on-click='onSubmit'></sm-button>
                <sm-button class='margin-top-2x' label="Anuluj" @on-click='onCancel'></sm-button>
            </div>
        </form>
    </div>
    `
})