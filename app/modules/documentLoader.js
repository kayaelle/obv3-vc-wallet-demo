const didKey = require('@digitalcredentials/did-method-key');
const { Ed25519VerificationKey2020 } = require('@digitalcredentials/ed25519-verification-key-2020');
const { X25519KeyAgreementKey2020 } = require('@digitalcredentials/x25519-key-agreement-key-2020');
const { CachedResolver } = require('@digitalcredentials/did-io');
const didContext = require('did-context');
const dccCtx = require('@digitalcredentials/dcc-context');
const ed25519Ctx = require('ed25519-signature-2020-context');
const x25519 = require('x25519-key-agreement-2020-context');
const cred = require('credentials-context');
const { JsonLdDocumentLoader } = require('jsonld-document-loader');

const {
  contexts: credentialsContext,
  constants: {
    CREDENTIALS_CONTEXT_V1_URL,
  },
} = cred;

const didKeyDriver = didKey.driver();
const resolver = new CachedResolver();
resolver.use(didKeyDriver);

module.exports = { securityLoader };

function securityLoader(clrContext,obContext) {

  const {contexts: credentialsContexts, constants: {CREDENTIALS_CONTEXT_V1_URL}} = cred;

  const loader = new JsonLdDocumentLoader();

  loader.addStatic(
    ed25519Ctx.constants.CONTEXT_URL,
    ed25519Ctx.contexts.get(ed25519Ctx.constants.CONTEXT_URL),
  );

  console.log(loader);

  loader.addStatic(
    x25519.constants.CONTEXT_URL,
    x25519.contexts.get(x25519.constants.CONTEXT_URL),
  );

  loader.addStatic(
    didContext.constants.DID_CONTEXT_URL,
    didContext.contexts.get(didContext.constants.DID_CONTEXT_URL),
  );

  loader.addStatic(
    CREDENTIALS_CONTEXT_V1_URL,
    credentialsContext.get(CREDENTIALS_CONTEXT_V1_URL),
  );

  /***
  * Loading in DCC context because learner wallet doesn't accept open badges quite yet.
  * Bote that the temp badgefile ./public/badge-dcc-combo-assertion-example.json contains 
  * hardcoded values in the context to accomodate an Open Badges display for demo purposes.
  * Next step is to create an NPM package for Open Badges to use in the demo
  * */

  loader.addStatic(dccCtx.CONTEXT_URL_V1, dccCtx.CONTEXT_V1);

  loader.setDidResolver(resolver);

  return(loader);
}