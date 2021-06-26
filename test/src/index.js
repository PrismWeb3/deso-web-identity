import { Identity } from "../../module.js";
const ident = new Identity({
  logs: true,
  requestRoute: "http://localhost:8079/https://bitclout.com/",
  accessLevel: 2,
});
const activeUser = JSON.parse(localStorage.getItem("users")).publicKeyAdded;
function makeTestPost() {
  ident.router.submit("submit-post", {
    UpdaterPublicKeyBase58Check: activeUser,
    BodyObj: {
      Body: "This should be hidden",
      ImageURLs: [],
    },
    IsHidden: false,
    MinFeeRateNanosPerKB: 1000,
  }).then((res) => {
    console.log(response);
  }).catch((res) => {
    console.log(`Transaction failed for reason: ${res.reason}`);
  });
}

window.Identity = ident;
window.makeTestPost = makeTestPost;
