# Jigsaw-Restful

jigsaw-restful is an API framework written in TypeScript, it design stable APIs for Jigsaws.

## Install

in a npm project folder, run:
```
npm install jigsaw-restful --save
```

## Easy-to-start Example

api.js
```
const { RPC } = require("jigsaw-rpc");
const Restful = require("jigsaw-restful");
const router = new Restful.Router();

router.get("/v1/test/res",{
    public:true
    vali:{
        str:"required"
    }
},async (ctx,next)=>{
    ctx.result.yourdata = ctx.data;
    ctx.result.method = "get"
    ctx.result.hello = ctx.data.str;
    await next();
});

router.post("/v1/test/res",{
    public:true,
    vali:{
        testdata:"required"
    }
},async (ctx,next)=>{
    ctx.result.yourdata = ctx.testdata;
    ctx.result.method = "post";
    await next();
});

let jg = RPC.GetJigsaw({name:"testjigsaw"});
jg.use(router.router());

```

then try this:

app.js
```
const { RPC } = require("jigsaw-rpc");
const Restful = require("jigsaw-restful");

let invoker = RPC.GetJigsaw();
invoker.post(Restful.PostHandler);

invoker.send("test:<get>/v1/test/res",{
    str:"world!"
}).then(console.log);

// will get a "hello":"world";
```

## Advanced Example

endpoint.js
```

let adapter = new Restful.KoaAdapter();

let koa = new Koa();
koa.use(adapter.koa());
koa.listen(80);

```

then try access by HTTP client:


```
GET http://127.0.0.1/v1/test/res?path=testjigsaw
body: {str:"world!"}
```

```
POST http://127.0.0.1/v1/test/res?path=testjigsaw
body: {testdata:"doing test!"}
```


