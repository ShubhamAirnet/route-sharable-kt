var admin = require("firebase-admin");

var serviceAccount = require("./boardthetrip-bc9f0-firebase-adminsdk-2oma4-531279e458.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://boardthetrip-bc9f0.appspot.com'

});


// Get Firestore and Storage instances
const db = admin.firestore();

module.exports = { db, admin };

