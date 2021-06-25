import { Identity } from "../../module.js";
const ident = new Identity({
  logs: true,
  requestRoute: "http://localhost:8079/https://bitclout.com/",
});

window.Identity = ident;
