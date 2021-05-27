Vue.component("form-typ-powiadomienia", {
    data: function () {
        return {
            typPowiadomienia: {}
        };
    },
    methods: {
        onSubmit: function() {   
            let self = this;
            self.setValid();                    
            fetch(
                "/sm-portal-server/slowniki/typy-powiadomien/parse", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        Authorization: "Basic " + store.getters.token
                    },
                    body: JSON.stringify(this.typPowiadomienia)                  
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
                        let nowyTypPowiadomienia = this.typPowiadomienia;
                        this.$emit('on-submit', nowyTypPowiadomienia);
                    }
                });        
        },
        onCancel: function() {
            this.clear();
            this.$emit('on-cancel');
        },
        clear: function() {
            this.setValid();
            this.typPowiadomienia = {};
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
            return this;
        }
    },
    template: `
    <div class='form-typ-powiadomienia'>
        <form>            
            <input type="hidden" name='id'  v-model.number="typPowiadomienia.id"></input>        
            <div class='grid'>
                <label for='formTypPowiadomienia-opis'>Opis powiadomienia</label>
                <sm-input id='formTypPowiadomienia-opis' ref='opis' type='text' name='opis' v-model.trim="typPowiadomienia.opis" required></sm-input>
            
                <label for='email'>E-mail</label>
                <input ref="email" type="checkbox" name="email" v-model="typPowiadomienia.email">
                
                <label for='sms'>SMS</label>
                <input ref="sms" type="checkbox" name="sms" v-model="typPowiadomienia.sms">
            </div>
            <div class='buttons-panel'>
                <sm-button class='margin-top-2x margin-right green-button' label="Zapisz" @on-click='onSubmit'></sm-button>
                <sm-button class='margin-top-2x' label="Anuluj" @on-click='onCancel'></sm-button>
            </div>
        </form>
    </div>
    `
})