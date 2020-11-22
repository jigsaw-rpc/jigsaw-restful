import {RPCSpi} from "jigsaw-rpc";

import koa from "koa"
import APIError from "../apierror/APIError";
import HTTPResponse from "./HTTPResponse";
import JigsawInvoker from "./JigsawInvoker";
import compose from "koa-compose";
import {userAgent} from "koa-useragent";

class KoaAdapter{
    private invoker:JigsawInvoker;
    constructor(jigsaw:RPCSpi.jigsaw.IJigsaw){
        this.invoker = new JigsawInvoker(jigsaw);
    }
    get():koa.Middleware{
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
            let data = await this.invoker.invoke(req_path,query);
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
