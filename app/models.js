'use strict';

var LinkCode = Orangee.XMLModel.extend({
  url: "http://www.orangee.tv/getLinkingCode",
  parse: function(xml) {
    var json = orangee.xml2json(xml);
    return {code: json.apiResponse.linkingCode.toString()};
  }
});

var DeviceToken = Orangee.XMLModel.extend({
  initialize: function(link_code) {
    this.link_code = link_code;
  },
  url: function() {
    return "http://www.orangee.tv/validateLinkingCode?code=" + this.link_code;
  },
  parse: function(xml) {
    orangee.debug(xml);
    var json = orangee.xml2json(xml);
    var status = json.apiResponse.status.toString();
    if (status === 'success') {
      var device_token = json.apiResponse.deviceToken.toString();
      orangee.storage.set('device_token', device_token);
      return {token: device_token};
    } else {
      return {};
    }
  }
});

var Subscription = Orangee.Model.extend({
});

var Subscriptions = Orangee.OPMLCollection.extend({
  model: Subscription,
  initialize: function(device_token) {
    this.device_token = device_token;
    Orangee.OPMLCollection.prototype.initialize.apply(this);
  },
  url: function() {
    return "http://api.orangee.tv/getSubscription?token=" + this.device_token;
  },
});

var Album = Orangee.Model.extend({});

var Albums = Orangee.OPMLCollection.extend({
  model: Album,
  initialize: function(url) {
    this.link = url;
    Orangee.OPMLCollection.prototype.initialize.apply(this);
  },
  url: function() {
    return "http://proxy.orangee.tv/proxy?url=" + this.link;
  },
});

var Video = Orangee.Model.extend({ });

var Videos = Orangee.RSSCollection.extend({
  model: Video,
  initialize: function(url) {
    this.link = url;
    Orangee.OPMLCollection.prototype.initialize.apply(this);
  },
  url: function() {
    return "http://proxy.orangee.tv/proxy?url=" + this.link;
  },
});
