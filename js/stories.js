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
       <span class="star hidden"> <i class="fa-star far"> </i> </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);

}


/* check if story is in the favorite list, if so mark as favorited */

function checkIfFavorited() {
  let favIdArray = currentUser.favorites.map((story) => story.storyId);
  let allStories = $allStoriesList.children();
  for (let story of allStories) {
    if (favIdArray.includes(story.id)) {
      $(`#${story.id} span i`)[0].classList.remove("far");
      $(`#${story.id} span i`)[0].classList.add("fas");
    }
  }

}
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");
  if (currentUser) { $body.off("click", ".star", currentUser.addOrRemoveFavStory) };

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  if (currentUser) {
    $(".star").show();
    checkIfFavorited();
    $body.on("click", ".star", currentUser.addOrRemoveFavStory);
  };
  $allStoriesList.show();

}

/* get a list of stories according to favarite list from Server, generates their HTML, and puts on page.*/
function putFavStoriesOnPage() {
  $body.off("click", ".star", currentUser.addOrRemoveFavStory);

  console.debug("putFavStoriesOnPage");
  hidePageComponents();
  $favoriteStoriesList.empty();
  // no favorites message
  if (currentUser.favorites.length === 0) {
    $favoriteStoriesList.append("<h4>No favorites added!</h4>");
  }
  // loop through all of the favorites and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favoriteStoriesList.append($story);
  }
  // add stars to all favorites
  let favoriteStoriesStars = $("#favorite-stories-list .star i");
  for (let favStar of favoriteStoriesStars) {
    favStar.classList.remove("far");
    favStar.classList.add("fas");
  }
  $(".star").show();
  $favoriteStoriesList.show();
  $body.on("click", ".star", currentUser.addOrRemoveFavStory);
}

/** helper function to gather form input */
function gatherCreateStoryFormData() {
  return {
    author: $('#s-author').val(),
    title: $('#s-title').val(),
    url: $('#s-url').val()
  }
}

/** gather from data, add to the story list and update DOM*/

async function addNewStoryFromForm(evt) {
  evt.preventDefault();
  let formData = gatherCreateStoryFormData();
  $createStoryForm.trigger("reset");
  await storyList.addStory(currentUser, formData);
  $createStoryForm.hide();
  putStoriesOnPage();
}

$createStoryForm.on("submit", addNewStoryFromForm);
$navFavorite.on("click", putFavStoriesOnPage);

