Vue.component('form-logi', {
    data() {
        return {
            log: {
                opis : {}
            },
        };
    },
    methods: {
        load(){

        },
        onCancel() {
            this.clear();

            this.$emit('on-cancel');
        },
        clear() {
            this.log = {
                opis : {}
            }
            return this;
        },
        focus() {
            this.log.opis_json = JSON.parse(this.log.opis);
            return this;
        },
    },
    template: `
    <div class='form-logi'>
        <form>
            <input type="hidden" name='id' v-model.number="log.id"></input>
            <div class='grid'>
                <label class='label'>ID</label>
                <label class='value'>{{log.id}}</label>

                <label class='label'>Data</label>
                <label class='value'>{{log.data}}</label>

                <label class='label'>Czas</label>
                <label class='value'>{{log.czas}}</label>

                <label class='label'>Adres IP</label>
                <label class='value monospace'>{{log.ip}}</label>

                <label class='label'>Obiekt</label>
                <label class='value'>{{log.tabelaObiektu}}</label>

                <label class='label'>ID obiektu</label>
                <label class='value monospace'>{{log.idObiektu}}</label>

                <label class='label'>Obiekt nadrzędny</label>
                <label class='value'>{{log.tabelaObiektuNadrzednego}}</label>

                <label class='label'>ID obiektu nadrzędnego</label>
                <label class='value monospace'>{{log.idObiektuNadrzednego}}</label>

                <label class='label'>PID</label>
                <label class='value monospace'>{{log.pid}}</label>

                <label class='label'>Typ operacji</label>
                <label class='value'>{{log.typOperacji}}</label>

                <label class='label'>Konto</label>
                <label class='value'>{{log.uuidKonta}}</label>
            </div>

            <div class='wartosci-kolumny' v-if="log.typOperacji == 'UPDATE'">
                <div class='wartosci-stare'>
                    <div class='sub-header'>Stare wartości</div>
                    <div class='wartosci-lista grid'>
                        <template v-for='(value, propertyName) in log.opis_json.old'>
                            <label class='label'>{{propertyName}}</label>
                            <div class='value'>{{value === null ? "null" : value}}</div>
                        </template>
                    </div>
                </div>
                <div class='wartosci-stare'>
                    <div class='sub-header'>Nowe wartości</div>
                    <div class='wartosci-lista grid'>
                        <template v-for='(value, propertyName) in log.opis_json.new'>
                            <label class='label'>{{propertyName}}</label>
                            <div class='value'>{{value === null ? "null" : value}}</div>
                        </template>
                    </div>
                </div>
            </div>
            <div class='wartosci' v-else>
                <div class='sub-header'>Wartości</div>
                <div class='wartosci-lista grid'>
                    <template v-for='(value, propertyName) in log.opis_json'>
                        <label  class='label'>{{propertyName}}</label>
                        <div class='value'>{{value === null ? "null" : value}}</div>
                    </template>
                </div>
            </div>

            <div class='buttons-panel'>
                <sm-button class='margin-top-2x' label="Zamknij" @on-click='onCancel'></sm-button>
            </div>
        </form>
    </div>
    `
})