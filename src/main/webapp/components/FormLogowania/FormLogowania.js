Vue.component('form-logowania', {
    data() {
        return {
            logowanie: {
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
            this.logowanie = {
                opis : {}
            }
            return this;
        },
        focus() {
            return this;
        },
    },
    template: `
    <div class='form-logowania'>
        <form>
            <input type="hidden" name='id' v-model.number="logowanie.id"></input>
            <div class='grid'>
                <label class='label'>ID</label>
                <label class='value'>{{logowanie.id}}</label>

                <label class='label'>Data</label>
                <label class='value'>{{logowanie.data}}</label>

                <label class='label'>Czas</label>
                <label class='value'>{{logowanie.czas}}</label>

                <label class='label'>Adres IP</label>
                <label class='value monospace'>{{logowanie.ip}}</label>

                <label class='label'>Konto</label>
                <label class='value'>{{logowanie.uuidKonta}}</label>

                <label class='label'>Opis</label>
                <label class='value'>{{logowanie.opis}}</label>
            </div>

            <div class='buttons-panel'>
                <sm-button class='margin-top-2x' label="Zamknij" @on-click='onCancel'></sm-button>
            </div>
        </form>
    </div>
    `
})