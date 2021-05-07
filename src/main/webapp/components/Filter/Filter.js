Vue.component("sm-filter", {
    props: {
        label: {
            default: "Etykieta"
        },
        placeholder: {
            default: null
        },
        filterValue: {
            default: null
        }
    },    
    data: function() {
        return {
            value: this.filterValue
        };
    },
    methods: {
        focus: function() {
            this.$refs.input.focus();
        },
        submit: function() {
            this.$emit('on-submit', this.value);
        },
        clear: function() {
            this.value = null;
            this.focus();
            this.$emit('on-submit', this.value);
        }
    },
    template: `
        <div class='sm-filter'>
            <label>{{label}}</label>
            <input ref='input' type='text' class='undecorated' :placeholder="placeholder" @keyup.enter="submit" v-model="value"></input>
            <div class='icon' title="Zastosuj" @click='submit'><i class="fas fa-check" ></i></div>
            <div class='icon' title="Wyczyść" @click='clear'><i class="fas fa-eraser" ></i></div>
        </div>
    `
})