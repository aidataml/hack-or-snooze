"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/* ********************** added functions ***************************
/** Add HTML for a story delete button */

function getDeleteBtnHTML() {
  return `<span class="trash-can"> <i class="fas fa-trash-alt"></i> </span>`;
}

/** Handle deleting a story. */

async function deleteStory(evt) {
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  // Show the updated story list after deletion
  await putUserStoriesOnPage();
}

$myStories.on("click", ".trash-can", deleteStory);
/** Make HTML star for favorite stories */

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `<span class="star"> <i class="${starType} fa-star"></i> </span>`;
}

/** Handle submitting the form to add a new story. */

async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();

  // Create variables for data enter in form for adding a new story. 
  const title = $("#add-title").val();
  const url = $("#add-url").val();
  const author = $("#add-author").val();
  const username = currentUser.username
  const storyData = { title, url, author, username };

  const story = await storyList.addStory(currentUser, storyData);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story); // Add new story to the end of stories list.

  // Hide and resent the form after submission.
  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
}

$submitForm.on("submit", submitNewStory);

/******************************************************************************
 * Functionality for list of user's personal stories
 */

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $myStories.empty();

  if (currentUser.myStories.length === 0) {
    $myStories.append("<h5>No stories posted by user.</h5>");
  } else {
    // Loop through all of the current user's stories and generate HTML for them
    for (let story of currentUser.myStories) {
      let $story = generateStoryMarkup(story, true);
      $myStories.append($story);
    }
  }

  $myStories.show();
}

/******************************************************************************
 * Functionality for favorites list.
 */

/** Add the list of favorites to the page. */

function putFavoritesListOnPage() {
  console.debug("putFavoritesListOnPage");

  $favoriteStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoriteStories.append("<h5>No user favorites added.</h5>");
  } else {
    // Loop through all of user'ss favorites and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoriteStories.append($story);
    }
  }

  $favoriteStories.show();
}

/** Handle adding or removing favorite status for a story. */

async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite");

  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  // Check if the story is already favorited if a star exists.
  if ($tgt.hasClass("fas")) {
    // If the story is currently a favorite, remove from user's fav list and change the star.
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    // If the story is not currently a favorite, add a star and add it to the favorite's list.
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleStoryFavorite);
