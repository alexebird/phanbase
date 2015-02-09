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

$(document).ready(function() {
  console.debug('ready');
  //chrome.runtime.sendMessage({ status: 'ready' });
});

//$(window).load(function() {
  //console.debug('loaded');
  //chrome.runtime.sendMessage({ status: 'loaded' });
//});

//chrome.runtime.onMessage.addListener(function(msg, sender, sendResp) {
  //if (msg.kind == 'ping') {
    //chrome.runtime.sendMessage({ status: 'pong', data: (document.readyState === 'complete') });
  //}
  //else if (msg.kind == 'heatmap') {
    //entityFns[msg.data.entity](msg.heatmap);
  //}
//});

var port = chrome.runtime.connect({name: "knockknock"});
port.postMessage({joke: "Knock knock"});
port.onMessage.addListener(function(msg) {
  if (msg.question == "Who's there?")
    port.postMessage({answer: "Madame"});
  else if (msg.question == "Madame who?")
    port.postMessage({answer: "Madame... Bovary"});
});
