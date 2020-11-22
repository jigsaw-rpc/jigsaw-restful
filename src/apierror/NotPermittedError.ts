import APIError from "./APIError";

class NotPermittedError extends APIError{
    constructor(){
        super(9003,"This operation is not permitted.", 403);
        this.name = "NotPermittedError";
    }
}

export default NotPermittedError;
