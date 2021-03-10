import {RPC} from "jigsaw-rpc"
import {serializeError} from "serialize-error";

class APIError extends RPC.error.JGError{
    public code : string;
    public httpcode: number;
    public detail : any;

    constructor(code:string,message:string,httpcode : number = 500,detail:any=""){
        super(code,"");

        this.name = "APIError";
        this.code = code;
        this.httpcode = httpcode;
        this.message = message;
        this.detail = detail;
    }
    getDetailMessage(){
        return this.detail;
    }
    getHttpStatusCode(){
        return this.httpcode;
    }
    getCode(){
        return this.code;
    }
    static parse(err_json:string) : APIError{
        const err_obj = JSON.parse(err_json);
        let err : any = new APIError(err_obj.code,err_obj.message,err_obj.httpcode,err_obj.detail);

        for(let key in err_obj){
            err[key] = err_obj[key];
        }
        return err;
    }
    static fromError(err:Error) : APIError{
        const err_obj = serializeError(err);

        let apierr = APIError.parse(JSON.stringify(err_obj));
        if(!err_obj.code){
            apierr.code = "REST_9001";
            apierr.httpcode = 500;
        }
        return apierr;
        
    }
}

export default APIError;