const express = require('express'); //Import the express dependency
const bodyParser = require('body-parser');
const app = express();              //Instantiate an express app, the main work horse of this server
const port = 3000;                  //Save the port number where your server will be listening
const http = require("http");
const fs = require('fs');
const path = require('path');

const vc = require('@digitalcredentials/vc');
const { Ed25519VerificationKey2020 } = require('@digitalcredentials/ed25519-verification-key-2020');
const { Ed25519Signature2020 } = require('@digitalcredentials/ed25519-signature-2020');
const suite = new Ed25519Signature2020();

const { securityLoader } = require('./modules/documentLoader');

app.use(express.static('public'));

app.use(bodyParser.json());

// Demo Landing Page
app.get('/index', (req, res) => {  
    res.sendFile('index.html', {root: __dirname}); 
});

// OBv3 Demo Issuer
app.get('/basic-obv3', (req, res) => {  
    res.sendFile('basic-obv3.html', {root: __dirname}); 
});

// Response to wallet with demo badge
app.post('/issue', function (req, res) {

  // example.wallet.vp-request.txt is an example of what the wallet returns to the badge issuer after the oauth is successful

console.log("monkey");

  let presentation = req.body;

  //holder is the learner's DID:key
  const holder = req.body.holder;
  
  var verificationMethod = req.body.proof.verificationMethod;
  var challenge = req.body.proof.challenge;

  async function loadAndVerify() {

  // Loads the needed context files into memory

  let documentLoader = await new securityLoader().build();

  //Verifies VP that the wallet sends that contains the lerner DID:key and is signed by the private key associated with that DID.

  console.log("presentation"+presentation);

  console.log("challenge"+challenge);

  console.log("suite"+suite);

  console.log("documentLoader"+JSON.stringify(documentLoader));

  let verify = await vc.verify({presentation, challenge, suite, documentLoader});

  console.log("verify"+JSON.stringify(verify));


  // If the VC passes verification, load the badge data and assign the learner's DID:key to the credential.subject.id 

    if (verify.presentationResult.verified === true) {
      //badge data loaded from /./public/demo-obv3.json

      console.log("HEY");

      let badgeData = await fs.readFileSync(path.resolve(__dirname+'/public/', 'demo-obv3.json'));
      let credential = JSON.parse(badgeData);

      console.log("Badge "+JSON.stringify(credential), null, 2);
      credential.credentialSubject.id = holder;

      // Retreive keypair and sign VC using Ed25519Signature2020

      /**
      * keypair generated using ./modules/generate-issuer-did-key-utility.js
      * ./demo-keypairs.json included for this demo but DO NOT EXPOSE PRIVATE KEYS
      * IN YOUR REPO!
      * */

      let keypairData = await fs.readFileSync(path.resolve(__dirname+'/demo-keypairs.json'));
      let parsedKeypairData = JSON.parse(keypairData);
      let keyPair = await Ed25519VerificationKey2020.from(parsedKeypairData);

      let suite = await new Ed25519Signature2020({key:keyPair});

      let verifiableCredential =  await vc.issue({credential, suite, documentLoader});

      console.log("VC: "+ JSON.stringify(verifiableCredential)+"\n\n");

      return verifiableCredential;
    }
    else {
      //Respond that VP from wallet is not verified
      res.status(400);
      res.send("Unable to verify presentation.");
      res.end;
    }
  }

  async function present(verifiableCredential) {

    /** Not actually wrapping in a VP yet because of a bug. 
    * Returning VC instead but VC should be wrapped in an unsigned VP.
    * See issue: https://github.com/digitalcredentials/learner-credential-wallet/issues/162
    **/

    // let verifiablePresentation = vc.createPresentation({verifiableCredential});

    //  console.log("VP: "+ JSON.stringify(presentation)+"\n\n");

    return verifiableCredential;
  };


  // start here
  loadAndVerify()
    .then(verifiableCredential => present(verifiableCredential))
    .then(verifiablePresentation => {
      //console.log("Got the final result: "+ JSON.stringify(verifiablePresentation));
      res.status(200);
      res.send(verifiablePresentation);
      res.end;
  });
});

app.listen(port, () => {           
    console.log(`Now listening on port ${port}`); 
});

