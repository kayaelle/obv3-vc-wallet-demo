

const { Ed25519VerificationKey2020 } = require('@digitalcredentials/ed25519-verification-key-2020');
const { Ed25519Signature2020 } = require('@digitalcredentials/ed25519-signature-2020');
const didKeyDriver = require('@digitalcredentials/did-method-key').driver();

 async function generateDID() {
   const {didDocument, keyPairs, methodFor} = await didKeyDriver.generate();

   console.log("didDoc: "+JSON.stringify(didDocument, null, 2));
   console.log(keyPairs);
 	return;
 }

 generateDID()