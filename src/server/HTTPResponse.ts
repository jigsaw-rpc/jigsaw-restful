import APIError from "../apierror/APIError";

class HTTPResponse{
    private code:string;
    private httpcode:number;
    private message:string;
    private detail:string;
    private data:any;
    private type:string;
    private hasError:boolean;
    private err_domain:string | null = null;

    constructor(hasError:boolean,code:string,httpcode:number,message:string,err_domain:string | null = null,detail:string="",data:any = null){
        this.hasError = hasError;
        this.err_domain = err_domain;
        this.code = code;
        this.httpcode = httpcode;
        this.message = message;
        this.detail = detail
        this.data = data;
        this.type = this.data instanceof Buffer ? "base64" : "object";
    }
    toObject(){
        return {
            error:this.hasError,
            err_domain:this.err_domain,
            code:this.code,
            httpcode:this.httpcode,
            message:this.message,
            detail:this.detail,
            type:this.type,
            data:this.type == "base64" ? this.data.toString("base64") : this.data
        }
    }
    static createSuccess(data:any){
        return new HTTPResponse(false,"SUCCESS",200,"API invoked successfully",null,"",data);
    }
    static createFailed(err:APIError){
        return new HTTPResponse(true,err.code,err.httpcode,err.message,err.domain,err.detail,null);
    }

};


export default HTTPResponse;
