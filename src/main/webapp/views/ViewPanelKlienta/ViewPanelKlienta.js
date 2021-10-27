Vue.component('view-panel-klienta', {
    data() {
        return {
        
        } 
    },
    
    computed: {
        logged() {
            return !utils.isNull(store.getters.email);
        }
    },

    methods: {
    },

    
    template: `
    <div class="view-panel-klienta">

        <h1>Panel Klienta</h1>

    </div>          
    `
});