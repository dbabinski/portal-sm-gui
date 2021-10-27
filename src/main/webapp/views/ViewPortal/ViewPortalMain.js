Vue.component('view-portal-main', {
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
    <div id="app">
        <v-app id="inspire">
            
            <div>
                <router-view></router-view>
            </div>

        </v-app>
    </div>          
    `
});