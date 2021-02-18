const { KoaServerApp, DefaultKoaAppConfig } = require("../dist");
const CLI = require("config-style-cli");

CLI([ KoaServerApp, DefaultKoaAppConfig ]);
