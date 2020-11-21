import Router from "./Router";
import Path from "./Path";
import assert from "assert";

type NextFunction = ()=>Promise<void>;
type HandlerFunction = (ctx:any,Next:NextFunction)=>Promise<void>;

class Middleware{
    private routers : Array<Router> = [];
    
    public router(){
        return this.handle.bind(this);
    }
    public get(pattern:string,handler:HandlerFunction){
        return this.addRouter("get",pattern,handler);
    }
    public post(pattern:string,handler:HandlerFunction){
        return this.addRouter("post",pattern,handler);
    }
    public put(pattern:string,handler:HandlerFunction){
        return this.addRouter("put",pattern,handler);
    }
    public delete(pattern:string,handler:HandlerFunction){
        return this.addRouter("delete",pattern,handler);
    }
    private addRouter(verb:string,pattern:string,handler:HandlerFunction){
        let router = new Router(verb,pattern,handler);
        this.routers.push(router);
    }
    private async handle(ctx:any,next:NextFunction) : Promise<void>{
        assert(typeof(ctx.method)=="string","method must be specified");

        for(let router of this.routers){
            let path = Path.parse(ctx.method);
            
            if(router.getVerb() == path.verb){
                await router.route(ctx,next);
            }
        }
    }
}

export default Middleware;
