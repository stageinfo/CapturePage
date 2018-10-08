//--------------Variable declaration------------------------------------

// For getting the background script request (here the stored items's value)
var formatItemCS;
var qualityImageItemCS;
var coloringItemCS;
var captureTypeItemCS;

// For the measures
var tWidth;
var tHeight;
var tLeft = 0;
var tTop = 0;

//--Function to create an image as data URL from the tab using a canvas-

function createImageData() {
  
	/* If the chosen capture type is the full page. 
	 * Get the scrollHeight and scrollWidht pixel value of the document.body
	 * */
	if (captureTypeItemCS == "fullPage"){
		tWidth = document.body.scrollWidth;
		tHeight = document.body.scrollHeight;
	}
  
	// If the chosen capture type is only the visible part of the page
	if (captureTypeItemCS == "visiblePart"){
	
		// Get Height and Width (in pixels) of the browser window viewport 
		tWidth = window.innerWidth;
		tHeight = window.innerHeight;
		/*Get the number of pixels is scrolled vertically and to the left
		with the root element of the document*/
		tLeft = document.documentElement.scrollLeft;
		tTop = document.documentElement.scrollTop;
	}
 
	// Create a canvas element with the specified namespace URI (HTML) and qualified name
	var canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "html:canvas");
	
	canvas.height = tHeight;
	canvas.width = tWidth;

	// Return a drawing context on the canvas
	var ctx = canvas.getContext('2d');
	
	// Method of the Canvas 2D API to render a region of a window into the canvas.
	ctx.drawWindow(window, tLeft, tTop, tWidth, tHeight, "rgb(255,255,255)");


	// If the chosen coloring is grayscale
	if (coloringItemCS == "grayscale"){
		
		/* Return an ImageData object representing 
		the underlying pixel data for a specified portion of the canvas*/
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		
		/*Return a Uint8ClampedArray representing a one-dimensional array 
		 * containing the data in the RGBA order, 
		 * with integer values between 0 and 255*/
		var data = imageData.data;
  
		/* Manipulate pixel data to get grayscale pixels
		 * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
		 *for more informations*/
		for (var i = 0; i < data.length; i += 4) {
				var moy = (data[i] + data[i + 1] + data[i + 2]) / 3;
				data[i]     = moy; // red
				data[i + 1] = moy; // green
				data[i + 2] = moy; // blue
    	}
    	
		ctx.putImageData(imageData, 0, 0);
	}
  
	// Transform the chosen quality value into a number between 0 and 1
	qualityImageItemCS = qualityImageItemCS/100;

	let imgdata;
	
	/* Return a data URI containing a representation of the image 
	 * Format and quality chosen are settled here
	 * */
	imgdata = canvas.toDataURL("image/"+formatItemCS, qualityImageItemCS);
	
	// Send the URI Data to the background script
	sending = browser.runtime.sendMessage({content: imgdata});
}


//---------Listen for messages from the background script---------------

browser.runtime.onMessage.addListener(request => {
	// Put message in the variables
	formatItemCS = request.format;
	qualityImageItemCS = request.quality;
	coloringItemCS = request.color;
	captureTypeItemCS = request.captureType;
	
	createImageData();
});
