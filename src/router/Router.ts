import URLParser from "./URLParser";
import assert from "assert";
import Path from "./Path";
import { parse } from "path";

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
    match(path_str:string){
        try{
            let path = Path.parse(path_str);
            let parsed = this.parser.parse(path.url);
    
            assert(parsed.method == this.pattern,"can't not route to.");
            return parsed;
        }catch(err){
            return false;
        }
    }
    async route(matched:any,ctx:any,next:NextFunction) : Promise<void>{
        ctx.url = matched.method;
        ctx.apiver = matched.ver;
        ctx.resid = matched.id;    

        await this.handler(ctx,next);
    }
}
export default Router;
