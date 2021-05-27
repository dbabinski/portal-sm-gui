class Cookies {
    getCookie(cname='e-uslugi.meta') {
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

    getJSON(cname='e-uslugi.meta') {
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
}