import {RPCSpi} from "jigsaw-rpc";
import APIError from "../apierror/APIError";

class JigsawInvoker{
    private jigsaw:RPCSpi.jigsaw.IJigsaw;
    constructor(jigsaw:RPCSpi.jigsaw.IJigsaw){
        this.jigsaw = jigsaw;
    }
    async invoke(reg_path:string,data:any){
        try{
            let ret = await this.jigsaw.send(reg_path,data);
            return ret;
        }catch(err){
            
            if(err instanceof APIError){
                let apierr = err as APIError;
                throw apierr;
            }else if(err.name=="APIError"){
                let apierr = APIError.parse(err.parsing_str);
                throw apierr;
            }else if(err.name=="JGError"){
                let jgerr = err as RPCSpi.error.JGError;
                throw APIError.fromJGError(jgerr);
            }else
                throw APIError.fromError(err);
        }

    }
}

export default JigsawInvoker;
