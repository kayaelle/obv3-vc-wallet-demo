# Open Badges v3.0 to Digital Credentials Consortium (DCC) Learner Wallet Demo

This code contains a simplified demonstration of how to issue an Open Badge to a Verifiable Credential wallet, specifically the [DCC Learner Wallet](https://github.com/digitalcredentials/learner-credential-wallet). Other wallets may be added at another time. 

This working demo assumes that the Open Badge issuing service is an openid provider, that the learner has an active account with the issuer, and that the badge was originally issued to the email address associated with that account. Although this is a working demo, it is intended to demonstrate a potential issuing flow between an issuer and this specific wallet. It is not a code library just an example to increase understanding. 

#### Environment requirements for badge issuing app:

* Run at localhost:5000
* Tested using Node v16.0.0
* Xcode
* iOS Simulator (The demo should run on the android simulator too but hasn't been tested yet)
* [This fork of the DCC Wallet](https://github.com/kayaelle/learner-credential-wallet)
* Notice npm modules listed in package.json several of which handle the verification and signing of VCs

Why use this fork of the wallet for this demo? This fork contains some code changes that will display a credential like an Open Badge. The DCC wallet will do this soon. Also, this fork has the demo app registered with a DID:key for the Issuer and the url localhost:5000 so that it knows who this issuer is. 

<em>**iOS simulator** note: To load the simulator app, follow the instructions in the readme of the wallet. Before running "npm run ios", ensure that Xcode is running first.</em>

index.html displays the badge at localhost:5000. It looks like it's from Badgr because I re-used quite a bit of their badge award page src. The share dialog provides a deep_link to the Learner Wallet. To use, open localhost:5000 in the simulator's Safari and click on the link. You should get a message asking if you'd like to open the Learner Wallet.

To get started, run `npm install` in the project folder. index.js is where the badge is issued. To run this and the index.html (localhost:5000), navigate to /app and run `node index.js`. Comments in the index.js explain how it works in more detail.

This demo uses a mock Oauth2/OpenId service provided by MockLab (https://www.mocklab.io/docs/oauth2-mock/) to mock an issuer platform oauth process and does not assess the bearer token posted after authentication to map the DID to the learner email address. This should be done by issuers and could be added to this demo later. One way to do this is to use mock-oauth2-server (https://github.com/navikt/mock-oauth2-server) instead which appears to provide a way to do this.  


This [Credential Request Flow document](https://github.com/digitalcredentials/docs/blob/main/request/credential_request.md) explains the flow from the recipient's perspective.

#### Demo Video:

[Download Demo Video](https://github.com/kayaelle/obv3-vc-wallet-demo/blob/master/Demo-VC-Open-Badge-to-DCC-Learner-Wallet.mp4)


 # Notes

* This demo isn't using an Open Badge context yet but that is coming soon. In the short-term, Open Badge properties are linked to directly in the context of the example badge data.

* Submitted issue for vc wrapped in a vc not working properly. See issue: https://github.com/digitalcredentials/learner-credential-wallet/issues/162

* Wallet may not accept svg and svg is a valid badge image format.

* Wallet displays person's name but Open Badges doesn't do that. Should be discussed at Open Badges. Open Badges has three potential recipient values: email, telephone, and url. These values can be hashed. 
