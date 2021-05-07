Vue.component("menu-user", {
    data() {
        return {
        };
    },
    destroyed() {
        document.removeEventListener('click', this._documentClickListener);
    },
    methods: {
        show() {
            this.$refs.menu.classList.remove('hidden');
            this.$refs.logout.focus();
            document.body.classList.add('modal-open');
            document.addEventListener('click', this._documentClickListener);
        },
        hide() {
            document.removeEventListener('click', this._documentClickListener);
            this.$refs.menu.classList.add('hidden');
            document.body.classList.remove('modal-open');
        },
        _logout() {
            this.hide();
            app.logout();
        },
        _documentClickListener(event) {
            const self = this;
            console.log(document.body.classList);
            utils.documentClickListener(event, this.$el, null, () => {
                self.hide();
            });
        },
        _resetPassword() {
            this.hide();            
            let dialog = app.getDialogPasswordResetEmail();            
            dialog.resetHasla.email = store.getters.email;
            dialog.emailReadOnly = true;
            dialog.show("Reset hasła przez e-mail");        
        },
        _account() {
            this.hide();
            router.push('konto');
        }
    },
    template: `
        <div ref='menu' class='menu-user hidden'
            @blur='hide'>
            <ul>
                <li>
                    <p tabindex='1'
                        @keyup.esc='hide'
                        @keyup.space='_resetPassword'
                        @keyup.enter='_resetPassword'
                        @click='_resetPassword'
                    >
                        Zmień hasło
                    </p>
                </li>
                <li>
                    <p tabindex='2'
                        ref='account'
                        @keyup.esc='hide'
                        @keyup.space='_account'
                        @keyup.enter='_account'
                        @click='_account'
                    >
                        Konto
                    </p>
                </li>
                <li>
                    <p tabindex='3'
                        ref='logout'
                        @keyup.esc='hide'
                        @keyup.space='_logout'
                        @keyup.enter='_logout'
                        @click='_logout'
                    >
                        Wyloguj
                    </p>
                </li>
            </ul>
        </div>
    `
});
