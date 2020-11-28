import Router from "./Router";
import Path from "./Path";
import assert from "assert";
import VerbNotImplError from "../apierror/VerbNotImplError";
import APINotFoundError from "../apierror/APINotFoundError";
import RouterOption from "./RouterOption";
import RequestFormatError from "../apierror/RequestFormatError";
import { RPCSpi } from "jigsaw-rpc";

class Middleware{
    private routers : Array<Router> = [];
    private strict : boolean;
    constructor(strict:boolean = true){
        this.strict = strict;
    }
    public getAPIMap(){
        const getPrototype = (obj:any,name:string,def:any = {})=>{
            if(!obj[name])
                obj[name] = def;
            else
                def = obj[name];
            return def;
        }
        
        let apimap : any = {};
        for(let router of this.routers){
            let option =router.getOption();
            if(!option.public)
                continue;

            let resurl = router.getPattern();
            let verb = router.getVerb();

            let mapobj :any = getPrototype(apimap,resurl);            
            getPrototype(mapobj,"desc",option.desc || "");
            getPrototype(mapobj,"return",option.return || "any");
            
            let verbs = getPrototype(mapobj,"method",{});
            
            let paramobj :any = getPrototype(verbs,verb);

                
            for(let i in option.vali)
                getPrototype(paramobj,i,option.vali[i]);            
        };

        return apimap;
    }
    public router(){
        return this.handle.bind(this);
    }
    public get(pattern:string,option:RouterOption,handler:RPCSpi.jigsaw.ware.UseWare){
        return this.addRouter("get",pattern,option,handler);
    }
    public post(pattern:string,option:RouterOption,handler:RPCSpi.jigsaw.ware.UseWare){
        return this.addRouter("post",pattern,option,handler);
    }
    public put(pattern:string,option:RouterOption,handler:RPCSpi.jigsaw.ware.UseWare){
        return this.addRouter("put",pattern,option,handler);
    }
    public delete(pattern:string,option:RouterOption,handler:RPCSpi.jigsaw.ware.UseWare){
        return this.addRouter("delete",pattern,option,handler);
    }
    private addRouter(verb:string,pattern:string,option:RouterOption,handler:RPCSpi.jigsaw.ware.UseWare){
        let router = new Router(verb,pattern,option,handler);
        this.routers.push(router);
    }
    private async handle(ctx:RPCSpi.jigsaw.context.UseContext,next:RPCSpi.jigsaw.ware.NextFunction) : Promise<void>{
        
        assert(typeof(ctx.method)=="string","method must be specified");

        if(ctx.method == "<get>/")
            throw new RequestFormatError(this.getAPIMap());


        let UrlEverMatched = new Map<string,boolean>();
        let path = Path.parse(ctx.method);
            
        for(let router of this.routers){
            
            let matched = router.match(ctx.method);
            if(matched){
                if(!UrlEverMatched.has(path.url))
                    UrlEverMatched.set(path.url,false);

                if(router.getVerb() == path.verb){

                    UrlEverMatched.set(path.url,true);
                    await router.route(matched,ctx,next);
                }
                    
            }
        }

        if(UrlEverMatched.has(path.url) && UrlEverMatched.get(path.url) == false)
            throw new VerbNotImplError(path.verb);

        if(this.strict && !UrlEverMatched.has(path.url))
            throw new APINotFoundError();
    }
}

export default Middleware;
