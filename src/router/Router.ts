import URLParser from "./URLParser";
import assert from "assert";
import Path from "./Path";
import RouterOption from "./RouterOption";
import Validator from "validatorjs";
import RequestFormatError from "../apierror/RequestFormatError";


type NextFunction = ()=>Promise<void>;
type HandlerFunction = (ctx:any,Next:NextFunction)=>Promise<void>;



class Router{
    private verb:string;
    private pattern:string;
    private parser : any;
    private handler : HandlerFunction;
    private option : RouterOption;

    constructor(verb:string,pattern:string,option:RouterOption,handler:HandlerFunction){
        this.verb = verb;
        this.pattern = pattern;
        this.handler = handler;
        this.option = option;
        this.parser = new URLParser(pattern)
    }
    getPattern(){
        return this.pattern;
    }
    getOption(){
        return this.option;
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
        

        let validator = new Validator(ctx.data,this.option.vali);

        if(validator.fails())
            throw new RequestFormatError(validator.errors.errors);
        
        

        await this.handler(ctx,next);
    }

}
export default Router;
