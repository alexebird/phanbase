
function ptElforSlug(slug) {
  return $('.songs .songTitle > a[href$="/' + slug + '"]').first();
}

function setBar(barEl, val) {
  $(barEl).closest('li').find('.pt-buddy > div').css('height', '' + val + '%');
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResp) {
  console.log('got message');
  console.log(msg.heatmap);
  $('.songs > li:not(.sectionTitle) .pt-buddy').remove();
  $('.songs > li:not(.sectionTitle) > .songInfo').before('<div class="pt-buddy"><div></div></div>');
  $.each(msg.heatmap, function(i) {
    var slug = i;
    var val = (1 - parseFloat(msg.heatmap[i].value)) * 100.0;
    console.log('' + i + ' -> ' + val);
    var el = ptElforSlug(i);
    console.log(el);
    setBar(el, val)
  });
});

$(function() {
  console.log('ready');
  chrome.runtime.sendMessage("ready");
});
