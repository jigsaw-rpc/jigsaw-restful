import UrlPattern from "url-pattern";
import Querystring from "querystring";

class URLParser{
    private parser : UrlPattern;
    constructor(url:string){
        this.parser = new UrlPattern(/\/v([0-9]{1,})(\/[a-zA-Z\/]*)\/([0-9]*)\?{0,1}(.*)/,["ver","method","id","rawquery"]);

    }
    parse(url:string){
        let parsed = this.parser.match(url);

        if(parsed == null)
            throw new Error("this url is not correct format");
        let query = Querystring.parse(parsed.rawquery);
        
        if(parsed.id.length == 0)
            parsed.id = 0;

        parsed.id = parseInt(parsed.id);

        parsed.ver = parseInt(parsed.ver);
        parsed.query = query;
        
        return parsed;
    }
}

export default URLParser;
