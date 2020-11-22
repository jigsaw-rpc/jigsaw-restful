import assert from "assert";

class Path{
    public verb:string;
    public url:string;
    constructor(verb:string,url:string){
        this.verb = verb;
        this.url = url;
    }
    static parse(path:string){
        assert(path.startsWith("<"),"verb format is not correct");
        let right_char = path.indexOf(">");
        let verb = path.substring(1,right_char);
        let url = path.substring(right_char+1,path.length);
        return new Path(verb,url);
    }
}

export default Path;

