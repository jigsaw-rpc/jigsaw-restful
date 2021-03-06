import koa from "koa"
import RequestFormatError from "../apierror/RequestFormatError";
import APIError from "../apierror/APIError";
import HTTPResponse from "./HTTPResponse";
import PostHandler from "../PostHandler";
import compose from "koa-compose";
import bodyparser from "koa-bodyparser";
import {userAgent} from "koa-useragent";
import { RPC } from "jigsaw-rpc";

class KoaAdapter{
    private jigsaw:RPC.IJigsaw;
    constructor(jigsaw:RPC.IJigsaw){
        this.jigsaw = jigsaw;
        this.jigsaw.post(PostHandler,"jigsaw-router.KoaAdapter");
    }
    koa():koa.Middleware{
        let middleware = this.handle.bind(this);
        return compose([bodyparser({
            onerror(err,ctx){

            }

        }),userAgent,middleware]);
    }

    private async handle(ctx:koa.Context,next:koa.Next){
        await next();

        
        let req_path = ``;

        req_path += `${ctx.query.path}`;
        req_path += `:`;
        req_path += `<${ctx.method.toLowerCase()}>`;
        req_path += `${ctx.path}`;
        
        let body_obj:any = null;
        try{
            
            if(!ctx.query.path)
                throw new RequestFormatError(`path param must be specified on URL`);
            
            let invoke_data = ctx.request.body;
            if(ctx.get("Content-Type") == "" && !ctx.request.rawBody){
                invoke_data = {};
            }else{
                if(!ctx.is("json") || !ctx.request.body)
                    throw new RequestFormatError(`request body must be a json`);
            }

            
            let data = await this.jigsaw.send(req_path,invoke_data);
            body_obj = HTTPResponse.createSuccess(data).toObject();
            
            ctx.status = 200;
        }catch(err){          

            body_obj = HTTPResponse.createFailed(APIError.fromError(err)).toObject();
            ctx.status = err.httpcode;
        }

        ctx.type = "application/json";

        ctx.body = JSON.stringify(body_obj);
        
    }

};

export default KoaAdapter;
