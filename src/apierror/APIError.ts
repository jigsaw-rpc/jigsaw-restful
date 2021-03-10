import {RPC} from "jigsaw-rpc"

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
    parse(err_json:string) : APIError{
        const err_obj = JSON.parse(err_json);
        let err : any = new APIError(err_obj.code,err_obj.message,err_obj.httpcode,err_obj.detail);

        for(let key in err_obj){
            err[key] = err_obj[key];
        }
        return err;
    }
    static fromError(err:Error){
        return new APIError("REST_9001",err.message,500);
    }
    static fromJGError(err:RPC.error.JGError){
        return new APIError(err.code,err.message,500,err.message);
    }
}

export default APIError;