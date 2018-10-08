//-------------------Variable declaration-------------------------------

// For page title and url
var tabTitle;
var tabUrl;

// For putting the stored items's values
var folderChoiceItem;
var patternChoiceItem;
var captureTypeItem;
var coloringItem;
var formatItem;
var qualityImageItem;
var spaceChoiceItem;
var specialCharaChoiceItem;

// Regular expression
var regexTitle = /%t/g;
var regexURL = /%u/g;
var regexYearLong = /%Y/g;
var regexYearShort = /%y/g;
var regexMonth = /%M/g;
var regexDay = /%J/g;
var regexHour = /%h/g;
var regexMinute = /%m/g;
var regexSecond = /%s/g;

var regexSpace = / /g;
var regexSpeChar = /[\.\*\+\\\?\^\$\{\}\|\[\]\/'":]/g;
var regexAllSpeChar = /[^A-Z^a-z^0-9^ ]/g;


//------------------------Functions-------------------------------------

/* If promise is rejected with 
gettingAllStorageItem
capturingTabAPI
getActiveTab()
*/
function onError(error) {
	console.error(`Error: ${error}`);
}

// Called when an context menu's item has been created, or when creation failed due to an error
function onCreated() {
	if (browser.runtime.lastError) {
		console.log(`Error: ${browser.runtime.lastError}`);
	} else {
		console.log("Item created successfully");
	}
}

// If the download from downloadPage(urlToDownload) fails
function onFailed(error) {
	console.log(`Download failed: ${error}`);
}

// Get the active tab from the current window
function getActiveTab() {
	return browser.tabs.query({active: true, currentWindow: true});
}

// Use regular expressions to set the file name according to the pattern 
function regex(pattern){
	
	// Get current Time and Date to put in the chosen pattern if regular expressions found 
	var now = new Date();
	var yearLong = now.getFullYear();
	var yearShort = now.getFullYear().toString().slice(-2);
	var month = ('0'+(now.getMonth()+1)).slice(-2);
	var day = ('0'+now.getDate()).slice(-2);
	var hour = ('0'+now.getHours()).slice(-2);
	var minute = ('0'+now.getMinutes()).slice(-2);
	var second = ('0'+now.getSeconds()).slice(-2);
	
	pattern = pattern.replace(regexYearLong,yearLong);
	pattern = pattern.replace(regexYearShort,yearShort);
	pattern = pattern.replace(regexMonth,month);
	pattern = pattern.replace(regexDay,day);
	pattern = pattern.replace(regexHour,hour);
	pattern = pattern.replace(regexMinute,minute);
	pattern = pattern.replace(regexSecond,second);
	
	//Put Title and Url in the chosen pattern if regular expressions found 
	pattern = pattern.replace(regexTitle,tabTitle);
	pattern = pattern.replace(regexURL,tabUrl);
	
	
	console.log("pattern= " + pattern);
	// Check if file name has special characters and remove them
	pattern = pattern.replace(regexSpeChar,"_");
	// Make sure file name begin with a letter or number
	pattern = pattern.replace(/^[^A-Z^a-z^0-9]+/, "");
	
	return pattern;
}

/* Getting the active tab's title and url and put them into variables. 
They will be used if found in the filename pattern's option*/
function getInfoForTab(tabInfo) {
	tabTitle = tabInfo[0].title;
	tabUrl = tabInfo[0].url;
}

// When all storage items are found
function onGotAllStorageItem(item) {

	// Put the stored items's value in the variables
	folderChoiceItem = item.folderChoice;
	patternChoiceItem = item.patternChoice;
	captureTypeItem = item.captureType;
	coloringItem = item.coloring;
	formatItem = item.format;
	qualityImageItem = item.qualityImage;
	spaceChoiceItem = item.spaceChoice;
	specialCharaChoiceItem = item.specialCharaChoice;
	
	/* Directly use the tabs.captureTab API if value found
	 * It will be set with the chosen format and quality */
	if (captureTypeItem == "withTabsAPI"){
  		var capturingTabAPI = browser.tabs.captureTab(
  			{format : formatItem,
  			quality : Number(qualityImageItem)
  			});
  		capturingTabAPI.then(DataURItoURL, onError);
  	}
	
  	else {
		// Send a message to the current tab script (go to content-script)
		getActiveTab().then((tabs) => {
			browser.tabs.sendMessage
				(tabs[0].id, 
				{format : formatItem, 
					quality : qualityImageItem, 
					color : coloringItem, 
					captureType : captureTypeItem});
		});
	}
}

// When the download start + Set the extension's toolbar button green for 1,5 second
function onStartedDownload(id) {
	console.log(`Started downloading: ${id}`);
	browser.browserAction.setIcon({path: "icons/shutterVert-32.png"});
	setTimeout(function(){browser.browserAction.setIcon({path: "icons/shutter-32.png"});}, 1500);
}

// API downloads.download to download the URL
function downloadPage(urlToDownload){

	patternChoiceItem = regex(patternChoiceItem);
	
	// Replace all remaining special characters in filename by "-" if option chosen
	if (specialCharaChoiceItem == "removeAllSpecials"){
		patternChoiceItem = patternChoiceItem.replace(regexAllSpeChar,"-");
	}
    // Replace all spaces in filename by "_" if option chosen
    if (spaceChoiceItem == "noSpace"){
		patternChoiceItem = patternChoiceItem.replace(regexSpace,"_");
	}
   
	// For the download API if there is a folder choice. That allows to differentiate folder and file name
    if (folderChoiceItem != ""){
	folderChoiceItem = folderChoiceItem + "/";
    }
    
	// Download the file with download() function of the downloads API
    var dl = browser.downloads.download({
		url : urlToDownload,
		filename : folderChoiceItem + patternChoiceItem + "." + formatItem,
		conflictAction : 'uniquify'
    });
    dl.then(onStartedDownload, onFailed);
}

// Convertion of the data URI to URL using a blob and the static method URL.createObjectURL()
async function DataURItoURL(aDataURI) {	

	const blob = await (await fetch(aDataURI)).blob();
	var urlToDownload = URL.createObjectURL(blob); 
	
	downloadPage(urlToDownload);
}

// Receipt of request (tab's Data URI) and processing
function handleMessage(request) {
	browser.browserAction.setIcon({path: "icons/shutterOrange-32.png"});
	DataURItoURL(request.content);
}

//------------------Create the context menu items-----------------------

browser.menus.create({
	id: "launch",
	title: browser.i18n.getMessage("menuLaunch"),
	contexts: ["all"],
	command: "_execute_browser_action",
}, onCreated);

browser.menus.create({
	id: "open-options",
	title: browser.i18n.getMessage("menuOpenOption"),
	contexts: ["all"],
}, onCreated);


//--------------Add the event listenners--------------------------------

//Action launched after clicking on the extension's toolbar button
browser.browserAction.onClicked.addListener(() => {
  	
  	// Set the extension's toolbar button red
	browser.browserAction.setIcon({path: "icons/shutterRouge-32.png"});
	
	// Querying infos for the current window's active tab
	getActiveTab().then(getInfoForTab, onError);

	// Get all the storage items
	var gettingAllStorageItem = browser.storage.local.get();
	gettingAllStorageItem.then(onGotAllStorageItem, onError);
	
});


//Action launched after clicking on the "open options" context menu's item
browser.menus.onClicked.addListener((info, tab) => {
	if (info.menuItemId == "open-options"){
		var openingPage = browser.runtime.openOptionsPage();
	}
});

// Listenner for receiving a message from the background script. Launch handleMessage
browser.runtime.onMessage.addListener(handleMessage);
