// Regular expressions
var regexVerifName = /([A-Za-z0-9-]+)/;
var regexSpeChar = /[\.\*\+\\\?\^\$\{\}\|\[\]\/'":]/g;
var regexTitle = /%t/g;
var regexURL = /%u/g;
var regexSpace = / /g;
var regexAllSpeChar = /[^A-Z^a-z^0-9^ ]/g;

// Const for getting document's elements
const folder = document.querySelector("#idFolderChoice");
const pattern = document.querySelector("#idPatternChoice");
const radio1 = document.getElementsByName("captureType");
const radio2 = document.getElementsByName("coloring");
const radio3 = document.getElementsByName("format");
const selectList = document.querySelector("#qualityImage");
const checkBox1 = document.querySelector("#idCheckBoxSpace");
const checkBox2 = document.querySelector("#idCheckBoxAllSpecials");
const checkBox3 = document.querySelector("#idCheckBoxAlertSavedParameter");


//---------------------------Functions----------------------------------

// Update the Options menu's style when it's saved or opened
function MAJVisibility(){
	onBlur();
	changeExample();
	changeCapture();
	changeFormat();
}

// Get current Time and Date to put in the pattern if regular expressions found 
function captureTime(pattern){
	
	var now = new Date();
	
	// To get 4 digits year 
	var yearLong = now.getFullYear();
	
	// To get 2 digits year
	var yearShort = now.getFullYear().toString().slice(-2);
	
	// +1 for month as getMonth() give the month as a number from 0 to 11
	// 0 and slice(-2) to have a 2 digits number with 0 before if only one digit is return
	var month = ('0'+(now.getMonth()+1)).slice(-2);
	var day = ('0'+now.getDate()).slice(-2);
	var hour = ('0'+now.getHours()).slice(-2);
	var minute = ('0'+now.getMinutes()).slice(-2);
	var second = ('0'+now.getSeconds()).slice(-2);
	
    pattern = pattern.replace(/%Y/g,yearLong);
    pattern = pattern.replace(/%y/g,yearShort);
    pattern = pattern.replace(/%M/g,month);
    pattern = pattern.replace(/%J/g,day);
    pattern = pattern.replace(/%h/g,hour);
    pattern = pattern.replace(/%m/g,minute);
    pattern = pattern.replace(/%s/g,second);
	
	return pattern;
}

// Set the Table style 
function onFocus(){
	legendeModele.style.display = "table";
	legendeModele.style.width = "65%";
}

// Take off the patterns key
function onBlur(){
	legendeModele.style.display = "none";
}

// Put an Url and title text in the pattern if regular expresions found
function changeExample(){

	var patternChoiceExpl = document.getElementById("idPatternChoice").value;
	patternChoiceExpl = patternChoiceExpl.replace(regexTitle,browser.i18n.getMessage("titleExampleText"));
    patternChoiceExpl = patternChoiceExpl.replace(regexURL,browser.i18n.getMessage("uRLExampleText"));
    	
	document.getElementById("idPatternExampleExample").textContent = captureTime(patternChoiceExpl);
}

/*
Change styles (display and visibility) of 2 elements from the capture's options 
depending on whether or not the Capture Tab API option is chosen 
*/
function changeCapture() {

	var precisionsWithTabsAPI = document.getElementById("idPrecisionsWithTabsAPI");
	var divColoring = document.getElementById("divColoring");

	if(document.getElementById("idAPICapture").checked == true){
	     precisionsWithTabsAPI.style.visibility = "visible";
	     divColoring.style.display = "none";
	}
	else {
	     precisionsWithTabsAPI.style.visibility = "hidden";
	     divColoring.style.display = "block";
	}
}

// Change visibility of the quality image's option depending on whether or not the jpeg option is chosen 
function changeFormat() {

	var divQualityImage = document.getElementById("divQualityImage");

	if(document.getElementById("idJpeg").checked == true){
	     divQualityImage.style.visibility = "visible";
	}
	else {
	     divQualityImage.style.visibility = "hidden";
	}
}

/* 
 * Return value of the checked radio button. 
 * A const is needed it identified the elements by name
*/
function returnRadioCheckedValue(radio){
	for (var i=0; i < radio.length; i++) {
		if ( radio[i].checked ) {
			val = radio[i].value; 
			break;
		}
	}
	return val;		
}

/* 
 * Update radio buttons by checking the one 
 * whose value is in the restored settings. 
 * A const is needed to identified the elements by name.
*/
function updateRadioChecked(radio, restoredSettings){
	for (var j=0; j < radio.length; j++) {
		if (radio[j].value == restoredSettings) {
			radio[j].checked = true;
			break;
		}
	}
}

/* 
 * Update the checkbox by checking if its value is in the restored settings. 
 * A const is needed to identified the checkbox.
*/
function updateCheckBoxChecked(checkBox, restoredSettings){
	if (checkBox.value == restoredSettings){
		checkBox.checked = true;
	}else checkBox.checked = false;
}

// Get setting values and store them in local storage
function storeSettings() {

	function getFolderChoice() {
		return folder.value;
	}
  
	function getPatternChoice() {
		return pattern.value;
	}

	// Get the radio button checked's value (Capture Type)
	function getRadioCaptureType() {
		return returnRadioCheckedValue(radio1)
	}

	// Get the radio button checked's value (Coloration)
	function getRadioColorationType() {
		return returnRadioCheckedValue(radio2)
	}
  
	// Get the radio button checked's value (Format)
	function getRadioFormatType() {
		return returnRadioCheckedValue(radio3)
	}

	function getQualityImage() {
		return selectList.value;
	}

	// Get the space choice option's value or set another value if box not checked
	function getSpaceChoice() {
		if (checkBox1.checked) {
			val = checkBox1.value;
    	} else val = "allow";
		return val
	}

	// Get the special characters choice option's value or set another value if box not checked
	function getSpecialCharaChoice() {
		if (checkBox2.checked) {
			val = checkBox2.value;
    	} else val = "allow";
		return val
	}

	// Get the Alert for saved parameters choice option's value or set another value if box not checked
	function getAlertSavedParameter() {
		if (checkBox3.checked) {
			val = checkBox3.value;
    	} else val = "hide";
		return val
	}

	// Get the folder choice and replace all characters which could make the download fail 
	var folderChoice = getFolderChoice();
	folderChoice = folderChoice.replace(/[\.\*\+\\\?\^\$\{\}\|\[\]\<\>'":]/g, "");
	folderChoice = folderChoice.replace(/\/\//g, "");
	folderChoice = folderChoice.replace(/(\/[^A-Z^a-z^0-9])/g, "");
	folderChoice = folderChoice.replace(/([^A-Z^a-z^0-9]\/)/g, "");
	folderChoice = folderChoice.replace(/^[^A-Z^a-z^0-9]+/, "");
	
	// Check if there is at least a letter or a number in the folder choice
	if (!regexVerifName.test(folderChoice)){
		folderChoice = "";
	}

	// Get the pattern choice and replace the special characters which could make the download fail 
	var patternChoice = getPatternChoice();
	patternChoice = patternChoice.replace(regexSpeChar,"");
	
	// Check if there is at least a letter or a number in the pattern choice
	if (!regexVerifName.test(patternChoice)){
		patternChoice = "CapturePage";
	}

	var captureType = getRadioCaptureType();
	var coloring = getRadioColorationType();
	var format = getRadioFormatType();
	var qualityImage = getQualityImage();
	var spaceChoice = getSpaceChoice();
	var specialCharaChoice = getSpecialCharaChoice();
	var alertSavedParameter = getAlertSavedParameter();;

	console.log(folderChoice);
	console.log(patternChoice);
	console.log(captureType);
	console.log(coloring);
	console.log(format);
	console.log(qualityImage);
	console.log(spaceChoice);
	console.log(specialCharaChoice);
	console.log(alertSavedParameter);

	// Store all the values in local storage
	browser.storage.local.set({
		folderChoice,
		patternChoice,
		captureType,
		coloring,
		format,
		qualityImage,
		spaceChoice,
		specialCharaChoice,
		alertSavedParameter
	});
	
	/* 
	Check if the alert for saved parameters option was chosen.
	If chosen, variables will be declared and set with messages 
	from the _locales folder according to the settings values
	*/
	if (alertSavedParameter == "show"){
		
		var specialCharaChoiceAlert
		if (specialCharaChoice == "removeAllSpecials"){
			specialCharaChoiceAlert = browser.i18n.getMessage("yesAlert");
		}else specialCharaChoiceAlert = browser.i18n.getMessage("noAlert");

		var spaceChoiceAlert
		if (spaceChoice == "allow"){
			spaceChoiceAlert = browser.i18n.getMessage("noAlert");
		}else spaceChoiceAlert = browser.i18n.getMessage("yesAlert");


		var folderChoiceAlert;
		if (folderChoice == ""){
			folderChoiceAlert = browser.i18n.getMessage("defaultFolderAlert");
		} else folderChoiceAlert = folderChoice;

		var patternChoiceAlert;
		if (patternChoice == "CapturePage"){
			patternChoiceAlert = browser.i18n.getMessage("defaultFileNameAlert");

		} else {
			// Check and replace key characters from the pattern choice 
			patternChoiceAlert = patternChoice;
			patternChoiceAlert = patternChoiceAlert.replace(regexTitle,browser.i18n.getMessage("titleExampleText"));
			patternChoiceAlert = patternChoiceAlert.replace(regexURL,browser.i18n.getMessage("uRLExampleText"));
			patternChoiceAlert = captureTime(patternChoiceAlert);
			patternChoiceAlert = patternChoiceAlert.replace(/^[^A-Z^a-z^0-9]+/, "");
		
			// Replace all special characters remaining in the pattern choice if option chosen
			if (specialCharaChoice == "removeAllSpecials"){
				patternChoiceAlert = patternChoiceAlert.replace(regexAllSpeChar,"-");
			}
			// Replace all spaces in the pattern choice if option chosen
			if (spaceChoice == "noSpace"){
				patternChoiceAlert = patternChoiceAlert.replace(regexSpace,"_");
			}
		}
		
		var coloringAlert;
		if (coloring == "in_colour"){
			coloringAlert = browser.i18n.getMessage("labelIn_colour");
		}else coloringAlert = browser.i18n.getMessage("labelGrayscale");
		
		var captureTypeAlert;
		if (captureType == "withTabsAPI"){
			coloringAlert = browser.i18n.getMessage("alertColourTabsAPI");
			captureTypeAlert = browser.i18n.getMessage("labelWithTabsAPI");
		}else if (captureType == "fullPage"){
			captureTypeAlert = browser.i18n.getMessage("labelFullPage");
		}else captureTypeAlert = browser.i18n.getMessage("labelVisiblePart");
	
		if (format == "png"){
			qualityImage = browser.i18n.getMessage("alertQualityImagePNG");
		}else qualityImage = qualityImage + " %";

		// Alert for showing all the chosen options
		alert(browser.i18n.getMessage("alertSave") + "\n" + "\n"
			+ browser.i18n.getMessage("alertFolderChoiceTitle")+ folderChoiceAlert + "\n" 
			+ browser.i18n.getMessage("alertPatternChoiceTitle")+ patternChoiceAlert + "\n" 
			+ browser.i18n.getMessage("captureTypeTitle") + captureTypeAlert + "\n" 
			+ browser.i18n.getMessage("formatTitle") + format + "\n" 
			+ browser.i18n.getMessage("alertQualityImageTitle") + qualityImage + "\n" 
			+ browser.i18n.getMessage("labelColoring") + coloringAlert + "\n" 
			+ browser.i18n.getMessage("checkBoxSpaceTitle") +" : "+ spaceChoiceAlert + "\n" 
			+ browser.i18n.getMessage("checkBoxAllSpecialsTitle") +" : "+ specialCharaChoiceAlert);
	}
	MAJVisibility();
}

/*
Update the options UI with the settings values retrieved from storage,
or the default settings if the stored settings are empty.
*/
function updateUI(restoredSettings) {
  
	folder.value = restoredSettings.folderChoice;

	pattern.value = restoredSettings.patternChoice;
  
  	updateRadioChecked(radio1, restoredSettings.captureType);
  	updateRadioChecked(radio2, restoredSettings.coloring);
  	updateRadioChecked(radio3, restoredSettings.format);
	
	selectList.value = restoredSettings.qualityImage;
  
	updateCheckBoxChecked(checkBox1,restoredSettings.spaceChoice);
	updateCheckBoxChecked(checkBox2,restoredSettings.specialCharaChoice);
	updateCheckBoxChecked(checkBox3,restoredSettings.alertSavedParameter);

	MAJVisibility();
}

function onError(e) {
	console.error(e);
}

//---------------On opening the options page----------------------------

// Get the options menu's labels and button to put the location messages from _locales folder
document.getElementById("idFolderChoiceTitle").textContent = browser.i18n.getMessage("folderChoiceTitle");
document.getElementById("idFolderPrecisions").textContent = browser.i18n.getMessage("folderPrecisions");
document.getElementById("idPatternChoiceTitle").textContent = browser.i18n.getMessage("patternChoiceTitle");
document.getElementById("idPatternPrecisions").textContent = browser.i18n.getMessage("patternPrecisions");
document.getElementById("idPatternExampleTitle").textContent = browser.i18n.getMessage("patternExampleTitle");
document.getElementById("idTdTitle").textContent = browser.i18n.getMessage("tdTitle");
document.getElementById("idTdYear").textContent = browser.i18n.getMessage("tdYear");
document.getElementById("idTdHour").textContent = browser.i18n.getMessage("tdHour");
document.getElementById("idTdURL").textContent = browser.i18n.getMessage("tdURL");
document.getElementById("idTdMonth").textContent = browser.i18n.getMessage("tdMonth");
document.getElementById("idTdMinute").textContent = browser.i18n.getMessage("tdMinute");
document.getElementById("idTdDay").textContent = browser.i18n.getMessage("tdDay");
document.getElementById("idTdSecond").textContent = browser.i18n.getMessage("tdSecond");
document.getElementById("idCaptureType").textContent = browser.i18n.getMessage("captureTypeTitle");
document.getElementById("idLabelFullPage").textContent = browser.i18n.getMessage("labelFullPage");
document.getElementById("idLabelVisiblePart").textContent = browser.i18n.getMessage("labelVisiblePart");
document.getElementById("idLabelWithTabsAPI").textContent = browser.i18n.getMessage("labelWithTabsAPI");
document.getElementById("idPrecisionsWithTabsAPI").textContent = browser.i18n.getMessage("precisionsWithTabsAPI");
document.getElementById("idFormat").textContent = browser.i18n.getMessage("formatTitle");
document.getElementById("idLabelPng").textContent = browser.i18n.getMessage("labelPng");
document.getElementById("idLabelJpeg").textContent = browser.i18n.getMessage("labelJpeg");
document.getElementById("idQualityImage").textContent = browser.i18n.getMessage("qualityImage");
document.getElementById("idColoring").textContent = browser.i18n.getMessage("labelColoring");
document.getElementById("idLabelIn_colour").textContent = browser.i18n.getMessage("labelIn_colour");
document.getElementById("idLabelGrayscale").textContent = browser.i18n.getMessage("labelGrayscale");
document.getElementById("idCheckBoxSpaceTitle").textContent = browser.i18n.getMessage("checkBoxSpaceTitle");
document.getElementById("idCheckBoxAllSpecialsTitle").textContent = browser.i18n.getMessage("checkBoxAllSpecialsTitle");
document.getElementById("idCheckBoxAlertSavedParameterTitle").textContent = browser.i18n.getMessage("checkBoxAlertSavedParameterTitle");
document.getElementById("idSubmitButton").textContent = browser.i18n.getMessage("submitButton");

// Fetch stored settings and update the UI with them.
const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);

// Take off the patterns key
var legendeModele = document.getElementById("idPatternKey");
legendeModele.style.display = "none";


//--------------Add the event listenners--------------------------------

// On form's submit
document.querySelector("#form").addEventListener("submit", storeSettings);

// On change on the capture's options
document.querySelector("#idFullPage").addEventListener("change", changeCapture);
document.querySelector("#idVisiblePart").addEventListener("change", changeCapture);
document.querySelector("#idAPICapture").addEventListener("change", changeCapture);

// On change on the format's options
document.querySelector("#idPng").addEventListener("change", changeFormat);
document.querySelector("#idJpeg").addEventListener("change", changeFormat);

// On events on the filename pattern option
document.querySelector("#idPatternChoice").addEventListener("input", changeExample);
document.querySelector("#idPatternChoice").addEventListener("focus", onFocus);
document.querySelector("#idPatternChoice").addEventListener("blur", onBlur);
