Vue.component("sm-input", {
    props: {       
        id: {
            default: null
        },
        type: {
            default: 'text'
        },
        tabindex: {
            default: 0
        },
        name: {
            default: null
        },
        required: {
            default: false
        },
        placeholder: {
            default: null
        },
        value: {
            default: null
        },      
        disabled: {
            default: false
        },
        readonly: {
            default: false
        }   
    },    
    data() {
        return {
            message: null,
            mutableReadonly: null
        }
    },    
    computed: {
        //nie można bezpośrednio modyfikować props
        _readonly() {
            if(!utils.isNull(this.mutableReadonly)) {
                return this.mutableReadonly;
            }
            return this.readonly;
        }
    },
    methods: {
        focus() {
            this.$refs.input.focus();
        },        
        _blur() {
            this.$emit('blur');
        },
        _input() {
            this.$emit('input', this.$refs.input.value);
        },
        setReadonly(readonly) {
            this.mutableReadonly = readonly;
        }
    },
    template: `
        <div class='sm-input'>
            <div>
                <input
                    ref='input'
                    :id='id'
                    :type='type'
                    :name='name'
                    :required='required'
                    :value='value'
                    :placeholder='placeholder'
                    :disabled='disabled'
                    :readonly='_readonly'
                    @input="_input"
                    @blur="_blur">
                </input>
            </div>
            <div ref='messageContainer' class='message' v-html="message"></div>            
        </div>
    `
})