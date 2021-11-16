import { Identity } from "../../module.js";
const ident = new Identity({
  logs: true,
  // The requestRoute should be changed to a custom node URL or Proxy URL; Using bitclout.com will result in a CORS error
  requestRoute: "https://bitclout.com/",
  accessLevel: 3,
});
ident.users.then((users) => {
  console.log(users);
});
ident;
function makeTestPost() {
  const activeUser = JSON.parse(localStorage.getItem("users")).publicKeyAdded;
  ident.router.submit("submit-post", {
    UpdaterPublicKeyBase58Check: activeUser,
    BodyObj: {
      Body: "Test post",
      ImageURLs: [],
    },
    IsHidden: false,
    MinFeeRateNanosPerKB: 1000,
  }).then((res) => {
    console.log(res);
  }).catch((err) => {
    console.log(`Transaction failed for reason: ${err.reason}`);
  });
}

window.Identity = ident;
window.makeTestPost = makeTestPost;
