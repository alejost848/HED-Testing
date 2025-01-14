var frequency = 7550;
var firstTrigger = true;
var progressInterval;
var progress = document.querySelector('paper-progress');

var elements;

var sQs = atob("ODU0MTkzMjc2");
var userSequence = [];

var urlString = "#!/play/?s=";

window.addEventListener('WebComponentsReady', function(e) {
	elements = document.getElementsByTagName("the-icon");
    $("the-icon").on("tap", function (event) {
		if(firstTrigger){
			firstTrigger = false;
			progressCount();
		}
		if(this.active){
			$('#playground_buttons_bottom').fadeIn();
			userSequence.push(this.id);
			urlString = "#!/play/?s="+userSequence.join("");
			window.history.replaceState("", "", urlString);
			youWin(userSequence.join(""));
		}else{
			if(this.unlocked){
				var index = userSequence.indexOf(this.id);

				if (index > -1) {
				    userSequence.splice(index, 1);
				    urlString = urlString.slice(0, -1);
				    urlString = "#!/play/?s="+userSequence.join("");
				    if(urlString == "#!/play/?s="){
				    	urlString = "#!/play";
				    }
				    window.history.replaceState("", "", urlString);
				}
				window.history.replaceState("", "", urlString);
			}
		}

		if(!this.unlocked){
    		document.querySelector('#lockedSound').show();
		}
	});

	responsive();
});

var away = false;

document.addEventListener('visibilitychange', function(event) {
	if (!document.hidden) {
		if(away){
			for (var i=0; i<elements.length; i++) {
				if(elements[i].paused){
					elements[i].playSample();
					elements[i].paused = false;
				}
			}
			progressInterval = setTimeout(progressCount, frequency/16);
			away = false;
		}
	} else {
		away = true;
		for (var i=0; i<elements.length; i++) {
			if(elements[i].playing){
				elements[i].pauseSound();
				elements[i].paused = true;
			}
		}
		setTimeout(function(){ clearTimeout(progressInterval); }, 600);
	}
});



function progressCount(){
	if(progress.value==17){
		progress.value = progress.min;
	}
	var activeButtons = 0;
	if(progress.value==progress.min){
		for (var i=0; i<elements.length; i++) {
			elements[i].playing = false;
			if(elements[i].active && elements[i].unlocked){
				elements[i].playSample();
				$('#a'+elements[i].id).fadeIn();
				activeButtons++;
			}
			if(!elements[i].active && elements[i].unlocked){
				elements[i].stopBlinking();
			}
			if(!elements[i].playing){
				$('#a'+elements[i].id).fadeOut();
			}
		}
		if(activeButtons==0){
			clearTimeout(progressInterval);
			$('#playground_buttons_bottom').fadeOut();
			firstTrigger = true;
		}
	}

	if(!firstTrigger){
		progressInterval = setTimeout(progressCount, frequency/16);
		progress.value += 1;
	}
}

function stopSamples (){
	userSequence = [];
	window.history.replaceState("", "", "#!/play");
	clearTimeout(progressInterval);
	progress.value=progress.min;
	$('#playground_buttons_bottom').fadeOut();
	firstTrigger = true;
	for (var i=0; i<elements.length; i++) {
		elements[i].active=false;
		elements[i].playing = false;
		elements[i].stopSound();
		$('#a'+elements[i].id).fadeOut();
	}
}

function youWin(validateWin) {
	if (validateWin == sQs) {
		playgroundInfoWin();
		return true;
	}
	else {
		return false;
	}
}

function triggerButtons(code) {
	if (code !== null && code !== "undefined") {
		var inputCode = code.split("");
		$.each(inputCode, function( index, value ) {
			elements[value-1]._updateColors();
			$("the-icon#"+value).trigger( "click" );
		});
	};
}

/*Toggles the drawer panel when in a different section than home*/
var drawer_panel = document.getElementById("drawerPanel");

var app0 = document.querySelector("#app0");
var app = document.querySelector("#app");
app.selected_day = "1";
app0.selected_person = "1";

window.onload=function(){
    $('#loadingCard').fadeOut(1000);
    var savedSequence = getUrlVars()["s"];
    if (savedSequence !== null && savedSequence !== undefined) {
		var decodedSavedSequence = decodeURIComponent(savedSequence);
		triggerButtons(decodedSavedSequence);
	}
};

checkHash();

$(window).on('hashchange', function(e){
   checkHash();
});

function checkHash (){
	var currentHash = window.location.hash;

	if($(window).width()<=850){
		if ( currentHash==""||currentHash=="#!/" ) {
			$('#menu_button').css( "display", "inline");
			$('#footer').css({
			    "display": "-webkit-flex",
			    "display": "flex"
			});
		}else{
			$('#footer').css( "display", "none");
			if (currentHash.startsWith("#!/play") || currentHash=="#!/fotos") {
				$('#menu_button').css( "display", "none");
			}else{
				$('#menu_button').css( "display", "inline");
			}
		}
	}else{
		if (currentHash.startsWith("#!/play")) {
			$('#footer').css( "display", "none");
			$('#menu_button').css( "display", "none");
		}else{
			if (currentHash=="#!/fotos") {
				$('#footer').css( "display", "none");
			}else{
				$('#footer').css({
				    "display": "-webkit-flex",
				    "display": "flex"
				});
			}

			$('#menu_button').css( "display", "inline");
		}
	}
	if (currentHash.startsWith("#!/play")) {
		setTimeout(function(){ playgroundInfoOpenOnce(); }, 1000);
	}
}


function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}


var footer_height = 136;
var available_height = $(window).height()-footer_height;
var available_width = $(window).width();
var event_bg_width = available_width*0.75;

$( "#right_images" ).height(available_height);
$( "#sidebar" ).height(available_height);
$( "#event_bg" ).width(event_bg_width);
$( "#event_bg" ).height(available_height);

responsive();

function responsive(){
	if(screen.width<=850){
		available_width = $(window).width();
		available_height = $(window).height();
		$( "#event_bg" ).width(available_width);
		$( "#event_bg" ).height(available_height);
		$( "#event_info" ).removeClass("flex-3");

		$( "#evento_container" ).removeClass("center");
		$( "#element_rows" ).removeClass("horizontal");
		$( "#element_rows" ).addClass("vertical");

		$( ".ponente_container" ).removeClass("horizontal");

	}

	if($(window).width()<=850){
		available_width = $(window).width();
		available_height = $(window).height();
		$( "#event_bg" ).width(available_width);
		$( "#event_bg" ).height(available_height);
		$( "#event_info" ).removeClass("flex-3");

		$( "#evento_container" ).removeClass("center");
		$( "#element_rows" ).removeClass("horizontal");
		$( "#element_rows" ).addClass("vertical");

		$( ".ponente_container" ).removeClass("horizontal");

	}
}

$(window).resize(function() {
	if($(window).width()<=850){
		available_width = $(window).width();
		available_height = $(window).height();
		$( "#event_bg" ).width(available_width);
		$( "#event_bg" ).height(available_height);
		$( "#event_info" ).removeClass("flex-3");

		$( "#evento_container" ).removeClass("center");
		$( "#element_rows" ).removeClass("horizontal");
		$( "#element_rows" ).addClass("vertical");

		$( ".ponente_container" ).removeClass("horizontal");
	}else{
		drawer_panel.closeDrawer();
		footer_height = 136;
		available_width = $(window).width();
		if($(window).height()>650){
			available_height = $(window).height()-footer_height;
		}
		event_bg_width = available_width*0.75;

		$( "#sidebar" ).height(available_height);
		$( "#event_bg" ).width(event_bg_width);
		$( "#event_bg" ).height(available_height);

		$( "#event_info" ).addClass("flex-3");
		$( "#right_images" ).height(available_height);

		$( "#evento_container" ).addClass("center");
		$( "#element_rows" ).removeClass("vertical");
		$( "#element_rows" ).addClass("horizontal");

		$( ".ponente_container" ).addClass("horizontal");
	}
	checkHash();
});

$("paper-item").on("tap",function(){
  drawer_panel.closeDrawer();
});


$("#signup_button_mobile").click(function() {
  drawer_panel.closeDrawer();
});

var app3 = document.querySelector("#app3");
app3.pholder1 = "data:image/gif;base64,R0lGODlhWAJYAqIAACUjLDMxOS4sNTAuNyknMCwqMjQyOyMhKiH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEQTQ0Qzk1MjIwMUYxMUU1ODdEOUE5RDlFRTRERkUwRCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEQTQ0Qzk1MTIwMUYxMUU1ODdEOUE5RDlFRTRERkUwRCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuZGlkOkY4RTcyQ0JCMUMyMEU1MTE4RTU3QTk3MzE3MzA5QkRBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkY4RTcyQ0JCMUMyMEU1MTE4RTU3QTk3MzE3MzA5QkRBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28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";

//Dialogs
function openDialog (element){
	var itemTime = element.time;
	var itemTitle = element.title;
	var itemContent = element.content;
	var itemIcon = element.icon;

	var app = document.querySelector("#app2");

 	app.dialogTitle = itemTitle;
 	app.dialogTime = itemTime;
 	app.dialogContent = itemContent;
 	app.dialogIcon = itemIcon;

 	var dialogFrame = document.getElementById("dialog_schedule");
 	dialogFrame.openDialog();
}

function signup (){
	var url = 'https://www.icesi.edu.co/eventos/inscripcion.php?sched_conf_id=162';
	trackOutboundLink(url);
	return false;
}

var trackOutboundLink = function(url) {
   ga('send', 'event', 'outbound', 'click', url, {'hitCallback':
     function () {
     document.location = url;
     }
   });
}

function facebookShare() {

	FB.ui(
		{
			method: 'feed',
			name: 'Crea música con el Playground de Hoy es Diseño',
			link: 'https://alejost848.github.io/hoyesdiseno/'+urlString,
			picture: 'https://alejost848.github.io/hoyesdiseno/images/fb-cover.jpg',
			caption: 'alejost848.github.io/hoyesdiseno/#!/play',
			description: 'Juega con la consola de audio, desbloquea nuevos sonidos y crea tu propia música. #playgroundhed. El futuro, ahora.',
		},
		function(response) {
			if (response != undefined) {
				document.querySelector('#fbShared').show();
			} else {
				document.querySelector('#fbNotShared').show();
			}
		}
	);
}

function playgroundInfoOpenOnce() {
	var cookiePlayInfo = document.getElementById("playCookie");
	var date = new Date();
	date.setTime(date.getTime()+(24*60*60*1000));

	if (cookiePlayInfo.value === undefined || cookiePlayInfo.value === null) {
		playgroundInfo();
		cookiePlayInfo.value = '1';
		cookiePlayInfo.expires = date.toGMTString();
	}
}

function playgroundInfo (){
	var dialogPlayground = document.getElementById("dialog_playground");
	dialogPlayground.openDialog();
}

function playgroundInfoWin (){
	var dialogPlaygroundWin = document.getElementById("dialog_playground_win");
	dialogPlaygroundWin.openDialog();
}

function profilePics (){
	var dialogProfilePics = document.getElementById("dialog_profile_pic");
	dialogProfilePics.openDialog();
}

function viewPictures (){
	var dialogPictures = document.getElementById("dialog_pictures");
	dialogPictures.openDialog();
}

//Toast for displaying offline cache completed
var app5 = document.querySelector("#app5");
app5.displayInstalledToast = function() {
    document.querySelector('#caching-complete').show();
  };

function goLink (argument){
	window.location.href = argument;
}

function goBack (argument){
	userSequence = [];
	window.location.href = argument;

	clearTimeout(progressInterval);
	progress.value=progress.min;
	$('#playground_buttons_bottom').fadeOut();
	firstTrigger = true;
	for (var i=0; i<elements.length; i++) {
		elements[i].active=false;
		elements[i].playing = false;
		elements[i].stopSound();
		$('#a'+elements[i].id).fadeOut();
	}
}


function clickHandlerVideo(e) {
  var button = e.target;
  while (!button.hasAttribute('data-dialog') && button !== document.body) {
    button = button.parentElement;
  }
  if (!button.hasAttribute('data-dialog')) {
    return;
  }
  var id = button.getAttribute('data-dialog');
  var dialog = document.getElementById(id);
  if (dialog) {
    dialog.open();
  }

  var autoplay_video = document.querySelector("#home_video");
  autoplay_video.play()
}

document.getElementById('formPost').addEventListener('iron-form-submit', deliverIt);

function deliverIt(event) {

	var email = $("#email").val(); // get email field value
	var name = $("#name").val(); // get name field value
	var msg = $("#msg").val(); // get message field value
	$.ajax(
	{
		type: "POST",
		url: "https://mandrillapp.com/api/1.0/messages/send.json",
		data: {
			'key': 'lyGXnxHjBHdaVdfDRypDFw',
			'message': {
				'from_email': email,
				'from_name': name,
				'headers': {
					'Reply-To': email
				},
				'subject': 'Mensaje de hoyesdiseno.com',
				'text': msg,
				'to': [
				{
					'email': 'hoyesdisenomercadeo@gmail.com',
					'name': 'Hoy es Diseño',
					'type': 'to'
				}]
			}
		}
	})
	.done(function(response) {
		document.querySelector('#msgSent').show(); // show success message
		$("#name").val(''); // reset field after successful submission
		$("#email").val(''); // reset field after successful submission
		$("#msg").val(''); // reset field after successful submission
		grecaptcha.reset(); // reset captcha after successful submission
	})
	.fail(function(response) {
		document.querySelector('#msgNotSent').show(); // show fail message
	});
	return false; // prevent page refresh
}

function clickHandler(event) {
	document.getElementById('email').validate();
	document.getElementById('name').validate();
	document.getElementById('msg').validate();

	if (document.getElementById('email').validate() && document.getElementById('name').validate() && document.getElementById('msg').validate() && validateCaptcha()) {
		document.getElementById('formPost').submit();
	}
}

function validateCaptcha() {
	var resp = grecaptcha.getResponse();

	if(resp.length == 0) {
		document.querySelector('#msgNoCaptcha').show(); // show captcha validation error message
		return false;
	}

	else {
		return true;
	}
}

function shareButtonPressed (){
	facebookShare();
}


console.log( '%c  __        ______________________  \n /  |      /                      | \n 0  0      | Parece que intentas  | \n || ||     | ver el código fuente | \n ||_/|  <--| ¿Necesitas ayuda?    | \n |___/     |______________________/ \n                                    ', "color: #272430;  font-size: 14px; font-family: 'Consolas', Helvetica, sans-serif;" );


var videos = [["Inauguración", "8:30 AM - 9:00 AM"],["La Tlapalería", "9:00 AM - 10:30 AM"],["Anwar Bey-Taylor", "11:00 AM - 12:30 PM"],["Ogilvy & Mather", "2:00 PM - 3:30 PM"],["Laura Jade", "4:00 PM - 6:00 PM"]];
var nowStreaming = 0;

var app10 = document.querySelector("#app10");
app10.titulo_conferencia_ahora = videos[0][0];
app10.hora_conferencia_ahora = videos[0][1];

function streamingVideo (){
	nowStreaming ++;
	app10.titulo_conferencia_ahora = videos[nowStreaming][0];
	app10.hora_conferencia_ahora = videos[nowStreaming][1];
}
