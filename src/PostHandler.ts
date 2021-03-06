import {RPC} from "jigsaw-rpc";
import APIError from "./apierror/APIError";

export default async function postHandler(ctx:RPC.PostContext,next:RPC.NextFunction){
    if(!(ctx.result instanceof Error)){
        await next();
        return;
    }

    let err = ctx.result;
    
    if(err instanceof APIError){
        let apierr = err as APIError;
        ctx.result = apierr;
    }else if(err.name=="APIError"){
        let apierr = APIError.parse((err as APIError).parsing_str || "{}");
        ctx.result = apierr;
    }else if(err.name=="JGError"){
        let jgerr = err as RPC.error.JGError;
        ctx.result = APIError.fromJGError(jgerr);
    }else
        ctx.result = APIError.fromError(err);

    await next();

}