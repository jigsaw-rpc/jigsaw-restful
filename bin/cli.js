
const CLI = require("config-style-cli");
const { KoaServerApp, DefaultKoaAppConfig } = require("../lib/index");

CLI([
    KoaServerApp,
    DefaultKoaAppConfig
]);
