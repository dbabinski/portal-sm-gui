Vue.component("sm-input-warning", {      
    data() {
        return {
            message: null
        }
    },    
    template: `
        <div class='sm-input-warning' v-html="message"></div>
    `
})