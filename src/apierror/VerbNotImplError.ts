import APIError from "./APIError";

class VerbNotImplError extends APIError{
    private verb:string;
    constructor(verb:string = ""){
        super("VERB_NOT_IMPL",`This API doesn't implement the verb.`, 501,{ verb },"REST");
        this.verb = verb;
        this.name = "VerbNotImplemented";
    }
}

export default VerbNotImplError;
