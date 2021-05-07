Vue.component("sm-filter-dates", {
    props: {
        label: {
            defaultText: "Etykieta",
        },
        placeholder: {
            default: null
        },
        filterValue: {
            default: null
        },
        data_od:{
            default: () => {
                var d = new Date(),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;

                return [year, month, day].join('-');
            }
        },
        data_do:{
            default: () => {
                var d = new Date(),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;

                return [year, month, day].join('-');
            }
        }
    },
    data() {
        return {
            textValue: this.filterValue,
            dataOdValue: this.data_od,
            dataDoValue: this.data_do,
        };
    },
    methods: {
        getCurrentDate() {
            var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [year, month, day].join('-');
        },
        focus() {
            this.$refs.input.focus();
        },
        submit() {
            this.$emit('on-submit', this.textValue, this.dataOdValue, this.dataDoValue);
        },
        clear() {
            this.textValue = null;
            this.dataOdValue = this.getCurrentDate();
            this.dataDoValue = this.getCurrentDate();
            this.focus();
            this.$emit('on-submit', this.textValue, this.dataOdValue, this.dataDoValue);
        }
    },
    template: `
        <div class='sm-filter-dates'>
            <div class='filter-contener margin-right'>
                <label>Data od</label>
                <input type="date" class='undecorated' v-model="dataOdValue"></input>
            </div>
            <div class='filter-contener margin-right'>
                <label>Data od</label>
                <input type="date" class='undecorated' v-model="dataDoValue"></input>
            </div>
            <div class='filter-contener grow'>
                <label>{{label}}</label>
                <input ref='input' type='text' class='undecorated' :placeholder="placeholder" @keyup.enter="submit" v-model="textValue"></input>
            </div>
            <div class='filter-contener'>
                <div class='icon' title="Zastosuj" @click='submit'><i class="fas fa-check" ></i></div>
                <div class='icon' title="Wyczyść" @click='clear'><i class="fas fa-eraser" ></i></div>
            </div>
        </div>
    `
})