import {RPCSpi} from "jigsaw-rpc";

import koa from "koa"
import APIError from "../apierror/APIError";
import HTTPResponse from "./HTTPResponse";
import PostHandler from "../PostHandler";
import compose from "koa-compose";
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
        return compose([userAgent,middleware]);
    }

    private async handle(ctx:koa.Context,next:koa.Next){
        let req_path = ``;
        let query = ctx.query;

        req_path += `${query.path}`;
        req_path += `:`;
        req_path += `<${ctx.method.toLowerCase()}>`;
        req_path += `${ctx.path}`;
        delete query.path;
        
        let body_obj:any = null;
        try{
            let data = await this.jigsaw.send(req_path,query);
            ctx.status = 200;
            body_obj = HTTPResponse.createSuccess(data).toObject();
            
        }catch(err){//must be APIError

            let apierr = err as APIError;
            ctx.status = apierr.getHttpStatusCode();
            body_obj = HTTPResponse.createFailed(apierr).toObject();
        }

        ctx.type = "application/json";

        if(ctx.userAgent.isBot)
            ctx.body = JSON.stringify(body_obj);
        else
            ctx.body = JSON.stringify(body_obj,null,"\t");

        await next();
    }

};

export default KoaAdapter;
