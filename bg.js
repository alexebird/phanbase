//chrome.runtime.onMessage.addListener(function(msg, sender, sendResp) {
  //console.log('got message');
  //console.log(msg);
  //console.log(sender);
//});

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
      console.log('sending message');
      console.log(data);

      //chrome.tabs.query({ url: '<all_urls>'}, function(tabs) {
      chrome.tabs.query({ url: 'http://*.phishtracks.com/*'}, function(tabs) {
        console.debug('tabs');
        console.debug(tabs);
        chrome.tabs.sendMessage(tabs[0].id, data);
      });
    });
  }
},
{urls: ["http://www.phishtracks.com/*"]},
[]);

var apiBasicAuth = 'xyz';
var urlBase      = 'https://www.phishtrackstats.com';
PhishTracksStats.setup({ testMode: false, auth: apiBasicAuth, urlBase: urlBase });

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

