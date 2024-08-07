"use strict";

const $body = $("body");

// So we don't have to keep re-finding things on page, find DOM elements once:

const $allStoriesList = $("#all-stories-list");
const $favoritedStories = $("#favorited-stories");
const $loginForm = $("#login-form");
const $navSubmitStory = $("#nav-submit-story");
const $navLogin = $("#nav-login");
const $navLogOut = $("#nav-logout");
const $navUserProfile = $("#nav-user-profile");
const $ownStories = $("#my-stories");
const $signupForm = $("#signup-form");
const $storiesContainer = $("#story-container")
const $storiesLists = $(".stories-list");
const $storiesLoadingMsg = $("#stories-loading-msg");
const $submitForm = $("#submit-form");
const $userProfile = $("#user-profile");


/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [
    $storiesLists,
    $submitForm,
    $loginForm,
    $signupForm,
    $userProfile
  ];
  components.forEach(c => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // If we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app
console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
$(start);