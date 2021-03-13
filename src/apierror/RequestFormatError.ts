import APIError from "./APIError";

class RequestFormatError extends APIError{
    constructor(detail:any){
        super("INVALID_REQUEST_FORMAT","Your request format isn't correct.", 400,detail,"REST");
        this.name = "RequestFormatError";
    }
}

export default RequestFormatError;
