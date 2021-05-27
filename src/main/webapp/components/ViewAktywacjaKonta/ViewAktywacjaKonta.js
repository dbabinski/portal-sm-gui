Vue.component("view-aktywacja-konta", {
    props: {
        uuid: {
            type: String,
            default: null
        },
    },
    data() {
        return {
            message: null
        }
    },
    mounted() {
        let self = this;
        self.$nextTick(() => {
            if(!utils.isNull(self.uuid)) {
                fetch(
                    "/sm-portal-server/uzytkownicy/konta/aktywacja/" + self.uuid, {
                        headers: {
                            "Content-type": "application/json; charset=UTF-8"
                        }
                    })
                    .then(res => app.handleErrors(res))
                    .then(res => res.json())
                    .then(json => {
                        self.message = json.komunikat
                    });
            }
        });
    },
    template: `
    <div class='view-aktywacja-konta'>
        <div class='message'>{{message}}</div>
    </div>
    `
});