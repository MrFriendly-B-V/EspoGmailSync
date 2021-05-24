/**
 * Escapes the provided string to make it safe for usage in a HTML document
 * @param str The string to escape to make it safe for usage in a HTML document 
 * @returns The escaped string
 */
export function htmlEscape(str: string): string {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

/**
 * Get the session ID from the cookies
 * @returns The session ID
 */
export function getSessionId(): string {
	return getCookie("session");
}

/**
 * Get the value of a GET parameter
 * @param parameterName The name of the parameter
 * @returns The value of the requested parameter. Null if parameter doesn't exist
 */
export function findGetParameter(parameterName: string): string {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

/**
 * Get the value of a cookie from the cookiejar
 * @param cookieName The name of the cookie
 * @returns The value of the requested cookie
 */
export function getCookie(cookieName: string): string {
	var name: string = cookieName + "=";
	var decodedCookie: string = decodeURIComponent(document.cookie);
	var ca: string[] = decodedCookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
	  	while (c.charAt(0) == ' ') {
			c = c.substring(1);
	  	}
		  
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
	  	}
	}
	return "";
}

/**
 * Convert epoch time (seconds since January 1st 1970; also known as Unix time) to dd/mm/yyyy in UTC
 * @param epoch Epoch time as a number
 */
export function epochToUtcDate(epoch: number, includeTime = false): string {
    var date = new Date(epoch);
    var formattedDate = ("0" + date.getUTCDate()).slice(-2) + "-" + ("0" + (date.getUTCMonth() +1)).slice(-2) + "-" + date.getUTCFullYear();

    if(includeTime) {
        formattedDate += " " + ("0" + date.getUTCHours()).slice(-2) + ":" + ("0" + date.getUTCMinutes()).slice(-2);
    }

    return formattedDate;
}