export interface Response {
    messages:   Message[];
    status:     number;
    message:    string;
    for:        string;
}

export interface Message {
    cc:                     string;
    thread_id:              string;
    epoch_date:             string;
    subject:                string;
    body_text_html:         string;
    body_text_plain:        string;
    from:                   string;
    id:                     string;
    to:                     string;
    previousMessage:        string;
    nextMessage:            string;
    direction:              string;
    body_text_html_decoded: string;
}