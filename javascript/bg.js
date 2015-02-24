PhishTracksStats.setup({
  testMode: true,
  auth: secrets.apiBasicAuth,
  urlBase: secrets.urlBase
});

var PT = 'http://www.phishtracks.com';

function pt(path) {
  return  PT + '/' + path;
}

//chrome.runtime.onMessage.addListener(function(msg, sender, sendResp) {
//});

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
    //console.debug(m);
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

//chrome.webRequest.onCompleted.addListener(function(details) {
  //console.debug('web request: ' + details.url);
  //sendMessageToContentScript('request');

//},
//{ urls: [pt('*')] },
//[]);

function sendHeatmapForUrl(url) {
  var opts = heatmapOptionsForUrl(url);

  if (opts) {
    getHeatmap(opts, function(data) {
      //console.debug('heatmap: ' + opts.filter);
      sendMessageToContentScript({hm:data, who: opts.filter});
    });
  }
  else {
    console.error('path didnt match anything');
  }
}

chrome.webNavigation.onHistoryStateUpdated.addListener(function(fun) {
  //console.debug('onHistoryStateUpdated -> ' + fun.url);
  sendHeatmapForUrl(fun.url);
},
{ url: [{ hostEquals: 'www.phishtracks.com' }]},
[]);

chrome.webNavigation.onCompleted.addListener(function(fun) {
  //console.debug('onCompleted -> ' + fun.url);
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
  //console.log('heatmap: entity=' + options.entity + ' filter=' + options.filter);
  var query = buildHeatmapQuery(options.entity, options.filter);
  PhishTracksStats.getHeatmap(query, callback);
}
