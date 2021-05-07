Vue.component("sm-toast", {  
    data: function() {
        return {
            message: "Etykieta",            
            visible: false
        }
    },
    methods: {
        show: function(message) {                
            this.message = message;  
            this.visible = true;           
            setTimeout(function() {
                this.visible = false
            }.bind(this), 3000);
        }
    },
    template: `
        <div class='sm-toast' :class="{'sm-toast-show': visible}">{{message}}</div>
    `
})