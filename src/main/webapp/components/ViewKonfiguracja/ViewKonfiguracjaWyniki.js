Vue.component('view-konfiguracja-wyniki', {
    data() {
        return {
            konfiguracjaWyniki: {}
        }
    },
    mounted() {        
    },
    methods: {    
        _refresh() {
        },
        _save() {
        }
    },
    template: `
    <div class='view-konfiguracja-wyniki'>
        <div class='view-header'>Konfiguracja e-Wyniki</div>
        <form>            
            <div class='buttons-panel'>
                <sm-button class='margin-top-2x' label="Przywróć" @on-click='_refresh'></sm-button>
                <sm-button class='margin-top-2x margin-left green-button' label="Zapisz" @on-click='_save'></sm-button>
            </div>
        </form>
    </div>
    `
})