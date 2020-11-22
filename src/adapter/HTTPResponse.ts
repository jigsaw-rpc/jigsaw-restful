import APIError from "src/apierror/APIError";

class HTTPResponse{
    private code:number;
    private httpcode:number;
    private message:string;
    private detail:string;
    private data:any;

    constructor(code:number,httpcode:number,message:string,detail:string="",data:any = null){
        this.code = code;
        this.httpcode = httpcode;
        this.message = message;
        this.detail = detail
        this.data = data;
    }
    toObject(){
        return {
            error:this.code != 0,
            code:this.code,
            httpcode:this.httpcode,
            message:this.message,
            detail:this.detail,
            data:this.data
        }
    }
    static createSuccess(data:any){
        return new HTTPResponse(0,200,"API invoked successfully","",data);
    }
    static createFailed(err:APIError){
        return new HTTPResponse(err.getCode(),err.getHttpStatusCode(),err.message,err.getDetailMessage(),null);
    }

};


export default HTTPResponse;
