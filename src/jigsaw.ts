import "jigsaw-rpc";
declare module "jigsaw-rpc" {
    namespace BaseContext{
        interface UseBaseContext{
            url:string,
            apiver:string,
            resid:string
        }    

    }
}