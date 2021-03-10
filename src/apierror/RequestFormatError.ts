import APIError from "./APIError";

class RequestFormatError extends APIError{
    constructor(detail:any){
        super("REST_9005","Your request format isn't correct.", 400,detail);
        this.name = "RequestFormatError";
    }
}

export default RequestFormatError;
