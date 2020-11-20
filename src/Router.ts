const RouterParser = require("route-parser");

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
        this.parser = new RouterParser(pattern);
    }
    getVerb(){
        return this.verb;
    }
    route(ctx:any,next:NextFunction){
        ctx.params = this.parser.match(ctx.method);
        return this.handler(ctx,next);
    }
}
export default Router;
