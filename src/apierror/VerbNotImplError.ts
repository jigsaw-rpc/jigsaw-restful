import APIError from "./APIError";

class VerbNotImplError extends APIError{
    private verb:string;
    constructor(verb:string = ""){
        super("REST_9004",`This API doesn't implement the verb : ${verb}`, 501);
        this.verb = verb;
        this.name = "VerbNotImplemented";
    }
}

export default VerbNotImplError;
