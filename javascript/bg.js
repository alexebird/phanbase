var __data = null;

chrome.runtime.onMessage.addListener(function(msg, sender, sendResp) {
  if (__data == null) {
    console.debug('aww fuck');
  }

  if (msg == 'ready') {
    console.log('guacamole: ' + msg);

    chrome.tabs.query({ url: 'http://*.phishtracks.com/*'}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, __data);
    });
  }
});

chrome.webRequest.onCompleted.addListener(function(details) {
  var url = details.url;

  if (url === "http://www.phishtracks.com/") {
    console.log('get years heatmap');
  }
  else if (m = url.match(/shows\?year=(\d{4})$/)) {
    console.log('get year heatmap');
  }
  else if (m = url.match(/shows\/(\d{4}-\d{2}-\d{2})$/)) {
    getShowHeatmap(m[1], function(data) {
      __data = data;
    });
  }
},
{ urls: ["http://www.phishtracks.com/*"] },
[]);

$(function() {
  console.log('freddy');
});

PhishTracksStats.setup({
  testMode: true,
  auth: secrets.apiBasicAuth,
  urlBase: secrets.urlBase || 'https://www.phishtrackstats.com'
});

function buildHeatmapQuery(entity, filter, timeframe) {
  return {
    'entity':    entity,
    'timeframe': timeframe || 'all_time',
    'timezone':  (new Date()).getTimezoneOffset() / -60,
    'filter':    filter
  };
}

function getShowHeatmap(showDate, callback) {
  var query = buildHeatmapQuery('show', showDate);
  PhishTracksStats.getHeatmap(query, callback);
}

