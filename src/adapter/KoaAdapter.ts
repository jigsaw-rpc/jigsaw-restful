import {RPCSpi} from "jigsaw-rpc";

import koa from "koa"
import RequestFormatError from "../apierror/RequestFormatError";
import APIError from "../apierror/APIError";
import HTTPResponse from "./HTTPResponse";
import PostHandler from "../PostHandler";
import compose from "koa-compose";
import bodyparser from "koa-bodyparser";
import {userAgent} from "koa-useragent";
import {RPC} from "jigsaw-rpc";

class KoaAdapter{
    private jigsaw:RPCSpi.jigsaw.IJigsaw;
    constructor(){
        this.jigsaw = RPC.GetJigsaw();
        this.jigsaw.post(PostHandler);
    }
    getJigsaw(){
        return this.jigsaw;
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
            ctx.status = 200;
            body_obj = HTTPResponse.createSuccess(data).toObject();
            
        }catch(err){//must be APIError
//            console.log(err);

            if(!(err instanceof APIError))
                err = APIError.fromError(err);

            let apierr = err as APIError;

            ctx.status = apierr.getHttpStatusCode();
            body_obj = HTTPResponse.createFailed(apierr).toObject();
        }

        ctx.type = "application/json";

        if(ctx.userAgent.isBot)
            ctx.body = JSON.stringify(body_obj);
        else
            ctx.body = JSON.stringify(body_obj,null,"\t");

    }

};

export default KoaAdapter;
