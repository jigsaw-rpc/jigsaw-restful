import assert from "assert";
import {RPCSpi} from "jigsaw-rpc"
import InternalError from "./InternalError";

class APIError extends RPCSpi.error.JGError{
    private apicode : number;
    private httpcode: number;
    private detail : any;

    constructor(code:number,message:string,httpcode : number = 500,detail:any=""){
        super(-1,"");

        this.name = "APIError";
        this.apicode = code;
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
        return this.apicode;
    }
    stringify(){
        let obj={
            name:"APIError",
            code:-1,
            desc:"",
            detail:this.detail,
            apicode:this.apicode,
            httpcode:this.httpcode,
            message:this.message,
            parsing_str:""
        }
        obj.parsing_str = JSON.stringify(obj);
        return JSON.stringify(obj);
    }
    static parse(str:string){
        let obj=JSON.parse(str);

        return new APIError(obj.apicode,obj.message,obj.httpcode,obj.detail);
    }
    static fromError(err:Error){
        return new APIError(9001,err.message,500);
    }
    static fromJGError(err:RPCSpi.error.JGError){    
        return APIError.parse(err.parsing_str || "{}");
    }
}

export default APIError;