import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp(functions.config().firebase);

export const NewUserSignUp = functions.auth.user().onCreate(async function(user, context) {
    if (user.photoURL === null) {
        await admin.auth().updateUser(user.uid, {
            "photoURL": "https://uyamak.skgadi.com/images/default-user-pic.png"
        });
    }
    return null;
});
export const validateUserSession = functions.https.onCall(async (data, context)=>{
    if (context.auth) {
        return {"isSuccess": true};
    } else return {"isSuccess": false};
});