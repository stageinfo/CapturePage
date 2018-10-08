//Default settings. Initialize storage to these values
var defaultSettings = { 
	folderChoice: "",
	patternChoice: "CapturePage",
	captureType: "fullPage",
	coloring: "in_colour",
	format: "png",
	qualityImage: "100",
	spaceChoice: "allow",
	specialCharaChoice: "allow",
	alertSavedParameter: "hide"
};

//Generic error logger
function onError(e) {
	console.error(e);
}

/*
Check whether they are stored settings values or not.
If not, then store the default settings.
*/
function checkStoredSettings(storedSettings) {
  
	if (!storedSettings.folderChoice || 
		!storedSettings.patternChoice || 
		!storedSettings.captureType || 
		!storedSettings.coloring || 
		!storedSettings.format || 
		!storedSettings.qualityImage || 
		!storedSettings.spaceChoice || 
		!storedSettings.specialCharaChoice || 
		!storedSettings.alertSavedParameter){
		
		browser.storage.local.set(defaultSettings);
		console.log("default");
	}
	else console.log("dejaFait");
}

// Getting Stored Setting
const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, onError);
