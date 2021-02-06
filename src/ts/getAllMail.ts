

import * as $ from "jquery";
import { Response, Message } from "./types/response";
import { getSessionId, findGetParameter, htmlEscape, epochToUtcDate } from "./common";

export function getAllMail(): void {
    var sessionId: string = getSessionId();

    var emailAddresses: string = findGetParameter("addresses");
    var pageStr: string = findGetParameter("page");

    var page = 0
    if(pageStr != null) {
        page = parseInt(pageStr);
    }

    $.when(fetchAllMail(emailAddresses, sessionId, page).then(function(e) {
        var response: Response = e;
        allMailFetched(response);
    }));
}

function fetchAllMail(emailAddresses: string, sessionId: string, page: number) {
    return $.ajax({
        //url: "http://localhost:8080/espogmailsync/mail",
        url: "https://api.intern.mrfriendly.nl/espogmailsync/mail",
        method: "get",
        data: {
            "sessionId": sessionId,
            "senderAddress": emailAddresses,
            "page": page
        }
    });
}

function allMailFetched(response: Response) {

    // If the response status isn't 200, there's
    //likely an authentication issue
    if(response.status != 200) {
        alert(response.message);
    }

    //Sort the messages by epoch_data, descending
    var messages: Message[] = response.messages;
    messages.sort((a, b) => parseInt(b.epoch_date) - parseInt(a.epoch_date));

    var inboxTable = document.createElement("table");
    var inboxTbody = document.createElement("tbody");
    var inboxDiv = document.getElementById("inbox");

    //Iterate over every message
    var index = 0;

    for(var i = 0; i < response.messages.length; i++) {
        var message: Message = response.messages[i];

        var row = document.createElement("tr");
        row.classList.add("allEmailRow");

        //var rowDiv = document.createElement("div");
        //rowDiv.classList.add("allEmailRow");

        //When the div is clicked the user should be taken to the mail details
        row.addEventListener("click", function(event) {
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
        var tdId = document.createElement("td");
        var id = document.createElement("p");
        id.classList.add("mailId", "mailRowElement");
        id.innerHTML = message.id;
        tdId.append(id);
        row.append(tdId);

        //Email date
        var dateTd = document.createElement("td");
        var date = document.createElement("p");
        date.classList.add("mailDate", "mailRowElement");
        date.innerHTML = epochToUtcDate(Number.parseInt(message.epoch_date), true);
        dateTd.append(date);
        row.append(dateTd);

        //Inbound or outbound
        var directionTd = document.createElement("td");
        var direction = document.createElement("p");
        
        switch(message.direction) {
            case "outbound":
                direction.innerHTML = htmlEscape(">>")
                direction.classList.add("outbound");
                break;
            case "inbound":
                direction.innerHTML = htmlEscape("<<");
                direction.classList.add("inbound");
        }

        direction.classList.add("mailRowElement", "mailDirection");
        directionTd.append(direction);
        row.append(directionTd);

        //Email subject
        var subjectTd = document.createElement("td");
        var subject = document.createElement("p");
        subject.classList.add("mailSubject", "mailRowElement");
        subject.innerHTML = htmlEscape(message.subject ?? "");
        subjectTd.append(subject);
        row.append(subjectTd);

        var mailRegex = /<([^>]*)>/gm

        //Email sender
        var fromTd = document.createElement("td");
        var from = document.createElement("p");
        from.classList.add("mailSender", "mailRowElement");

        var fromMatch: string;
        if(message.from.match(mailRegex) != null) {
            fromMatch = message.from.match(mailRegex)[0];
        } else {
            fromMatch = message.from;
        }

        var fromHeader = document.createElement("span");
        fromHeader.classList.add("mailFromToHeader");
        fromHeader.innerHTML = "From: ";

        from.append(fromHeader);
        from.append(fromMatch.replace("<", "").replace(">", ""));

        fromTd.append(from);
        row.append(fromTd);

        //Receiver
        var toTd = document.createElement("td");
        var to = document.createElement("p");
        to.classList.add("mailReceiver", "mailRowElement");
        
        var toHeader = document.createElement("span");
        toHeader.classList.add("mailFromToHeader");
        toHeader.innerHTML = "To: ";
        
        to.append(toHeader);
        
        try {
            to.append(message.to.replace("<", "").replace(">", ""));
        } catch(exception) {
            console.log(exception);
            to.append(message.to);
        }
        
        toTd.append(to);
        row.append(toTd);

        inboxTbody.append(row);
    }

    inboxTable.append(inboxTbody);
    inboxDiv.append(inboxTable);


    var currentPage: number = parseInt(findGetParameter("page") ?? "0");
    if(currentPage == 0) currentPage = 1;

    console.log(currentPage);

    var navHolder = document.createElement("navHolder");
    navHolder.classList.add("navHolder");

    var pageNavDiv = document.createElement("div");
    pageNavDiv.classList.add("pageNav");

    if(currentPage != 1) {
        var prevPageDiv = document.createElement("div");
        prevPageDiv.classList.add("prevPage");
        
        var prevPageText = document.createElement("p");
        prevPageText.id = "prevPageTxt";
        prevPageText.innerHTML = "Previous Page: " + String(currentPage -1);

        prevPageDiv.append(prevPageText);
        prevPageDiv.addEventListener("click", function(event) {
            if(event.target instanceof Element) {
                var url = new URL(window.location.href);
                url.searchParams.set("page", String(currentPage -1));

                document.location.href = url.toString();
            } else {
                alert("Something went wrong. Please try again later");
            }
        });

        pageNavDiv.append(prevPageDiv);
    }

    var nextPageDiv = document.createElement("div");
    nextPageDiv.classList.add("nextPage");

    var nextPageText = document.createElement("p");
    nextPageText.innerHTML = "Next Page: " + String(currentPage + 1);
    nextPageText.id = "nextPageTxt";

    nextPageDiv.append(nextPageText);
    nextPageDiv.addEventListener("click", function(event) {
        if(event.target instanceof Element) {            
            var url = new URL(document.location.href);
            url.searchParams.set("page", String(currentPage +1));

            document.location.href = url.toString();
        } else {
            alert("Something went wrong. Please try again later");
        }
    });    

    pageNavDiv.append(nextPageDiv);

    navHolder.append(pageNavDiv);
    inboxDiv.append(navHolder);
}