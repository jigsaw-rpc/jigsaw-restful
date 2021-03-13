import {RPC} from "jigsaw-rpc";
import APIError from "./apierror/APIError";

export default async function postHandler(ctx:RPC.PostContext,next:RPC.NextFunction){
    if(!(ctx.result instanceof Error)){
        await next();
        return;
    }

    let err = ctx.result;
    ctx.result = APIError.fromError(err);

    await next();

}