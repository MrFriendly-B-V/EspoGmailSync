/**
 * @author Tobias de Bruijn
 * @file getMailSingle.ts
 */

import * as $ from "jquery";
import { Response, Message } from "./types/response";
import { getSessionId, findGetParameter, htmlEscape } from "./common";

/**
 * Get a single mail from the webserver
 * Uses GET parameter `id` as identifier for the mail
 */
export function getSingleMail() {
    
    //Get the sessionId and mailId
    // sessionId from 'session' cookie -> Used for auth
    // mailId from GET parameters -> Used to select the mail we want
    var sessionId: string = getSessionId();
    var mailId: string = findGetParameter("id");

    //Fetch the current email from the API
    $.when(fetchSingleMail(mailId, sessionId).then(function(e: Response) {
        var response: Response = e;

        //If the response status isn't 200, there's
        //likely an authentication issue
        if(response.status != 200) {
            alert(response.message);
        }

        //we're only requesting one email, so we can just get the first Message
        var message: Message = response.messages[0];

        //The div under which we're going to put everything
        var mailContentDiv: HTMLElement = document.getElementById("mailContent");

        //If there's a nextMessage, add a link to it
        if(message.nextMessage != null) {
            var nextMessage = document.createElement("a");
            nextMessage.href = "espogmailsync/single-mail.php?" + message.nextMessage;
            nextMessage.classList.add("threadNavigator");
            nextMessage.innerHTML = "Next E-Mail";
        }

        //If there's a previous message, add a link to it
        if(message.previousMessage != null) {
            var nextMessage = document.createElement("a");
            nextMessage.href = "espogmailsync/single-mail.php?" + message.previousMessage;
            nextMessage.classList.add("threadNavigator");
            nextMessage.innerHTML = "Previous E-Mail";
        }

        //Email subject
        var subject = document.createElement("p");
        subject.classList.add("mailHeader");
        subject.innerHTML = "Subject: " + htmlEscape(message.subject ?? "");
        mailContentDiv.append(subject);

        //Email sender
        var from = document.createElement("p");
        from.classList.add("mailHeader");
        from.innerHTML = "From: " + htmlEscape(message.from ?? "");
        mailContentDiv.append(from);

        //Email receiver
        var to = document.createElement("p");
        to.classList.add("mailHeader");
        to.innerHTML = "To: " + htmlEscape(message.to ?? "");
        mailContentDiv.append(to);

        //TODO add a check to leave this out of the document if it's empty
        var cc = document.createElement("p");
        cc.classList.add("mailHeader");
        cc.innerHTML = "CC: " + htmlEscape(message.cc ?? "");
        mailContentDiv.append(cc);

        //Horizontal line to split the body and the headers
        var hr = document.createElement("hr");
        hr.classList.add("mailHeaderBodySeperator");
        mailContentDiv.append(hr);

        //String informing the user that the next section will be the email body
        var bodyIndicator = document.createElement("p");
        bodyIndicator.classList.add("bodyIndicator");
        bodyIndicator.innerHTML = "E-Mail Body:";
        mailContentDiv.append(bodyIndicator);
    
        //The body itself.    
        var body = document.createElement("div");
        body.innerHTML = message.body_text_html_decoded;
        body.classList.add("mailBody");
        mailContentDiv.append(body);
    }));
}

//Ajax function used to fetch a single mail from the webserver
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