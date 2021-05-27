Vue.component('form-aktualnosci', {
    data: function () {
        return {
            artykul: {},
            publikacjaOpcja: ["Tak", "Nie"],
            polaWymagane: ["tytul", "tresc", "data_dodania", "publikacja"],
        }
    },
    methods: {
        load() {

        },
        clear() {
            this.artykul = {
                publikacjaText: "Nie",
                publikacja:  false,
                dataPublikacji: utils.getDateISO(new Date())
            };
            return this;
        },
        onSubmit() {
            let self = this;
            self.setValid();
            if(self.artykul.publikacjaText == "Tak"){
                self.artykul.publikacja = true;
            } else {
                self.artykul.publikacja = false;
            }

            fetch(
                "/smportal-server/portal/aktualnosci/parse/", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify(self.artykul)
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
                        let nowyArtykul = self.artykul;
                        self.$emit('on-submit', nowyArtykul);
                    }
                });
        },
        onCancel() {
            this.clear();
            this.$emit('on-cancel');
        },
        onClick(){d

        },
        focus() {
            this.$nextTick(() => this.$refs.tytul.focus());
            return this;
        },
        setValid() {
            let self = this;
            Object.keys(self.$refs).forEach(function(key) {
                self.$refs[key].message = null;
            });
            return self;
        },
    },
    template: `
    <div class='form-aktualnosci'>
        <form>
            <input type="hidden" name='id' v-model.number="artykul.id"></input>
            <div class='grid'>
                <label for='formAktualnosci-tytul'>Tytuł</label>
                <sm-input id='formAktualnosci-tytul' ref='tytul' type='text' name='tytul' v-model.trim="artykul.tytul" required></sm-input>

                <label for='formAktualnosci-tresc'>Treść</label>
                <div>
                    <textarea id='formAktualnosci-tresc' ref='trescTextArea' type='text' name='tresc' v-model.trim="artykul.tresc" class='tresc' required></textarea>
                    <sm-input-warning ref="tresc"></sm-input-warning>
                </div>

                <label for='formAktualnosci-skrot'>Skrócona treść artykułu</label>
                <textarea id='formAktualnosci-skrot' ref='skrot' type='text' name='skrot' v-model.trim="artykul.skrot"></textarea>

                <label class='nowrap' for='formAktualnosci-dataPublikacji'>Data publikacji</label>
                <sm-input id='formAktualnosci-dataPublikacji' ref='dataPublikacji' type='text' name='dataPublikacji' v-model.trim="artykul.dataPublikacji" required></sm-input>

                <label for='formAktualnosci-autor'>Autor</label>
                <sm-input id='formAktualnosci-autor' ref='autor' type='text' name='autor' v-model.trim="artykul.autor"></sm-input>

                <label for='formAktualnosci-publikacja'>Publikacja</label>
                <div>
                    <div class="select-wrap">
                        <select id='formAktualnosci-publikacja' ref="publikacjaSelect" v-model="artykul.publikacjaText" name="publikacja" required>
                            <option v-for='publikacjaOpcja in publikacjaOpcja' :key='publikacjaOpcja' :value='publikacjaOpcja'>{{publikacjaOpcja}}</option>
                        </select>
                    </div>
                    <sm-input-warning ref="publikacja"></sm-input-warning>
                </div>
            </div>
            <div class='buttons-panel'>
                <sm-button class='margin-top-2x margin-right green-button' label="Zapisz" @on-click='onSubmit'></sm-button>
                <sm-button class='margin-top-2x' label="Anuluj" @on-click='onCancel'></sm-button>
            </div>
        </form>
    </div>
    `
})