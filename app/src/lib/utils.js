export function getUUID()  {
  let nbr,
    randStr = "";
  do {
    randStr += (nbr = Math.random()).toString(16).substr(2);
  } while (randStr.length < 30);
  return [
    randStr.substr(0, 8),
    "-",
    randStr.substr(8, 4),
    "-4",
    randStr.substr(12, 3),
    "-",
    (((nbr * 4) | 0) + 8).toString(16),
    randStr.substr(15, 3),
    "-",
    randStr.substr(18, 12),
  ].join("");
}

export function copyJSON(json) {
  return JSON.parse(JSON.stringify(json));
}

export function getDateISO(dateObject) {
  if (
    dateObject !== undefined &&
    dateObject !== null &&
    dateObject instanceof Date
  ) {
    let months = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];
    let day = ("0" + dateObject.getDate()).slice(-2);
    let dateIso =
      dateObject.getFullYear() +
      "-" +
      months[dateObject.getMonth()] +
      "-" +
      day;
    return dateIso;
  }
}

export function strToNull(object) {
  if (isNull(object)) {
    return null;
  } else if (object.toString().toLowerCase() === "null") {
    return null;
  }
  return object;
}

export function isNull(object) {
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

export function capitalizeFirstexport(text) {
  let capitalized = text;
  if (!isNull(text)) {
    capitalized = text.charAt(0).toUpperCase();
    if (text.length > 1) {
      capitalized += text.slice(1);
    }
  }
  return capitalized;
}

export function unquote(text) {
  if (!isNull(text)) {
    return text.replace(/(^")|("$)/g, "");
  }
  return text;
}

export function waitUntil(condition) {
  return new Promise((resolve) => {
    let interval = setInterval(() => {
      if (!condition()) {
        return;
      }
      clearInterval(interval);
      resolve();
    }, 100);
  });
}


