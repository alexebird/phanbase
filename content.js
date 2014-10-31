chrome.runtime.onMessage.addListener(function(msg, sender, sendResp) {
  console.log('got message');
  console.log(msg);
  $('.songs > li:not(.sectionTitle) > .songInfo').after('<div class="pt-buddy"><div></div></div>');
});

// works
//$(document).ready(function() {
  //console.log('ready');
//});
