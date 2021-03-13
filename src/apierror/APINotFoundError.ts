import APIError from "./APIError";

class APINotFoundError extends APIError{
    constructor(){
        super("API_NOT_FOUND","This API can't be found", 404,"","REST");
        this.name = "APINotFoundError";        
    }
}

export default APINotFoundError;
