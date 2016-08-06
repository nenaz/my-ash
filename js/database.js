(function (app, $) {
	'use strict';
	var DataBase = function () {
		var db;
		this.init = function () {
			db = openDatabase("MyCash", "0.2", "Cash table", 200000);
			if (!db) {
				this.error();
			} else {
				this.success('connect db');
				db.transaction(function(tx) {
					tx.executeSql("SELECT COUNT(*) FROM MyCash", [], app.DB.success('count < 0'), function (tx, error) {
						tx.executeSql("CREATE TABLE MyCash (id REAL UNIQUE, label TEXT, amount REAL, timestamp REAL)", [], this.success('create table'), null);
					});
				});
			}
		};
		
		this.dropTableDB = function () {
			
		};
		
		this.updateTableDB = function () {
			
		};
	
		this.insertDB = function (insertArray) {
			db.transaction(function(tx) {
				// tx.executeSql("INSERT INTO ToDo (label, timestamp) values(?, ?)", ["Купить iPad или HP Slate", new Date().getTime()], null, null);
				tx.executeSql("INSERT INTO MyCash (label, amount, timestamp) values(?, ?, ?)", insertArray, app.DB.success(), app.DB.error());
			});
		};
		
		this.success = function (msg) {
			if (!msg) {
				msg = 'success';
			}
			console.log(msg);
		},
		
		this.error = function () {
			console.log('error');
		},
		
		this.selectDB = function () {
			db.transaction(function(tx) {
				tx.executeSql("SELECT * FROM MyCash", [], function(tx, result) {
					for(var i = 0; i < result.rows.length; i++) {
						document.write('<b>' + result.rows.item(i)['label'] + ' - ' + result.rows.item(i)['amount'] + '</b><br />');
					}
				}, null);
			}); 
		};
	};
	app.DB = new DataBase();
	app.DB.init();
} (app, jQuery));