class Cookies {
    getCookie(cname='sm-portal.meta') {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    getJSON(cname='sm-portal.meta') {
        var cookie = this.getCookie(cname);
        if(!utils.isNull(cookie)) {
            try {
                return JSON.parse(utils.unquote(cookie));
            } catch (e) {
                console.error(e.name + ": " + e.message);
            }
        }
        return null;
    }    

    baset64ToJSON(cname='sm-portal.meta') {
        var cookie = this.getCookie(cname);
        if (!utils.isNull(cookie)) {
            try {
                var decodedCookie = atob(utils.unquote(cookie));
                return JSON.parse(decodedCookie);
            } catch (e) {
                console.error(e.name + ": " + e.message);
            }
        }
        return null;
    }
}