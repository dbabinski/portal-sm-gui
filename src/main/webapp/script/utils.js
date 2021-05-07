class Utils {
    getUUID() {
        var nbr, randStr = "";
        do {
            randStr += (nbr = Math.random()).toString(16).substr(2);
        } while (randStr.length < 30);
        return [
            randStr.substr(0, 8), "-",
            randStr.substr(8, 4), "-4",
            randStr.substr(12, 3), "-",
            ((nbr * 4 | 0) + 8).toString(16), // [89ab]
            randStr.substr(15, 3), "-",
            randStr.substr(18, 12)
        ].join("");
    }
    copyJSON(json) {
        return JSON.parse(JSON.stringify(json));
    }
    czyPeselPrawidlowy(value, required) {
        if(this.isNull(value)) {
            return required ? false : true;
        }
        var pesel = value.replace(/[\ \-]/gi, '');
        if (pesel.length !== 11) {
            return false;
        } else {
            var steps = new Array(1, 3, 7, 9, 1, 3, 7, 9, 1, 3);
            var sum_nb = 0;
            for (var x = 0; x < 10; x++) {
                sum_nb += steps[x] * pesel[x];
            }
            var sum_m = 10 - sum_nb % 10;
            var sum_c;
            if (sum_m == 10) {
                sum_c = 0;
            } else {
                sum_c = sum_m;
            }
            if (sum_c != pesel[10]) {
                return false;
            }

        }
        return true;
    }
    plecNaPodstawiePesel(pesel) {
        if (this.czyPeselPrawidlowy(pesel)) {
            var sex = parseInt(pesel.substring(9, 10));
            if ((sex % 2) === 0) {
                return 'kobieta';
            }
            return 'mężczyzna';
        }
        return null;
    }
    dataNaPodstawiePesel(pesel) {
        if (this.czyPeselPrawidlowy(pesel)) {
            var yearLow = "19";
            var yearHigh = pesel.substring(0, 2);
            var monthInt = parseInt(pesel.substring(2, 4));
            var monthStr = monthInt.toString();
            if (monthInt >= 21 && monthInt <= 32) {
                yearLow = "20";
                monthStr = (monthInt - 20).toString();
            }
            if (monthInt >= 41 && monthInt <= 52) {
                yearLow = "21";
                monthStr = (monthInt - 40).toString();
            }
            if (monthInt >= 61 && monthInt <= 72) {
                yearLow = "22";
                monthStr = (monthInt - 60).toString();
            }
            if (monthInt >= 81 && monthInt <= 92) {
                yearLow = "18";
                monthStr = (monthInt - 80).toString();
            }
            if (monthStr.length < 2) {
                monthStr = "0" + monthStr;
            }
            var day = pesel.substring(4, 6);
            return yearLow + yearHigh + "-" + monthStr + "-" + day;
        }
        return null;
    }
    getDateISO(dateObject) {
        if (dateObject !== undefined && dateObject !== null && dateObject instanceof Date) {
            var months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
            var day = ("0" + dateObject.getDate()).slice(-2);
            var dateIso = dateObject.getFullYear() + "-" + months[dateObject.getMonth()] + "-" + day;
            return dateIso;
        }
        return "";
    }
    strToNull(object) {
        if (this.isNull(object)) {
            return null;
        } else if (object.toString().toLowerCase() === 'null') {
            return null;
        }
        return object;
    }
    isNull(object) {
        if (object === undefined) {
            return true;
        }
        if (object === null) {
            return true;
        }
        if (object.toString() === null) {
            return true;
        }
        if (object.toString().length === 0) {
            return true;
        }
        return false;
    }
    getLabel(labelFor) {
        let element = document.getElementById(labelFor);
        if(element != undefined && element.labels.length > 0) {
            return  element.labels[0];
        }
        return undefined;
    }
    getLabels(prefix) {
        let labels = [];
        let elements = document.getElementsByTagName('LABEL');
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            if(utils.isNull(prefix)) {
                labels.push(element);
            } else if(element.htmlFor.startsWith(prefix)) {
                labels.push(element);
            }
        }
        return labels;
    }
    capitalizeFirsteLetter(text) {
        let capitalized = text;
        if(!utils.isNull(text)) {
            capitalized = string.charAt(0).toUpperCase();
            if(text.length > 1) {
                capitalized += text.slice(1);
            }
        }
        return capitalized;
    }
    unquote(text) {
        if(!this.isNull(text)) {
            return text.replace(/(^")|("$)/g, '');
        }
        return text;
    }
    isInViewport(element) {
        var rect = element.getBoundingClientRect();
        var html = document.documentElement;
        return (
            rect.width > 0 && rect.height > 0
            // rect.top >= 0 &&
            // rect.left >= 0 &&
            // rect.bottom <= (window.innerHeight || html.clientHeight) &&
            // rect.right <= (window.innerWidth || html.clientWidth)
        );
    }
    documentClickListener(event, element, inside, outside) {        
        let targetElement = event.target; // clicked element
        do {
            if (targetElement == element) {
                // This is a click inside.
                if(typeof inside !== "function") {
                    inside = false;
                }
                if(inside) {
                    inside();
                }
                return;
            }
            // Go up the DOM
            targetElement = targetElement.parentNode;
        } while (targetElement);
        // This is a click outside.
        if(typeof outside !== "function") {
            outside = false;
        }
        if(outside) {
            outside();
        }              
    }
    /**
     * 
     * @param {function} condition 
     * @returns 
     */
    waitUntil(condition) {
        return new Promise((resolve) => {            
            let interval = setInterval(() => {
                if (!condition()) {
                    return
                }
                clearInterval(interval)
                resolve()
            }, 100)
        });
    }
}
var utils = new Utils();