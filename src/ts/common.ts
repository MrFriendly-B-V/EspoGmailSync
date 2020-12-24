export function getSessionId(): string {
	return getCookie("session");
}

function getCookie(cookieName: string): string {
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