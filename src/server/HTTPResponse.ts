import APIError from "../apierror/APIError";

class HTTPResponse{
    private code:string;
    private httpcode:number;
    private message:string;
    private detail:string;
    private data:any;
    private type:string;
    private hasError:boolean;

    constructor(hasError:boolean,code:string,httpcode:number,message:string,detail:string="",data:any = null){
        this.hasError = hasError;
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
            code:this.code,
            httpcode:this.httpcode,
            message:this.message,
            detail:this.detail,
            type:this.type,
            data:this.type == "base64" ? this.data.toString("base64") : this.data
        }
    }
    static createSuccess(data:any){
        return new HTTPResponse(true,"REST_SUCCESS",200,"API invoked successfully","",data);
    }
    static createFailed(err:APIError){
        return new HTTPResponse(false,err.code,err.httpcode,err.message,err.getDetailMessage(),null);
    }

};


export default HTTPResponse;
