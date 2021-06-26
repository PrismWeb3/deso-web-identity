/*
Note to reader.. logic inside this library is fairly complex due to
the terrible nature of the identity library.. I suggest you read the
docs thuroughly before reading through the src and/or making a pull
request.
(https://docs.bitclout.com/devs/identity-api)

This library runs off a request and response handler, as well as
global promises created from classes/Router.js . Router.js creates a
resolve and reject value 9which can be found scattered across this
library, so that a response is always returned to the same caller function.

The UUID dependency is used for creating unique ID's when sending
requests to the iframe. These ID's are kept track of through the
variable this.outgoing
*/

/*
Dependecies:
- Router: custom class meant to handle all request queueing in library
- uuidv4 (https://github.com/uuidjs/uuid): generates UUID
*/
import { Router } from "./classes/Router.js";
import { v4 as uuidv4 } from "./deps/uuid/index.js";

class Identity {
  identityWindow = null;
  iframe = null;
  initialized = false;
  signingReady = false;
  signingQueue = [];
  outgoing = {};
  config = {
    requestRoute: null,
    logs: false,
    accessLevel: 3,
    approvalTime: 10,
  };
  router = null;
  windowTimeout = null;

  // starts initialize phase
  initialize() {
    this.identityWindow = window.open(
      `https://identity.bitclout.com/log-in?accessLevelRequest=${this.config.accessLevel}`,
    );
  }

  // creates initial iframe for signing
  get createSigningFrame() {
    const i = document.createElement("iframe");
    i.style.height = "100vh";
    i.style.width = "100vw";
    i.style.display = "none";
    i.src = "https://identity.bitclout.com/embed";
    document.body.appendChild(i);
    return i;
  }

  // handles all message requests from window(s)
  handleRequest(msg) {
    const {
      data: { id, method, service, payload },
    } = msg;

    switch (method) {
      /*
      Initializes both window and iframe
      (https://docs.bitclout.com/devs/identity-api#initialize)
      */
      case "initialize": {
        if (!this.initialized) {
          this.initialized = true;
          this.iframe = this.createSigningFrame;
        }
        this.respond(msg.source, {
          id,
          service,
        });
        this.log(`Initialization payload sent`);
        break;
      }
      /*
      handles login event from window for both auth or hex signing
      (https://docs.bitclout.com/devs/identity-api#login)
      */
      case "login": {
        // checks if a signed transaction was included
        const outgoing = this.outgoing["windowSign"];
        if (payload.signedTransactionHex) {
          clearTimeout(this.windowTimeout);
          this.submitTransaction(payload.signedTransactionHex);
          outgoing.resolve(outgoing.payload);
          delete this.outgoing["windowSign"];
          this.identityWindow.close();
          this.identityWindow = null;
        } else if (!payload.publicKeyAdded) {
          clearTimeout(this.windowTimeout);
          this.log("Transaction rejected");
          outgoing.reject(this.errorMessage("DENIED"));
          delete this.outgoing["windowSign"];
          this.identityWindow.close();
          this.identityWindow = null;
          // if no signed transaction, assume regular login
        } else {
          // store information for future logins
          localStorage.setItem("users", JSON.stringify(payload));
          this.log(
            `Added login data to local cache\nLocal storage name: users\nData contained: ${
              localStorage.getItem("users")
            }`,
          );
          // close window, as no longer needed
          this.identityWindow.close();
          this.identityWindow = null;
          this.log("Closed identity window");
          this.contactFrame(uuidv4(), {
            service,
            method: "info",
          });
        }
        break;
      }
      case "storageGranted": {
        this.log("Storage access has been granted to the iframe");
        /* Added code to handle this edge case*/
        break;
      }
    }
  }

  // handles all message responses from iframe
  handleResponse(msg) {
    const {
      data: { id, payload },
    } = msg;
    const outgoing = this.outgoing[id];
    this.log(`Response type: ${outgoing.method}`);
    switch (outgoing.method) {
      case "info": {
        if (!payload.hasStorageAccess) {
          this.log("Browser does not have storage access yet");
          // fullscreen iframe
        } else if (!payload.browserSupported) {
          this.log("Browser not supported");
          window.alert(
            "Browser appears not to be supported for signing of transactions or decryption of messages. Please check that browser cookies are enabled.",
          );
        } else {
          this.log(
            "Passed browser verification. Signing and decryption are available",
          );
          /* Added code to handle start of transaction signing and sending*/
          this.signingReady = true;
          this.router.next();
        }
        break;
      }
      case "sign": {
        this.log(outgoing.payload.transactionHex);
        if (payload["approvalRequired"]) {
          this.log("Approval is required for signing");
          if (this.identityWindow) {
            this.identityWindow.close();
            clearTimeout(this.windowTimeout);
            this.outgoing["windowSign"].reject(
              this.errorMessage("NEW_APPROVAL_WINDOW"),
            );
          }
          this.outgoing["windowSign"] = outgoing;
          this.identityWindow = window.open(
            `https://identity.bitclout.com/approve?tx=${outgoing.payload.transactionHex}`,
          );
          this.windowTimeout = setTimeout(() => {
            outgoing.reject(this.errorMessage("APPROVAL_TIME_REACHED"));
            this.identityWindow.close();
            this.identityWindow = null;
          }, this.config.approvalTime * 1000);
        } else {
          this.submitTransaction(payload.signedTransactionHex);
          outgoing.resolve(outgoing.payload);
        }
        break;
      }
    }
  }

  // signs and submits transaction
  async signTransaction(transaction, resolve, reject) {
    let locals = JSON.parse(localStorage.getItem("users"));
    locals = locals.users[locals.publicKeyAdded];
    this.contactFrame(
      uuidv4(),
      {
        service: "identity",
        method: "sign",
        payload: {
          accessLevel: locals["accessLevel"],
          accessLevelHmac: locals["accessLevelHmac"],
          encryptedSeedHex: locals["encryptedSeedHex"],
          transactionHex: transaction["TransactionHex"],
        },
      },
      resolve,
      reject,
    );
  }

  async submitTransaction(transactionHex) {
    return await this.router.post("submit-transaction", {
      "TransactionHex": transactionHex,
    });
  }

  errorMessage(reason) {
    return {
      reason,
    };
  }
  // queueing system for handling post submits one by one
  contactFrame(id, payload, resolve = null, reject = null) {
    this.outgoing[id] = {
      resolve: resolve,
      reject: reject,
      ...payload,
    };
    this.iframe.contentWindow.postMessage({
      id,
      ...payload,
    }, "*");
  }
  respond(window, payload) {
    window.postMessage(payload, "*");
  }
  log(message) {
    if (!this.config.logs) return;
    if (typeof message === "object") message = JSON.stringify(message, null, 2);
    console.warn(`LOG | ${message}`);
  }

  constructor(config) {
    this.config = Object.assign({}, this.config, config);
    this.router = new Router(this);
    this.log(`Generating test UUID: ${uuidv4()}`);
    window.addEventListener("message", (msg) => {
      // basic checks to make sure window calls are accurate
      if (!msg.data) return;
      if (msg.data.service !== "identity") return;

      // message is request
      if (msg.data.method) {
        this.log(`Request recieved as type: ${msg.data.method}`);
        this.handleRequest(msg);
      } // message is response
      else {
        this.log(`Response recieved from id: ${msg.data.id}`);
        this.handleResponse(msg);
      }
    });
  }
}

export { Identity };
