import APIError from "./APIError";

class RequestFormatError extends APIError{
    private detail : string;
    constructor(detail:string){
        super(9005,"Your request format isn't correct.", 400);
        this.name = "RequestFormatError";
        this.detail = detail;
    }
    getDetailMessage() : string{
        return this.detail;
    }
}

export default RequestFormatError;
