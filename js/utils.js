(function (app, $) {
	'use strict';
	var Utils = function () {
		this.amountParseFloat = function (amount, pFloat) {
			var result;
			pFloat = pFloat || false;
			result = amount.replace(/\s/g, '').replace(/,/g, '.');
			if (pFloat) {
				result = parseFloat(result);
			} 
			return result;
		},
		
		this.setStorage = function (item, value) {
			if (value !== undefined) {
				localStorage[app.getConfig('storagePrefix') + item] = JSON.stringify(value);
			}
		},
		
		this.getStorage = function (item) {
			if (localStorage[app.getConfig('storagePrefix') + item] && localStorage[app.getConfig('storagePrefix') + item] !== 'undefined') {
				return JSON.parse(localStorage[app.getConfig('storagePrefix') + item]);
			}
		},
		
		this.loadingElemPos = function () {
			var elem = $('.loadMask'),
				loadEl = $('.loadAnimate'),
				elemW = elem.width() / 2,
				loadElemW = loadEl.width() / 2,
				elemH = elem.height() / 2,
				loadElemH = loadEl.height() / 2;
			loadEl.css({
				left: elemW - loadElemW,
				top: elemH - loadElemH
			});
		},
		
		this.maskToggle = function (value) {
			var elem,
				loadEl;
			if (value !== undefined) {
				elem = $('.loadMask'),
				loadEl = $('.loadAnimate');
				if (value) {
					elem.addClass('visible');
					loadEl.addClass('loadingCircle');
					elem.removeClass('invisible');
				} else {
					elem.removeClass('visible');
					loadEl.removeClass('loadingCircle');
					elem.addClass('invisible');
				}
			}
		},
		
		this.getCurrentDate = function () {
			var d = new Date(),
				day = d.getDate(),
				month  = (d.getMonth() < 10) ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1),
				year = d.getFullYear(),
				separator = '.';
			return day + separator + month + separator + year;
		},
		
		this.messageBoxToggle = function (value) {
			var elem = document.getElementById('message-box');
			if (value !== undefined) {
				if (value) {
					$(elem).addClass('visible');
					$(elem).removeClass('invisible');
					setTimeout(function () {
						$(elem).addClass('messageBoxShow');
						$(elem).removeClass('messageBoxHide');
					}, 250);
				} else {
					$(elem).addClass('messageBoxHide');
					$(elem).removeClass('messageBoxShow');
					setTimeout(function () {
						$(elem).removeClass('visible');
						$(elem).addClass('invisible');
					}, 500);
				}
			}
		}
	};
	
	app.Utils = new Utils();
	app.Utils.loadingElemPos();
}(app, jQuery));