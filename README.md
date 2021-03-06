# Jigsaw-Restful

jigsaw-restful is an API framework written in TypeScript, it design stable APIs for Jigsaws.

## Install

in a npm project folder, run:
```
npm install jigsaw-restful --save
```

## Easy-to-start Example

api.js
```js
const { RPC } = require("jigsaw-rpc");
const Restful = require("jigsaw-restful");
const router = new Restful.Router();

router.get("/v1/test/res",{
    public:true,
    desc:"This API can get result",
    return:"string",
    vali:{
        str:"required"
    }
},async (ctx,next)=>{
    ctx.result.hello = ctx.data.str;
    await next();
});

let jg = RPC.GetJigsaw({name:"testjigsaw"});
jg.use(router.router());

```

then try this:

app.js
```js
const { RPC } = require("jigsaw-rpc");
const Restful = require("jigsaw-restful");

let invoker = RPC.GetJigsaw();

invoker.send("test:<get>/v1/test/res",{
    str:"world!"
}).then(console.log);

// will get a "hello":"world";
```

## Advanced Example

endpoint.js
```js

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

You will get the HTTP Response:

```json
{
	"error": false,
	"code": 0,
	"httpcode": 200,
	"message": "API invoked successfully",
	"detail": "",
	"type": "object",
	"data": {"hello":"world"}
}
```

# GET = POST

some HTTP-Client like ``axios`` don't support GET request with a body, so in Jigsaw-Restful design, 

GET method is same as POST method to get a information of resource.
PUT method is used to create a resource ,
PATCH method is used to modify a resource ,
and DELETE method is used to delete a resource.

# API Map

you can review all of apis you provide easily by:
```js
jg.use(router.secretAPIMap());
```

the complete api.js is like:
```js
const { RPC } = require("jigsaw-rpc");
const Restful = require("jigsaw-restful");
const router = new Restful.Router();

router.get("/v1/test/res",{
    public:true,
    desc:"This API can get result",
    return:"string",
    vali:{
        str:"required"
    }
},async (ctx,next)=>{
    ctx.result.hello = ctx.data.str;
    await next();
});

let jg = RPC.GetJigsaw({name:"testjigsaw"});
jg.use(router.secretAPIMap());
jg.use(router.router());
```

if you have already started the endpoint.js

you can access the API Map by HTTP Client (eg. browser).

```
GET http://127.0.0.1/apimap/?path=testjigsaw
```

and get this response:

```json
{
	"error": true,
	"code": 9005,
	"httpcode": 400,
	"message": "Your request format isn't correct.",
	"detail": {
		"/v1/test/res": {
			"desc": {
				"get": "This API can get result",
				"post": "This API can get result"
			},
			"return": "string",
			"method": {
				"get": {
					"str": "required"
				},
				"post": {
					"str": "required"
				}
			}
		}
	},
	"type": "object",
	"data": null
}
```