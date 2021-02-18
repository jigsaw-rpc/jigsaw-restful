import { RPC, RPCSpi } from "jigsaw-rpc";
import Koa from "koa";
import KoaAdapter from "./KoaAdapter";

export interface KoaAppConfig{
    bind_port : number,
    registry : string;
};
export const DefaultKoaAppConfig : KoaAppConfig = {
    bind_port : 1900,
    registry : "jigsaw://127.0.0.1/"
}

export class KoaServerApp{
    private koa? : Koa;
    private adapter? : KoaAdapter;
    private jigsaw? : RPCSpi.jigsaw.IJigsaw;
    private config : KoaAppConfig;
    constructor(config : KoaAppConfig){
        this.config = config;
    }
    start(){
        this.jigsaw = RPC.GetJigsaw({registry:this.config.registry});
        this.adapter = new KoaAdapter(this.jigsaw);

        this.koa = new Koa();
        this.koa.use(this.adapter.koa());
        this.koa.listen(this.config.bind_port);
    }
}
