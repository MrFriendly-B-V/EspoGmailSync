import * as Util from './util';
import * as Config from './config';

interface SessionCheckResponse {
    status:     number,
    reason:     String
}

export function checkAuth(fromUrl: string): boolean {
    let sessionId = Util.getCookie("session");

    if(sessionId == null || sessionId == "") {
        //'session' cookie isn't set, user is not logged in
        redirectToLogin(fromUrl);
        return false;
    }

    let checkSessionIdReq = $.ajax({
        url: Config.POST_SESSION_ENDPOINT + "?session_id=" + sessionId,
        method: 'post'
    });

    checkSessionIdReq.done(function(e) {
        let sessionResponse = <SessionCheckResponse> e;

        if(sessionResponse.status == 200) {
            return true;
        } else {
            window.location.href = Config.AUTHSERVER_LOGIN_URL + "?returnUri=" + fromUrl;
        }
    });

    checkSessionIdReq.fail(function(e) {
        alert("Something went wrong. Please try again later");
        return false;
    });
}

function redirectToLogin(fromUrl: string) {
    window.location.href = Config.AUTHSERVER_LOGIN_URL + "?returnUri=" + fromUrl;
}