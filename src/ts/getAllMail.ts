

import * as $ from "jquery";
import { Response, Message } from "./types/response";
import { getSessionId, findGetParameter, htmlEscape, epochToUtcDate } from "./common";

export function getAllMail(): void {

    var sessionId: string = getSessionId();
    var emailAddresses: string = findGetParameter("addresses");

    $.when(fetchAllMail(emailAddresses, sessionId).then(function(e) {
        var response: Response = e;

        //If the response status isn't 200, there's
        //likely an authentication issue
        if(response.status != 200) {
            alert(response.message);
        }

        //Sort the messages by epoch_data, descending
        var messages: Message[] = response.messages;
        messages.sort((a, b) => parseInt(b.epoch_date) - parseInt(a.epoch_date));

        var inboxDiv = document.getElementById("inbox");

        //Iterate over every message
        response.messages.forEach(function(message: Message) {

            var rowDiv = document.createElement("div");
            rowDiv.classList.add("allEmailRow");

            //When the div is clicked the user should be taken to the mail details
            rowDiv.addEventListener("click", function(event) {
                if(event.target instanceof Element) {
                    var element: HTMLElement = this as HTMLElement;

                    //Get the id, which is an invisible <p> element
                    var id = element.getElementsByClassName("mailId")[0].innerHTML;
                    
                    //Redirect the user
                    var singleMail = "/espogmailsync/single-mail.php?id=" + id;
                    document.location.href = singleMail;
                } else {
                    alert("Something went wrong. Please try again later");
                }
                
            });

            //Mail id
            var id = document.createElement("p");
            id.classList.add("mailId", "mailRowElement");
            id.innerHTML = message.id;
            rowDiv.append(id);

            console.log(id);

            //Email date
            var date = document.createElement("p");
            date.classList.add("mailDate", "mailRowElement");
            date.innerHTML = epochToUtcDate(Number.parseInt(message.epoch_date));
            rowDiv.append(date);

            //Email subject
            var subject = document.createElement("p");
            subject.classList.add("mailSubject", "mailRowElement");
            subject.innerHTML = htmlEscape(message.subject ?? "");
            rowDiv.append(subject);

            //Email sender
            var from = document.createElement("p");
            from.classList.add("mailSender", "mailRowElement");
            //const regex = '"/gm';
            //var messagePartiallyProcessed: any = message.from.split("<")[0];
            //from.innerHTML = htmlEscape(messagePartiallyProcessed.replaceAll('"', '') ?? "");
            from.innerHTML = htmlEscape(message.from);
            rowDiv.append(from);
           
            inboxDiv.append(rowDiv);
        });
    }));
}

function fetchAllMail(emailAddresses: string, sessionId: string) {
    return $.ajax({
        url: "https://api.intern.mrfriendly.nl/espogmailsync/mail",
        method: "get",
        data: {
            "sessionId": sessionId,
            "emailAddresses": emailAddresses
        }
    });
}