/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $mainNavLinks.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show create story form on click on "submit"  */

function showCreateStoryForm(){
  console.debug("showCreateStoryForm");
  $createStoryForm.show();
}
$navSubmit.on("click", showCreateStoryForm);

/** Show favorite stories on page when clicked on nav */
function navFavStories(){
  hidePageComponents();
  putFavStoriesOnPage();
}

$navFavorite.on("click", navFavStories);


/** show user's own story when clicked on nav */
function navOwnStories(){
  hidePageComponents();
  putOwnStoriesOnPage();
}

$navOwnStory.on("click", navOwnStories);
