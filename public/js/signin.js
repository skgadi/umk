function getUiConfig() {
	return {
		'callbacks': {
			// Called when the user has been successfully signed in.
			'signInSuccessWithAuthResult': function (authResult, redirectUrl) {
				if (authResult.user) {
					handleSignedInUser(authResult.user);
				}
				// Do not redirect.
				return false;
			}
		},
		// Opens IDP Providers sign-in flow in a popup.
		'signInFlow': 'popup',
		'signInOptions': [
			// TODO(developer): Remove the providers you don't need for your app.
			{
				provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
				// Required to enable this provider in One-Tap Sign-up.
				authMethod: 'https://accounts.google.com',
				// Required to enable ID token credentials for this provider.
				clientId: CLIENT_ID
			}, {
				provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
				// Whether the display name should be displayed in Sign Up page.
				requireDisplayName: true,
				signInMethod: "password"
			}, {
				provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
				recaptchaParameters: {
					size: 'invisible'
				}
			},
		],
		// Terms of service url.
		'tosUrl': 'https://www.google.com',
		// Privacy policy url.
		'privacyPolicyUrl': 'https://www.google.com',
		'credentialHelper': CLIENT_ID && CLIENT_ID != 'YOUR_OAUTH_CLIENT_ID' ?
		firebaseui.auth.CredentialHelper.GOOGLE_YOLO :
		firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM
	};
}

var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.disableAutoSignIn();

var handleSignedInUser = function (user) {
	if (findGetParameter("redirect") === 'platform')
		window.location.replace('/platform');
	else
		window.location.replace('/admin');

};

var handleSignedOutUser = function () {
	document.getElementById('user-signed-out').style.display = 'block';
	ui.start('#firebaseui-container', getUiConfig());
};

firebase.auth().onAuthStateChanged(function (user) {
	document.getElementById('loading').style.display = 'none';
	document.getElementById('loaded').style.display = 'block';
	user ? handleSignedInUser(user) : handleSignedOutUser();
});
