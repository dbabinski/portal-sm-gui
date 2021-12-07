import { isNull, unquote } from '@/lib/utils';

export function getCookieMeta(cname = 'sm-portal.meta') {
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

export function getJSON (cname = 'sm-portal.meta') {
  var cookie =  getCookieMeta(cname);
  if (!isNull(cookie)) {
    try {
      var decodedCookie = atob(unquote(cookie));
      return JSON.parse(decodedCookie);
      
    } catch (e) {
      console.error(e.name + ": " + e.message);
    }
  }
  return null;
}

export function getCookieJwt(cname = 'sm-portal.jwt') {
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

export function getJSONjwt (cname = 'sm-portal.jwt') {
  var cookie =  getCookieMeta(cname);
  if (!isNull(cookie)) {
    try {
      var decodedCookie = atob(unquote(cookie));
      return JSON.parse(decodedCookie);
      
    } catch (e) {
      console.error(e.name + ": " + e.message);
    }
  }
  return null;
}