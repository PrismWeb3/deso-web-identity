import { Identity } from "../../module.js";
const ident = new Identity({
  logs: true,
  requestRoute: "http://localhost:8079/https://bitclout.com/",
});
const activeUser = JSON.parse(localStorage.getItem("users")).publicKeyAdded;
setTimeout(() => {
  ident.router.submit("submit-post", {
    UpdaterPublicKeyBase58Check: activeUser,
    BodyObj: {
      Body: "Test post using Identity library ;)",
      ImageURLs: [],
    },
    IsHidden: false,
    MinFeeRateNanosPerKB: 1000,
  });
}, 5000)

window.Identity = ident;
