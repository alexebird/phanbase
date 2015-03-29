var entityFns = {
  show: function (heatmap) {
    $('.songs > li:not(.sectionTitle) .french').remove();
    $('.songs > li:not(.sectionTitle) > .songInfo').before('<div class="french"><div></div></div>');

    normHeatmap = remapHeatmapSlugsForPhishTracks(heatmap);

    $('.songs .songTitle > a').each(function(index, el) {
      var ptSlug = $(el).attr('href').split('/')[3];
      var ptNormSlug = normalizeSlugForPhishTracks(ptSlug);
      var val = (normHeatmap[ptSlug] || normHeatmap[ptNormSlug]).value;
      val = normalize(val);
      $(el).first().closest('li').find('.french > div').css('height', '' + val + '%');
    });
  },
  year: function(heatmap) {
    $('.showsByYear > li > a > .french').remove();
    $('.showsByYear > li > a > span').before('<div class="french"><div></div></div>');

    $.each(heatmap, function(slug) {
      var val = normalize(heatmap[slug].value);
      $('.showsByYear > li > a[href$="/' + slug + '"]')
        .first()
        .closest('li')
        .find('.french > div')
        .css('height', '' + val + '%');
    });
  },
  years: function(heatmap) {
    $('.pageList > li[class!="sectionTitle"] .french').remove();
    $('.pageList > li[class!="sectionTitle"] > a > span')
      .filter(function(i, e) {
        return $(e).text().match(/(?:^\d{4}$)|(?:^\d{2}-\d{2}$)/);
      })
      .before('<div class="french"><div></div></div>');

    $.each(heatmap, function(slug) {
      var val = normalize(heatmap[slug].value);
      if (slug === '1983-1987') {
        slug = '83-87';
      }
      $('.pageList > li[class!="sectionTitle"] span:contains("' + slug + '")')
        .first()
        .closest('li')
        .find('.french > div')
        .css('height', '' + val + '%');
    });
  }
};

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

function populate(heatmap) {
  entityFns[heatmap.entity](heatmap.heatmap);
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResp) {
  var heatmap = msg.hm;

  setTimeout(function() {
    populate(heatmap);
  }, 750);
});
