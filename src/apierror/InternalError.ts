import APIError from "./APIError";

class InternalError extends APIError{
    private err : Error;
    constructor(err:Error){
        super(9001,"Internal Error Occured", 500);
        this.name = "InternalError";
        this.err = err;
    }
    getDetailMessage(){
        return this.err.stack || this.err.message;
    }
}

export default InternalError;
