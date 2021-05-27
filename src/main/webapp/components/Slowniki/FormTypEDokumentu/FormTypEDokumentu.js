Vue.component('form-typ-edokumentu', {
    data: function () {
        return {
            typEDokumentu: {}
        };
    },
    methods: {
        onSubmit: function() {
            let self = this;
            self.setValid(); 
            fetch(
                "/sm-portal-server/slowniki/typy-edokumentow/parse", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify(this.typEDokumentu)                  
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
                        let nowyTypEDokumentu = this.typEDokumentu;
                        this.$emit('on-submit', nowyTypEDokumentu);
                    }
                });                 
        },
        onCancel: function() {
            this.clear();
            this.$emit('on-cancel');
        },
        clear: function() {
            this.setValid();
            this.typEDokumentu = {};
            return this;
        },
        setValid: function() {
            let self = this;
            Object.keys(self.$refs).forEach(function(key) {
                self.$refs[key].message = null;
            }); 
        },
        focus: function() {
            this.$nextTick(() => this.$refs.opis.focus());
        }
    },
    template: `
    <div class='form-typ-edokumentu'>
        <form>            
            <input type="hidden" name='id'  v-model.number="typEDokumentu.id"></input>            
            <div class='grid'>
                <label for='formTypEDokumentu-opis'>Opis</label>
                <sm-input id="formTypEDokumentu-opis" ref='opis' type='text' name='opis' v-model.trim="typEDokumentu.opis" required></sm-input>
            </div>
            <div class='buttons-panel'>
                <sm-button class='margin-top-2x margin-right green-button' label="Zapisz" @on-click='onSubmit'></sm-button>
                <sm-button class='margin-top-2x' label="Anuluj" @on-click='onCancel'></sm-button>
            </div>
        </form>
    </div>
    `
})