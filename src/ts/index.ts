// @file fetchMailSingle.ts
// @author Tobias de Bruijn
import * as $ from "jquery";
import { Response, Message } from "./types/response";
import { getSessionId, findGetParameter, htmlEscape } from "./common";

export function getSingleMail() {
    var sessionId: string = getSessionId();
    var mailId: string = findGetParameter("id");

    $.when(fetchSingleMail(mailId, sessionId).then(function(e: Response) {
        var response: Response = e;

        console.log(e);

        if(response.status != 200) {
            alert(response.message);
        }

        //we're only requesting one email, so we can just get the first Message
        var message: Message = response.messages[0];

        //The div under which we're going to put everything
        var mailContentDiv: HTMLElement = document.getElementById("mailContent");

        if(message.nextMessage != null) {
            var nextMessage = document.createElement("a");
            nextMessage.href = "espogmailsync/single-mail.php?" + message.nextMessage;
            nextMessage.classList.add("threadNavigator");
            nextMessage.innerHTML = "Next E-Mail";
        }

        if(message.previousMessage != null) {
            var nextMessage = document.createElement("a");
            nextMessage.href = "espogmailsync/single-mail.php?" + message.previousMessage;
            nextMessage.classList.add("threadNavigator");
            nextMessage.innerHTML = "Previous E-Mail";
        }

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

        var cc = document.createElement("p");
        cc.classList.add("mailHeader");
        cc.innerHTML = "CC: " + htmlEscape(message.cc ?? "");
        mailContentDiv.append(cc);

        var hr = document.createElement("hr");
        hr.classList.add("mailHeaderBodySeperator");
        mailContentDiv.append(hr);

        var bodyIndicator = document.createElement("p");
        bodyIndicator.classList.add("bodyIndicator");
        bodyIndicator.innerHTML = "E-Mail Body:";
        mailContentDiv.append(bodyIndicator);
        
        var body = document.createElement("div");
        body.innerHTML = message.body_text_html_decoded;
        body.classList.add("mailBody");
        mailContentDiv.append(body);
    }));
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