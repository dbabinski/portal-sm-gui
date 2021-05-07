Vue.component('form-typ-komunikatu', {
    data () {
        return {
            typKomunikatu: {}
        };
    },
    methods: {
        onSubmit() {
            let self = this;
            self.setValid();
            fetch(
                "/euslugi-zarzadzanie-server/slowniki/typy-komunikatow/parse", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify(this.typKomunikatu)
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
                        let nowyTypKomunikatu = this.typKomunikatu;
                        this.$emit('on-submit', nowyTypKomunikatu);
                    }
                });
        },
        clear() {
            this.setValid();
            this.typKomunikatu = {};
            return this;
        },
        onCancel() {
            this.clear();
            this.$emit('on-cancel');
        },
        setValid() {
            let self = this;
            Object.keys(self.$refs).forEach(function(key) {
                self.$refs[key].message = null;
            });
        },
        focus() {
            this.$nextTick(() => this.$refs.opis.focus());
        }
    },
    template: `
    <div class='form-typ-komunikatu'>
        <form>
            <input type="hidden" name='id'  v-model.number="typKomunikatu.id"></input>
            <div class='grid'>
                <label for='formTypKomunikatu-opis'>Opis</label>
                <sm-input id='formTypKomunikatu-opis' ref='opis' type='text' name='opis' v-model.trim="typKomunikatu.opis" required></sm-input>
            </div>
            <div class='buttons-panel'>
                <sm-button class='margin-top-2x margin-right green-button' label="Zapisz" @on-click='onSubmit'></sm-button>
                <sm-button class='margin-top-2x' label="Anuluj" @on-click='onCancel'></sm-button>
            </div>
        </form>
    </div>
    `
})