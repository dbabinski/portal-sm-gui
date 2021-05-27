Vue.component("view-slowniki", {
    template: `
        <div class='view-slowniki'>
            <menu-slowniki></menu-slowniki>
            <div>
                <router-view></router-view>
            </div>
        </div>
    `
});
