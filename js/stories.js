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
	//console.debug("generateStoryMarkup", story);

	const hostName = story.getHostName();
	let trashCan = '';
	let star = 'far';

	if (currentUser) {
		let favIdArray = currentUser.favorites.map((story) => story.storyId);
		star = favIdArray.includes(story.storyId) ? 'fas' : 'far';
		let ownStorriesIdArray = currentUser.ownStories.map((story) => story.storyId);
		trashCan = ownStorriesIdArray.includes(story.storyId)
			? '<span class="hidden trash-can"> <i class=" fa fa-trash-alt"> </i> </span>'
			: '';
	}

	return $(`
      <li id="${story.storyId}">
      ${trashCan}
       <span class="star hidden"> <i class="fa-star ${star}"> </i> </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}
/** handles event listners and shows star icons */

function handleDisplayFavStoriesIcon() {
	if (currentUser) {
		$body.off('click', '.star', addOrRemoveFavStory);
		$('.star').show();
		$body.on('click', '.star', addOrRemoveFavStory);
	}
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
	console.debug('putStoriesOnPage');

	$allStoriesList.empty();

	// loop through all of our stories and generate HTML for them
	for (let story of storyList.stories) {
		const $story = generateStoryMarkup(story);
		$allStoriesList.append($story);
	}

	handleDisplayFavStoriesIcon();
	$allStoriesList.show();
}

/* get a list of stories according to favarite list from Server, generates their HTML, and puts on page.*/
function putFavStoriesOnPage() {
	console.debug('putFavStoriesOnPage');
	$favoriteStoriesList.empty();

	// no favorites message
	if (currentUser.favorites.length === 0) {
		$favoriteStoriesList.append('<h4>No favorites added!</h4>');
	}
	// loop through all of the favorites and generate HTML for them
	for (let story of currentUser.favorites) {
		const $story = generateStoryMarkup(story);
		$favoriteStoriesList.append($story);
	}

	$favoriteStoriesList.show();
	handleDisplayFavStoriesIcon();
}

function apendNoUserStoryMessage(){
  if (currentUser.ownStories.length === 0) {
    $myStoriesList.append('<h4>No stories added by user yet!</h4>');
  };
} 

function putOwnStoriesOnPage() {
	$myStoriesList.empty();
  apendNoUserStoryMessage();

	for (let story of currentUser.ownStories) {
		const $story = generateStoryMarkup(story);
		$myStoriesList.append($story);
	}

  //Show stories and icons
	$myStoriesList.show();
  handleDisplayFavStoriesIcon();
  //chain it
	$('.trash-can').show().on('click', removeOwnStories);
}

/* change star color, and update User's favorite list */

function addOrRemoveFavStory(evt) {
	let $starIcon = $(evt.target);
	let storyId = $(evt.target).closest('li').attr('id');
	let addOrRemove;
	// changing star color
	if ($starIcon.hasClass('far')) {
		$starIcon.removeClass('far').addClass('fas');
		addOrRemove = 'add';
	} else {
		$starIcon.removeClass('fas').addClass('far');
		addOrRemove = 'remove';
	}
	// update favorite array on current user
	currentUser.updateFavorites(storyId, addOrRemove);
}

/** handles removing story from own stories */

function removeOwnStories(evt) {
	let storyId = $(evt.target).closest('li').attr('id');
	currentUser.removeStory(storyId);
	$(evt.target).closest('li').remove();
  storyList.removeStory(storyId);
  apendNoUserStoryMessage();
}

/** helper function to gather form input */
function gatherCreateStoryFormData() {
	return {
		author: $('#s-author').val(),
		title: $('#s-title').val(),
		url: $('#s-url').val()
	};
}

/** gather from data, add to the story list and update DOM*/

async function addNewStoryFromForm(evt) {
	evt.preventDefault();
	let formData = gatherCreateStoryFormData();
	$createStoryForm.trigger('reset');
	await storyList.addStory(currentUser, formData);
	currentUser.ownStories.push(storyList.stories[0]);
	$createStoryForm.hide();
	putStoriesOnPage();
}

//put nav related to nav.js
$createStoryForm.on('submit', addNewStoryFromForm);
