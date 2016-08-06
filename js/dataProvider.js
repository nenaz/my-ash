(function (app, $) {
	'use strict';
	
	var Data = function () {
		this.request = function (url, params) {
			var deferred = $.Deferred(),
				promise = deferred.promise(),
				requestParams = {
					type: 'POST',
					dataType: 'json',
					crossDomain: true,
					xhrFields: {
						withCredentials: true
					}
				};
				requestParams.url = app.getConfig('serverUrl') + url;
				requestParams.data = params;
			if (requestParams) {
				$.ajax(requestParams).done(function(data) {
					deferred.resolve(data);
				});
			}
			return promise;
		};
		
		this.doLogin = function (params) {
			return this.request('logon', params);
		};
		
		this.operHist = function (params) {
			return this.request('operhist2', params);
		};
	};
	
	app.Data = new Data();
}(app, jQuery));