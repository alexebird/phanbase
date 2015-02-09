PhishTracksStats.setup({
  testMode: true,
  auth: secrets.apiBasicAuth,
  urlBase: secrets.urlBase || 'https://www.phishtrackstats.com'
});

var PhishTracksBuddy = {
  lastHeatmap: null,

  ContentScript: {
    ready: false
  }
};

//var PhishTracksBuddy = {
  //cache: {}
//};

//chrome.runtime.onMessage.addListener(function(msg, sender, sendResp) {
  ////if (PhishTracksBuddy.cache['__data'] == null) {
    ////console.debug('');
  ////}

  //if (msg.status == 'ready') {
    //console.debug('CS ready');
    //PhishTracksBuddy.ContentScript.ready = true;
    //if (PhishTracksBuddy.lastHeatmap) {
      //console.debug('already have heatmap');
      //sendHeatmap(PhishTracksBuddy.lastHeatmap);
      //PhishTracksBuddy.lastHeatmap = null;
    //}
  //}
  ////else {
    ////console.error(msg.status);
  ////}
//});

function sendHeatmap(data) {
  chrome.tabs.query({ url: pt('*')}, function(tabs) {
    console.debug('sending heatmap');
    chrome.tabs.sendMessage(tabs[0].id, {kind: 'heatmap', data: data});
  });
}

var PT = 'http://www.phishtracks.com';

function pt(path) {
  return  PT + '/' + path;
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
    console.debug(m);
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
  ////PhishTracksBuddy.ContentScript.ready = false;
  //console.log(details.url);
  //var opts = heatmapOptionsForUrl(details.url);
  //if (opts) {
    //getHeatmap(opts, function(data) {
      //if (PhishTracksBuddy.ContentScript.ready) {
        //console.debug('CS is ready right away');
        //sendHeatmap(data);
      //}
      //else {
        //console.debug('CS not ready, storing heatmap for later');
        //PhishTracksBuddy.lastHeatmap = data;
      //}
    //});
  //}
  //else {
    //console.error('path didnt match anything');
  //}
//},
//{ urls: [pt('*')] },
//[]);

//$(function() {
  //console.log('freddy');
//});

function buildHeatmapQuery(entity, filter) {
  return {
    'entity':    entity,
    'filter':    filter,
    'timeframe': 'auto',
    'timezone':  (new Date()).getTimezoneOffset() / -60
  };
}

function getHeatmap(options, callback) {
  console.log('heatmap: entity=' + options.entity + ' filter=' + options.filter);
  var query = buildHeatmapQuery(options.entity, options.filter);
  PhishTracksStats.getHeatmap(query, callback);
}

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "knockknock");
  port.onMessage.addListener(function(msg) {
    if (msg.joke == "Knock knock")
      port.postMessage({question: "Who's there?"});
    else if (msg.answer == "Madame")
      port.postMessage({question: "Madame who?"});
    else if (msg.answer == "Madame... Bovary")
      port.postMessage({question: "I don't get it."});
  });
});
