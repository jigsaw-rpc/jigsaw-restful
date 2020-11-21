import UrlPattern from "url-pattern";
import Querystring from "querystring";

class URLParser{
    private parsers : Array<UrlPattern> = [];
    constructor(url:string){
        this.parsers.push(new UrlPattern(/^\/v([0-9]{1,})((\/[a-zA-Z]+){1,})\/{0,1}([0-9]*)$/,["ver","method","_","id"]));
        
    }
    private match(url:string){
        for(let parser of this.parsers){
            let parsed = parser.match(url);
            if(parsed == null)
                continue;
            else
                return parsed;
        }

        throw new Error("not matched url patterns");
    }
    parse(url:string){
        
        let parsed = this.match(url);

        if(parsed == null)
            throw new Error("this url is not correct format");

        if(parsed.id.length == 0)
            parsed.id = 0;

        parsed.id = parseInt(parsed.id);
        parsed.ver = parseInt(parsed.ver);
        
        return parsed;
    }
}

export default URLParser;
