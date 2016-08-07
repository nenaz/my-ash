/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
	private: {},
    // Application Constructor
    initialize: function() {
        this.bindEvents();
		$('.loginBlock').height();
		// app.Utils.loadingElemPos();
    },
	
	elem: {
		loginBlock: '.loginBlock'
	},
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('password').addEventListener('keyup', this.keyLogin, false);
		$('.leftMenu ').on('tap', this.toggleLeftMenu);
		$('button[type="repl-but"]').on('click', this.replAmount);
		$('.categoryBlock .customButton').on('click', this.selectCategory);
		$('.saveCosts').on('click', this.saveCosts);
		$('.topMenuButton').on('click', this.toggleLeftMenu);
		$('[action="app-exit"]').on('click', this.exitApp);
		$('[action="statement"]').on('click', this.statementCreate);
		$('.replButtons div[type="repl-but"]').on('click', this.replAmount);
		$('.clearInput').on('click', this.clearAmount);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
		
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

    },
	
	setConfig: function (config) {
            if (!this.private.config) {
                this.private.config = config;
            }
        },

	getConfig: function (value) {
            return this.private.config[value];
        },

	keyLogin: function (e) {
		if (e.target.value.length === 4) {
			app.Utils.maskToggle(true);
			$(e.target).blur();
			app.doLogin();
		}
	},
	
	doLogin: function () {
		var login = app.Utils.getStorage('myLogin') || document.getElementById('login').value,
			password = document.getElementById('password').value,
			type = app.getConfig('authType'),
			me = this;
		if (!login) {
			alert('введите логин');
		}
		var deferred = $.Deferred();
		$.when(app.Data.doLogin({
			username: login,
			password: password,
			authtype: type
		})).done(function (data) {
			if (data.personId) {
				app.Utils.setStorage('myLogin', login);
				app.isLogin = true;
				setTimeout(function() {
					app.Utils.toggleClass($('.loginBlock')[0], 'invisible');
					app.Utils.toggleClass($('.purseBlock ')[0], 'invisible');
					app.Utils.maskToggle(false);
					app.getMyMoney();
				}, 1500);
				deferred.resolve(data);
			}
		});
		return deferred.promise();
	},
	
	getMyMoney: function () {
		var synchr = app.Utils.getStorage('synchronize') || false,
			synchrDate = app.Utils.getStorage('synchronizeCashAtDate') || app.Utils.getCurrentDate();
		var deferred = $.Deferred();
			app.Utils.maskToggle(true);
			$.when(app.Data.operHist({
				acctno: 0,
				period: 0
			})).done(function (data) {
				var i = 0,
					item = data.opers[i],
					bool = true,
					cash = 0,
					currentDate = app.Utils.getCurrentDate(),
					trandate;
				for (i = 0; i < data.opers.length; i++) {
					item = data.opers[i];
					if (item.oper) {
						// trandate = item.oper.trandate.match(/\d{2}.\d{2}.\d{4}/);
						// if (currentDate === trandate[0] && item.oper.mcc === 6011) {
						if (item.oper.mcc === 6011) {
							cash += parseFloat(app.Utils.amountParseFloat(item.oper.amount));
						}
					}
				}
				cash = Math.abs(cash);
				app.Utils.setStorage('my-cash', cash);
				app.Utils.setStorage('synchronizeCashAtDate', currentDate);
				app.Utils.setStorage('synchronize', true);
				document.getElementById('balance').innerText = cash;
				app.Utils.maskToggle(false);
				deferred.resolve(cash);
			});
			return deferred.promise();
			if (cash === 0) {
				document.getElementById('balance').innerText = app.Utils.getStorage('my-cash');
			}
	},
	
	replAmount: function (e) {
		var startAmount = parseInt(document.getElementById('manualInput').value),
			amount;
		startAmount = (isNaN(startAmount)) ? 0 : startAmount;
		amount = startAmount + parseInt($(e.target).attr('action'));
		document.getElementById('manualInput').value = amount;
	},
	
	clearAmount: function () {
		$('#manualInput')[0].value = '';
	},
	
	selectCategory: function (e) {
		$('.categoryBlock .customButton').removeClass('activeButton');
		$(e.target).closest('.customButton').addClass('activeButton');
	},
	
	saveCosts: function () {
		var amountEL = document.getElementById('manualInput'),
			amount = amountEL.value * 1,
			balance = document.getElementById('balance'),
			selectCategory = $('.activeButton').closest('li').attr('action'),
			selectCategoryText = $('.activeButton span').text();
		balance.innerText = balance.innerText * 1 - amount;
		amountEL.value = 0;
		$('.categoryBlock .customButton').removeClass('activeButton');
		if (selectCategoryText && amount > 0) {
			app.DB.insertDB([selectCategoryText, amount, new Date().getTime()]);
		}
	},
	
	getCameraImage: function () {
		navigator.camera.getPicture(this.cameraSuccess, this.cameraError);
	},
	
	cameraSuccess: function (imageData) {
		alert('cameraSuccess');
		var image = document.getElementById('myImage');
		image.src = "data:image/jpeg;base64," + imageData;
	},
	
	onFail: function (message) {
		alert('Failed because: ' + message);
	},
	
	toggleLeftMenu: function () {
		app.Utils.toggleClass($('.leftMenu')[0], 'toggleMenuShow');
		app.Utils.toggleClass($('body')[0], 'bodyNoScroll');
	},
	
	exitApp: function (e) {
		e.preventDefault();
		e.stopPropagation();
		navigator.app.exitApp();
	},
	
	statementCreate: function (e) {
		app.DB.selectDB();
	} 
};

app.initialize();