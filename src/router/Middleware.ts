import Router from "./Router";
import Path from "./Path";
import assert from "assert";
import VerbNotImplError from "../apierror/VerbNotImplError";
import APINotFoundError from "../apierror/APINotFoundError";
import RouterOption from "./RouterOption";
import RequestFormatError from "../apierror/RequestFormatError";
import WorkFlow from "./WorkFlow";

import { RPCSpi } from "jigsaw-rpc";

function getProperty(obj:any,name:string,def:any = {}){
    if(!obj[name])
        obj[name] = def;
    else
        def = obj[name];
    return def;
}

class Middleware{
    private routers : Array<Router> = [];
    private strict : boolean;
    private workflow = new Map<string,WorkFlow<RPCSpi.jigsaw.context.UseContext>>();

    constructor(strict:boolean = true){
        this.strict = strict;
    }
    public getAPIMap(){
        
        let apimap : any = {};
        for(let router of this.routers){
            let option =router.getOption();
            if(!option.public)
                continue;

            let resurl = router.getPattern();
            let verb = router.getVerb();

            let mapobj :any = getProperty(apimap,resurl);            
            getProperty(mapobj,"return",option.return || "any");
            
            let verbs = getProperty(mapobj,"method",{});
            
            let paramobj :any = getProperty(verbs,verb);

            for(let i in option.vali)
                getProperty(paramobj,i,option.vali[i]);            

            let descs = getProperty(mapobj,"desc",{});
            getProperty(descs,verb,option.desc);
                
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

        this.getWorkFlow(verb,pattern).pushWork(handler);
    }
    private getWorkFlow(verb:string,pattern:string){
        let key = `[${verb}][${pattern}]`;

        if(!this.workflow.has(key))
            this.workflow.set(key,new WorkFlow());
        return this.workflow.get(key) as WorkFlow<RPCSpi.jigsaw.context.UseContext>;
    }
    private async handle(ctx:RPCSpi.jigsaw.context.UseContext,next:RPCSpi.jigsaw.ware.NextFunction) : Promise<void>{
        await next();

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
                    
                    await router.route(matched,ctx,this.getWorkFlow(path.verb,router.getPattern()));
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
