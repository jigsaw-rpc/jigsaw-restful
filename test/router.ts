import { Router,KoaAdapter } from "../src";
import {RPC} from "jigsaw-rpc";

describe("Base Tests",function(){
    it("should be routing correctly 1",(done)=>{
        let router = new Router();
        let count = 0;
        router.get("/v1/test/res",{
            public:true,
            desc:"",
            return:"",
            vali:{}
        },async (ctx:any,next:any)=>{
               if(++count==3)done();
            await next();
        });
        router.delete("/v1/test/res",{
            public:true,
            desc:"",
            return:"",
            vali:{}
        },async (ctx:any,next:any)=>{
            if(++count==3)done();
            await next();
        });
        router.put("/v1/test/res",{
            public:true,
            desc:"",
            return:"",
            vali:{}
        },async (ctx:any,next:any)=>{
            if(++count==3)done();
            await next();
        });
        router.router()({
            method:"<get>/v1/test/res"
        } as any,async()=>{

        });
        router.router()({
            method:"<delete>/v1/test/res"
        } as any,async()=>{

        });
        router.router()({
            method:"<put>/v1/test/res"
        } as any,async()=>{

        });
    });
    it("should be routing correctly 2",(done)=>{
        let router = new Router();
        router.get("/v1/test/res",{
            public:true,
            desc:"",
            return:"",
            vali:{}
        },async (ctx,next)=>{
            if(ctx.resid=="a-b-c")
                done();
        });

        router.router()({
            method:"<get>/v1/test/res/[a-b-c]"
        } as any,async()=>{
            
        });

    });
    it("should throw error when router middleware throw error inner",async ()=>{
        let router = new Router();
        router.get("/v1/test/res",{
            public:true,
            desc:"",
            return:"",
            vali:{}
        },async (ctx:any,next:any)=>{
            throw new Error();
        });
        
        let hasError = false;

        try{
            await router.router()({
                method:"<get>/v1/test/res/{a-b-c}"
            } as any,async()=>{
                
            });    
        }catch(err){
            hasError = true; 
        }  

        if(!hasError){
            throw new Error("should throw error")
        }
        
    });
    
})