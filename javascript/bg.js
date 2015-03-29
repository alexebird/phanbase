PhishTracksStats.setup({
  testMode: true,
  auth: secrets.apiBasicAuth,
  urlBase: secrets.urlBase
});

var PT = 'http://www.phishtracks.com';

function pt(path) {
  return  PT + '/' + path;
}

function sendMessageToContentScript(msg) {
  chrome.tabs.query({ url: pt('*')}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, msg);
  });
}

function matchPt(url, re) {
  return url.replace(PT, '').match(re);
}

function heatmapOptionsForUrl(url) {
  var m;
  if (m = matchPt(url, /\/shows\/(\d{4}-\d{2}-\d{2})$/)) {
    return {
      filter: m[1],
      entity: 'show'
    };
  }
  else if (m = matchPt(url, /(?:\/shows\/(\d{4})$)|(?:\/api\/v1\/shows\?year=(\d{4})$)/)) {
    return {
      filter: m[1] || m[2],
      entity: 'year'
    };
  }
  else if (m = matchPt(url, /\/$/)) {
    return {
      filter: null,
      entity: 'years'
    };
  }
  else {
    return null;
  }
}

function sendHeatmapForUrl(url) {
  var opts = heatmapOptionsForUrl(url);

  if (opts) {
    getHeatmap(opts, function(data) {
      sendMessageToContentScript({ kind: 'heatmap', hm: data, who: opts.filter});
    });
  }
  else {
    console.error('path didnt match anything');
  }
}

chrome.webNavigation.onHistoryStateUpdated.addListener(function(fun) {
  sendHeatmapForUrl(fun.url);
},
{ url: [{ hostEquals: 'www.phishtracks.com' }]},
[]);

chrome.webNavigation.onCompleted.addListener(function(fun) {
  sendHeatmapForUrl(fun.url);
},
{ url: [{ hostEquals: 'www.phishtracks.com' }]},
[]);

function buildHeatmapQuery(entity, filter) {
  var q = {
    'entity':    entity,
    'timeframe': 'auto',
    'timezone':  (new Date()).getTimezoneOffset() / -60
  };
  if (filter !== null) {
    q.filter = filter;
  }
  return q;
}

function getHeatmap(options, callback) {
  var query = buildHeatmapQuery(options.entity, options.filter);
  PhishTracksStats.getHeatmap(query, callback);
}
