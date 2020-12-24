// @file fetchMailSingle.ts
// @author Tobias de Bruijn

function getSingleMail() {
    var sessionId: string = getSessionId();
    var mailId: string = findGetParameter("id");

    $.when(fetchSingleMail(mailId, sessionId).then(function(e) {
        var response: Response = e;

        console.log(e);

        if(response.status != 200) {
            alert(response.message);
        }

        //we're only requesting one email, so we can just get the first Message
        var message: Message = response.messages[0];

        //The div under which we're going to put everything
        var mailContentDiv: HTMLElement = document.getElementById("mailContent");

        var cc = document.createElement("p");
        cc.classList.add("mailHeader");
        cc.innerHTML = "CC: " + htmlEscape(message.cc ?? "");
        mailContentDiv.append(cc);

        var subject = document.createElement("p");
        subject.classList.add("mailHeader");
        subject.innerHTML = "Subject: " + htmlEscape(message.subject ?? "");
        mailContentDiv.append(subject);

        var from = document.createElement("p");
        from.classList.add("mailHeader");
        from.innerHTML = "From: " + htmlEscape(message.from ?? "");
        mailContentDiv.append(from);

        var to = document.createElement("p");
        to.classList.add("mailHeader");
        to.innerHTML = "To: " + htmlEscape(message.to ?? "");
        mailContentDiv.append(to);
        
        var body = document.createElement("div");
        body.innerHTML = message.body_text_html_decoded;
        body.classList.add("mailBody");
        mailContentDiv.append(body);
        

    }));
}

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function fetchSingleMail(mailId: string, sessionId: string) {
    return $.ajax({
        url: "https://api.intern.mrfriendly.nl/espogmailsync/mail",
        method: "get",
        data: {
            "sessionId": sessionId,
            "mailId": mailId
        }
    })
}

function getSessionId(): string {
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

function findGetParameter(parameterName: string): string {
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

interface Response {
    messages: Message[];
    readonly status:   number;
    message: string;
}

interface Message {
    cc:              string;
    thread_id:       string;
    epoch_date:      string;
    subject:         string;
    body_text_html:  string;
    body_text_plain: string;
    from:            string;
    id:              string;
    to:              string;
    body_text_html_decoded: string;
}

function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}
