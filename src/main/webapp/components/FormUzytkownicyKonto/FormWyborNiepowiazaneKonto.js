Vue.component('form-wybor-niepowiazane-konto', {
    props: {
        label: {
            default: "Konto"
        },
        maxListElements: {
            default: 10
        },
        placeholder: {
            default: 'Login lub email'
        }
    },
    data() {
        return {
            excludedIDs: [],
            selectedObject: null,
            list: []
        };
    },
    mounted() {
    },
    methods: {
        clear() {
            this.list = [];
            this.selectedObject = null;
            this.excludedIDs = [];
            this.$refs.autocomplete.clear();
            return this;
        },
        focus() {
            this.$nextTick(() => this.$refs.autocomplete.focus());
            return this;
        },
        load() {
            this.list = [];
            this.selectedObject = null;
            let params = {
                filter: this.$refs.autocomplete.filter,
                limit: this.maxListElements,
                offset: 0,
                refresh: false
            };
            let self = this;
            fetch("/euslugi-zarzadzanie-server/uzytkownicy/konta/niepowiazane", {
                method: 'POST',
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(params)
            })
                .then(res => {
                    return app.handleErrors(res);
                })
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        json.dane.konta.forEach(function(element) {
                            if(!self.excludedIDs.includes(element.id)) {
                                element.label = element.login + " (" + element.email + ")";
                                self.list.push(element);
                            }
                        });
                        self.$refs.autocomplete.setList(self.list);
                    }
                });
        },
        getSelectedObject() {
            return this.selectedObject;
        },
        onSubmit() {
            let self = this;
            self.selectedObject = null;
            let obj = self.$refs.autocomplete.getSelectedItem();
            if(!utils.isNull(obj) && !utils.isNull(obj.id)) {
                self.list.forEach(function(item) {
                    if(item.id.toString() == obj.id.toString()) {
                        self.selectedObject = item;
                    }
                });
            } else {
                app.getMessageDialog()
                    .setMessage("Prosze wybrać konto do powiązania!")
                    .show();
            }
            self.$emit('on-submit');
        },
        onCancel() {
            // this.$refs.autocomplete.clear();
            this.$emit('on-cancel');
        }
    },
    template: `
    <div class='form-wybor-niepowiazane-konto'>
        <form>
            <div className="row">
                <label class='cell' for="formWybor-text">{{label}}</label>
                <div class='cell'>
                    <sm-autocomplete ref='autocomplete' :placeholder='placeholder' @on-filter-change='load' minCharsToActivate='1'/>
                </div>
            </div>
            <div class='buttons-panel'>
                <sm-button class='margin-top-2x margin-right green-button' label='Powiąż' @on-click='onSubmit'></sm-button>
                <sm-button class='margin-top-2x' label="Anuluj" @on-click='onCancel'></sm-button>
            </div>
        </form>
    </div>
    `
})