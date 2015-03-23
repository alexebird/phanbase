var lastHeatmap = null;

var entityFns = {
  show: function (heatmap) {
    $('.songs > li:not(.sectionTitle) .pt-buddy').remove();
    $('.songs > li:not(.sectionTitle) > .songInfo').before('<div class="pt-buddy"><div></div></div>');

    //$.each(heatmap, function(slug, val) {
      //val = normalize(val);
      ////console.log('' + i + ' -> ' + val);
      //var trackAnchor = findMatchingPhishTracksTrack($('.songs .songTitle > a'), slug);
      //if (trackAnchor === null) {
        //console.error("couldn't find slug from heatmap in page");
      //}
      //else {
        //$(trackAnchor).first().closest('li').find('.pt-buddy > div').css('height', '' + val + '%');
      //}
    //});

    normHeatmap = remapHeatmapSlugsForPhishTracks(heatmap);

    $('.songs .songTitle > a').each(function(index, el) {
      var ptSlug = $(el).attr('href').split('/')[3];
      var ptNormSlug = normalizeSlugForPhishTracks(ptSlug);
      var val = normHeatmap[ptNormSlug].value;
      val = normalize(val);
      $(el).first().closest('li').find('.pt-buddy > div').css('height', '' + val + '%');
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

//function findMatchingPhishTracksTrack(anchors, hmSlug) {
  //var anch = null;
  //anchors.each(function(index, el) {
    //var ptSlug = $(el).attr('href').split('/')[3];
    //var ptNormSlug = normalizeSlugForPhishTracks(ptSlug);
    //var hmNormSlug = normalizeSlugForPhishTracks(hmSlug);
    //console.log('looking for: ' + hmSlug + ' -> ' + hmNormSlug);
    //console.log('encountered: ' + ptSlug + ' -> ' + ptNormSlug);
    //if (ptNormSlug === hmNormSlug) {
      //if (anch === null) {
        //anch = el;
      //}
    //}
  //});
  //return anch;
//}

function normalize(val, max) {
  return (1 - parseFloat(val)) * 100.0;
}

function remapHeatmapSlugsForPhishTracks(hm) {
  var newHm = {};
  $.each(hm, function(slug, value) {
    var newSlug = normalizeSlugForPhishTracks(slug);
    newHm[newSlug] = value;
  });
  return newHm;
}

function normalizeSlugForPhishTracks(slug) {
  return slug.replace(/-+/g, '');
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
