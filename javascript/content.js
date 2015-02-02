var entityFns = {
  show: function (heatmap) {
    console.debug(heatmap);

    $('.songs > li:not(.sectionTitle) .pt-buddy').remove();
    $('.songs > li:not(.sectionTitle) > .songInfo').before('<div class="pt-buddy"><div></div></div>');

    $.each(heatmap, function(slug) {
      var val = normalize(heatmap[slug].value);
      //console.log('' + i + ' -> ' + val);
      $('.songs .songTitle > a[href$="/' + slug + '"]')
        .first()
        .closest('li')
        .find('.pt-buddy > div')
        .css('height', '' + val + '%');
    });
  },
  year: function(heatmap) {
    console.debug(heatmap);

    $('.showsByYear > li > a > .pt-buddy').remove();
    $('.showsByYear > li > a > span').before('<div class="pt-buddy"><div></div></div>');

    $.each(heatmap, function(slug) {
      var val = normalize(heatmap[slug].value);
      $('.showsByYear > li > a[href$="/' + slug + '"]')
        .first()
        .closest('li')
        .find('.pt-buddy > div')
        .css('height', '' + val + '%');
    });
  },
  years: function(heatmap) {

  }
};

function normalize(val) {
  return (1 - parseFloat(val)) * 100.0;
}

$(function() {
  console.debug('ready');
  chrome.runtime.sendMessage({ status: 'ready' });
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResp) {
  entityFns[msg.entity](msg.heatmap);
});
