Vue.component('sm-autocomplete', {
    props: {
        placeholder: {
            default: null
        },
        minCharsToActivate: {
            default: 3
        }
    },
    data() {
        return {
            list: [],
            selectedItem: {},
            filter: null,
            showList: true,
            listSize: 0
        };
    },
    watch: {
        filter(newValue, oldValue) {
            if(!utils.isNull(newValue) && newValue.trim().length >= this.minCharsToActivate) {
                this.$emit('on-filter-change', this.list);
            } else {
                this.list = [];
                this.selectedItem = {};
                this._hideList();
            }
        },
        list(newValue, oldValue) {
            this.listSize = utils.isNull(newValue) ? 0 : (newValue.length > 2 ? newValue.length : 2);
        }
    },
    methods: {        
        focus() {
            this.$refs.text.focus();
            return this;
        },
        clear() {            
            this.list = [];
            this.selectedItem = {};
            this.filter = null;
            return this;
        },
        setList(list) {
            this.list = list;
            if(this.showList) {
                this._showList();
            }
            this.showList = true;
        },
        getSelectedItem() {
            if(!utils.isNull(this.selectedItem)) {
                if(!utils.isNull(this.selectedItem.id)) {
                    if(this.selectedItem.label != this.filter) {
                        this.selectedItem = {};
                    }
                }
            }            
            return this.selectedItem;
        },
        _hideList() {
            this.$refs.uiMenu.classList.add('hide');
            this.$refs.text.focus();
        },
        _showList() {
            if(this.showList && !utils.isNull(this.list) && this.list.length > 0) {
                this.$refs.uiMenu.classList.remove('hide');
            } else {
                this.$refs.uiMenu.classList.add('hide');
            }
        },
        _focusList(event) {
            this.showList = true;
            if(!utils.isNull(this.list) && this.list.length > 0) {
                this._showList();
                let element = this._getListElement(0);
                if(!utils.isNull(element)) {
                    element.focus();
                }
            }
        },
        _transferFocusForward(event) {
            let index = event.target.tabIndex - 1;
            let element = this._getListElement(index + 1);
            if(!utils.isNull(element)) {
                element.focus();
            }
            return false;
        },
        _transferFocusBackward(event) {
            let index = event.target.tabIndex - 1;
            let element = this._getListElement(index - 1);
            if(!utils.isNull(element)) {
                element.focus();
            }
            return false;
        },
        _setFocus(event) {
            event.target.focus();
        },
        _getListElement(index) {
            if(!utils.isNull(index)) {
                let items = this.$refs['list-element-' + index];
                if(!utils.isNull(items) && items.length > 0) {
                    return items[0];
                }
            }
            return null;
        },
        _selectElement(event) {
            let dataset = event.target.dataset;
            if(!utils.isNull(dataset)) {
                this.selectedItem = {
                    id: dataset.id,
                    label: dataset.label
                };
                this.$refs.text.value = dataset.label;
                this.filter = dataset.label;
                this.$refs.uiMenu.classList.add('hide');
                this.showList = false;
                this.$refs.text.focus();
            }
        }
    },
    template: `
    <div>
        <input ref='text' type="text" :placeholder='placeholder'
            v-model.trim="filter"
            @keyup.down="_focusList"
            @keyup.enter="_focusList"
            @keyup.esc='_hideList'/>
        <div class='ui-menu-container'>
            <ul ref='uiMenu' class='ui-menu hide'>
                <li v-for='(element, index) in list' class='ui-menu-item'>
                    <p
                        class='list-element'
                        :ref="'list-element-' + index"
                        :id="'id-list-element-' + element.id"                        
                        :tabindex='index+1'
                        :data-id='element.id'
                        :data-label='element.label'
                        @keyup.esc='_hideList'
                        @keyup.up="_transferFocusBackward"
                        @keyup.down="_transferFocusForward"
                        @keyup.space='_selectElement'
                        @keyup.enter='_selectElement'
                        @click='_selectElement'
                        @mouseover="_setFocus"                        
                    >{{element.label}}</p>
                </li>
            </ul>
        </div>
    </div>
    `
})