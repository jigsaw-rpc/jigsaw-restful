import {serializeError} from "serialize-error";

class APIError extends Error{
    public code : string;
    public httpcode: number;
    public detail : any;
    public domain : string;
    public isAPIError : boolean = true;

    constructor(code:string,message:string,httpcode : number = 500,detail:any="",domain:string = "global"){
        super(message);

        this.name = "APIError";
        this.code = code;
        this.httpcode = httpcode;
        this.message = message;
        this.detail = detail;
        this.domain = domain;

    }
    static parse(err_obj:any) : APIError{
        let err : any = new APIError(err_obj.code,err_obj.message,err_obj.httpcode,err_obj.detail);

        for(let key in err_obj){
            err[key] = err_obj[key];
        }
        return err;
    }
    static fromError(err:Error) : APIError{
        const err_obj = serializeError(err);
        
        let apierr = APIError.parse(err_obj);
        if(!err_obj.isAPIError){
            apierr.code = "SYSTEM_INTERNAL_ERROR";
            apierr.httpcode = 500;
            apierr.domain = "REST";
        }
        return apierr;
    }
}

export default APIError;