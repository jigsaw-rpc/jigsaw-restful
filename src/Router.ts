import URLParser from "./URLParser";
import assert from "assert";
import Path from "./Path";

type NextFunction = ()=>Promise<void>;
type HandlerFunction = (ctx:any,Next:NextFunction)=>Promise<void>;

class Router{
    private verb:string;
    private pattern:string;
    private parser : any;
    private handler : HandlerFunction;
    constructor(verb:string,pattern:string,handler:HandlerFunction){
        this.verb = verb;
        this.pattern = pattern;
        this.handler = handler;
        this.parser = new URLParser(pattern)
    }
    getVerb(){
        return this.verb;
    }
    async route(ctx:any,next:NextFunction) : Promise<void>{
        try{
            let path = Path.parse(ctx.method);
            let parsed = this.parser.parse(path.url);
    
            assert(parsed.method == this.pattern,"can't not route to.");
    
            ctx.url = parsed.method;
            ctx.apiver = parsed.ver;
            ctx.resid = parsed.id;    
        }catch(err){
            return;
        }


        await this.handler(ctx,next);
    }
}
export default Router;
