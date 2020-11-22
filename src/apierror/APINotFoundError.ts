import APIError from "./APIError";

class APINotFoundError extends APIError{
    constructor(){
        super(9002,"This API can't be found", 404);
        this.name = "APINotFoundError";
    }
}

export default APINotFoundError;
