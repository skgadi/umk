// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', {
  signInOptions: [
    // List of OAuth providers supported.
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  // Other config options...
});
firebase.auth().languageCode = 'es';

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    console.log(displayName);
    // ...
    document.getElementById("signed-out").style.display = "none";
    document.getElementById("signed-in").style.display = "block";
  } else {
    document.getElementById("signed-out").style.display = "block";
    document.getElementById("signed-in").style.display = "none";
    // User is signed out.
    // ...
  }
});