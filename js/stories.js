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

function checkIfFavorited(){
  
  let favIdArray = currentUser.favorites.map((story) => story.storyId);
  let allStories = $allStoriesList.children();

  for(let story of allStories){
    if(favIdArray.includes(story.id)){
      $(`#${story.id} span i`)[0].classList.toggle("far", false);
      $(`#${story.id} span i`)[0].classList.add("fas");
    }
  }

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
  debugger;
  checkIfFavorited();
  
  if (currentUser) {
    $(".star").show()
  };

  $allStoriesList.show();
  $body.on("click", ".star i", currentUser.addOrRemoveFavStory);

  
  
}

/* get a list of stories according to favarite list from Server, generates their HTML, and puts on page.*/
function putFavStoriesOnPage() {
  console.debug("putFavStoriesOnPage");

  $favoriteStoriesList.empty();
  if (currentUser.favorites.length === 0){
    $favoriteStoriesList.append("<h4>No favorites added!</h4>");
  }
  // loop through all of the favorites and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favoriteStoriesList.append($story);

  }

  $allStoriesList.hide();

  let favoriteStoriesStars = $("#favorite-stories-list .star i");

  for(let favStar of favoriteStoriesStars){
    favStar.classList.toggle("far", false);
    favStar.classList.add("fas");
    $(favStar).on("click", currentUser.addOrRemoveFavStory);
  }

  $(".star").show();
  $favoriteStoriesList.show();

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

