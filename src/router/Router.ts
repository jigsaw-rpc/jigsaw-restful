import URLParser from "./URLParser";
import assert from "assert";
import Path from "./Path";
import RouterOption from "./RouterOption";
import Validator from "validatorjs";
import RequestFormatError from "../apierror/RequestFormatError";
import { RPCSpi } from "jigsaw-rpc";
import MatchInfo from "./MatchInfo";

class Router{
    private verb:string;
    private pattern:string;
    private parser : URLParser;
    private handler : RPCSpi.jigsaw.ware.UseWare;
    private option : RouterOption;

    constructor(verb:string,pattern:string,option:RouterOption,handler:RPCSpi.jigsaw.ware.UseWare){
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
    async route(matched:MatchInfo,ctx:RPCSpi.jigsaw.context.UseContext,next:RPCSpi.jigsaw.ware.NextFunction) : Promise<void>{
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
