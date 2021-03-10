import APIError from "./APIError";

class InternalError extends APIError{
    public detail : string;
    constructor(err:Error){
        super("REST_9001","Internal Error Occured", 500);
        this.name = "InternalError";
        this.detail = err.stack || err.message;

    }
    getDetailMessage(){
        return this.detail;
    }
}

export default InternalError;
