var lastHeatmap = null;

var entityFns = {
  show: function (heatmap) {
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
    $('.pageList > li[class!="sectionTitle"] .pt-buddy').remove();
    $('.pageList > li[class!="sectionTitle"] > a > span')
      .filter(function(i, e) {
        return $(e).text().match(/(?:^\d{4}$)|(?:^\d{2}-\d{2}$)/);
      })
      .before('<div class="pt-buddy"><div></div></div>');

    $.each(heatmap, function(slug) {
      var val = normalize(heatmap[slug].value);
      if (slug === '1983-1987') {
        slug = '83-87';
      }
      $('.pageList > li[class!="sectionTitle"] span:contains("' + slug + '")')
        .first()
        .closest('li')
        .find('.pt-buddy > div')
        .css('height', '' + val + '%');
    });
  }
};

function normalize(val, max) {
  return (1 - parseFloat(val)) * 100.0;
}

$(document).ready(function() {
  //console.debug('document ready');
  //chrome.runtime.sendMessage('ready');
  //port.postMessage({status: 'ready', url: window.location.pathname});
  if (lastHeatmap) {
    //console.debug('already have heatmap');
    entityFns[lastHeatmap.entity](lastHeatmap.heatmap);
  }
  else {
    //console.debug('still waiting');
  }
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResp) {
  var heatmap = msg.hm;
  lastHeatmap = heatmap;
  //console.debug('from background: ' + msg.who);
  //console.debug(heatmap);
  entityFns[heatmap.entity](heatmap.heatmap);
});
