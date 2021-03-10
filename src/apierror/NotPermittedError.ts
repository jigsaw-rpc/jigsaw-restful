import APIError from "./APIError";

class NotPermittedError extends APIError{
    constructor(detail:string = ""){
        super("REST_9003","This operation is not permitted.", 403);
        this.name = "NotPermittedError";
        this.detail = detail;
    }
}

export default NotPermittedError;
