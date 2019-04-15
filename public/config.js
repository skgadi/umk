/*
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */

var config = {
    apiKey: "AIzaSyDA_s8aENGfVV22XhPG6RyMl2XL1zeWGiQ",
    authDomain: "uyamak-dcc7f.firebaseapp.com",
    databaseURL: "https://uyamak-dcc7f.firebaseio.com",
    projectId: "uyamak-dcc7f",
    storageBucket: "uyamak-dcc7f.appspot.com",
    messagingSenderId: "594566257848"
  };
firebase.initializeApp(config);

// Google OAuth Client ID, needed to support One-tap sign-up.
// Set to null if One-tap sign-up is not supported.
var CLIENT_ID = '594566257848-rp12j70ts4jq7ved9gfdmdt2gmadqvrc.apps.googleusercontent.com';
