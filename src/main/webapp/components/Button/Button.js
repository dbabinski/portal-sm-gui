Vue.component("sm-button", {
    props: {
        label: {
            default: "Etykieta"
        },
        title: {
            default: null
        },
        object: {
            type: Object,
            default: null
        }
    },
    methods: {
        onClick: function(event) {
            event.stopImmediatePropagation();
            this.$emit('on-click', this.object);
        },
        focus: function() {
            this.$refs.button.focus();
        }
    },
    template: `
        <div ref="button" class="sm-button" @keyup.enter="onClick" @keyup.space="onClick" @click="onClick" v-html="label" :title="title" tabindex='0'></div>
    `
})