import { Identity } from "../../module.js";
const ident = new Identity({
  logs: true,
  requestRoute: "http://localhost:8079/https://bitclout.com/",
  accessLevel: 2,
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
