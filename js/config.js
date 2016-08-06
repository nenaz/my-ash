(function (app) {
	if (app) {
		app.setConfig({
			serverUrl: 'https://mob.nomos.ru/m2/',
			authType: 'user',
			storagePrefix: '_purse_'
		});
	}
}(app));