import * as $ from 'jquery';
import * as Config from '../config';
import * as Util from '../util';
import { checkAuth } from '../auth';

interface Message {
    id:             string,
    sender:         string,
    receiver:       string,
    data:           string,
    cc:             string,
    bcc:            string,
    subject:        string,
    internalDate:   string,
}

interface GetMailResponse {
    status:         number
    page:           number,
    messages:       Message[],
    hasNextPage:    boolean
}

const MAIL_REGEX = /<([^>]*)>/gm;

export function getAllMail() {
    //First we need to verify if the user is logged in or not
    let isLoggedIn = checkAuth(window.location.href);
    if(!isLoggedIn) {
        return;
    }

    //Page parameter
    let page = Util.findGetParameter("page");
    if(page == null || page == "") {
        page = "1";
    }

    //Collect needed information for sending a request to the server
    let sessionId = Util.getCookie("session");
    let addresses = Util.findGetParameter("addresses");

    if(addresses == null || addresses == "") {
        alert("Invalid URL");
        return;
    }

    //Make a request to the server
    let allMailReq = $.ajax({
        url: Config.GET_MAIL_ENDPOINT + "?sessionId=" + sessionId + "&addresses=" + addresses + "&page=" + page,
        method: 'get'
    });

    allMailReq.done(function(e) {
        let mailResponse = <GetMailResponse> e;

        if(mailResponse.status != 200) {
            checkAuth(window.location.href);
            return;
        }

        buildInbox(mailResponse);
    });

    allMailReq.fail(function(e) {
        alert("Something went wrong, please try again later");
    });
}

function buildInbox(mailResponse: GetMailResponse) {
    let messages = mailResponse.messages;
    
    //Sort the messages by their internalDate (epoch)
    messages.sort((a, b) => parseInt(b.internalDate) - parseInt(a.internalDate));

    //Parent div to the entire inbox
    let inbox = document.getElementById("inbox");

    for(let i = 0; i < messages.length; i++) {
        let message = messages[i];

        //Create a 'row' element, which will hold this Message item
        let row = document.createElement("div");
        row.classList.add("inboxRow");
        row.id = message.id;

        //Add an event listener to the Row
        //When it is clicked it should open the message
        row.addEventListener("click", function(e) {
            if(e.target instanceof Element) {
                let element = this as Element;
                let id = element.id;

                let singleMailPage = "/espogmailsync/single-mail.html?id=" + id;
                window.location.href = singleMailPage;
            } else {
                return;
            }
        });

        //The first column in the Row will be the date of the message
        let messageDate = Util.epochToUtcDate(Number.parseInt(message.internalDate));
        let dateElement = document.createElement("p");
        dateElement.classList.add("date");
        dateElement.innerHTML = Util.htmlEscape(messageDate);
        row.append(dateElement);

        //Second column will be the subject
        let subjectElement = document.createElement("p");
        subjectElement.classList.add("subject");
        subjectElement.innerHTML = Util.htmlEscape(message.subject);
        row.append(subjectElement);

        //Third column is the sender
        let senderElement = document.createElement("p");
        senderElement.classList.add("sender");

        //The sender element has a header
        let senderHeaderElement = document.createElement("span");
        senderHeaderElement.classList.add("senderHeader");
        senderHeaderElement.innerHTML = "From: ";
        senderElement.append(senderHeaderElement);

        //Add the sender email to the senderElement
        //This requires some regex puzzeling
        let sender: string;
        if(message.sender.match(MAIL_REGEX) != null) {
            sender = message.sender.match(MAIL_REGEX)[0];
        } else {
            sender = message.sender;
        }

        //Finally set the inner html and add the element to the parent row
        senderElement.innerHTML = Util.htmlEscape(sender);
        row.append(senderElement);

        //Fourth column is the receiver
        let receiverElement = document.createElement("p");
        receiverElement.classList.add("receiver");

        //Like the sender, the receiver element also has a header
        let receiverHeaderElement = document.createElement("span");
        receiverElement.classList.add("receiverHeader");
        receiverHeaderElement.innerHTML = "To: ";
        receiverElement.append(receiverHeaderElement);

        //Add the receiver email to the receiverElement
        //This requires some regex puzzeling
        let receiver: string;
        if(message.receiver.match(MAIL_REGEX) != null) {
            receiver = message.receiver.match(MAIL_REGEX)[0];
        } else {
            receiver = message.receiver;
        }

        //Finally set the inner HTML and add the element to the parent row
        receiverElement.innerHTML = Util.htmlEscape(receiver);
        row.append(receiverElement);

        //We are now done building this row
        //Attach the row to the inbox element
        inbox.append(row);
    }
}