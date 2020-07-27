/**
 * 
 */
console.log('project1.js ready');


// These closures are used to store the previously selected
// latitude and longitude so that when the forecast tab
// is selected without clicking on a new city, it
// will be called with the previous set of coordinates.

// I'm using closures here so I can't casually change the data type
// of the variable.  It's a constant function reference. Global variables
// are evil.

// Closure for latitude.
const lat = (function(){
	let lat = 42.654;
	return function(l){
		if (l){
			lat = l;
		}
		return lat;
	}
})();
//Closure for latitude.
const long = (function(){
	let long = -73.748;
	return function(l){
		if (l){
			long = l;
		}
		return long;
	}
})();
// Closure for city.
const city = (function(){
	let city = 'Albany';
	return function(c){
		if (c) {
			city = c;
		}
		return city;
	}
})();

// Let's set a default latitude and longitude in case
// somebody clicks the forecast tab directly instead
// of choosing a city.
//let latitude = 42.654;
//let longitude = -73.748;


window.onload = function(){
	console.log('registering listeners');
	buildCitiesForm();
	document.getElementById('pills-cities-tab').addEventListener('click', buildCitiesForm);
	document.getElementById('pills-forecast-tab').addEventListener('click', function(){ buildForecastForm(lat(), long(), city());});
	document.getElementById('pills-add-tab').addEventListener('click', buildAddForm);
}


// callback for cities form
function buildCitiesForm(){
	console.log('building cities');
	let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function(){
		if (xhttp.readyState == 4 &&  xhttp.status == 200){
			let jsonObj = JSON.parse(xhttp.responseText);
//			console.log(jsonObj);
			citiesDOMBuilder(jsonObj);
		}
	}

	xhttp.open("GET", "http://localhost:8080/Project1/cities");
	xhttp.send();
}

function citiesDOMBuilder(json){
	console.log('building cities')
	/*
	 * 			
	 * This is the content we need to generate here.  The first row is headings
	 * the rest are looped through
	 * 		<h2 class="display-4 text-light">Please Choose</h2>

	 *  		<div class="list-group">
						<button type="button"
							class="list-group-item list-group-item-action active">
							<div class="col">
								<div class="row">
									<div class="col-sm">Abbrev.</div>
									<div class="col-sm">State</div>
									<div class="col-sm">Capital</div>
									<div class="col-sm">Zip Code</div>
								</div>
							</div>
						</button>
						<button type="button"
							class="list-group-item list-group-item-action" id="button1"
							value="12345">
							<div class="col">
								<div class="row">
									<div class="col-sm">One of three columns</div>
									<div class="col-sm">One of three columns</div>
									<div class="col-sm">One of three columns</div>
									<div class="col-sm">One of three columns</div>
								</div>
							</div>
						</button>
					</div>
	 */
	let link = document.getElementById('pills-forecast-tab');
	link.setAttribute('aria-selected', 'true');
	link.setAttribute('class', 'nav-link text-dark');
	
	link = document.getElementById('pills-cities-tab');
	link.setAttribute('aria-selected', 'true');
	link.setAttribute('class', 'nav-link active text-light');
	
	link = document.getElementById('pills-add-tab');
	link.setAttribute('aria-selected', 'true');
	link.setAttribute('class', 'nav-link text-dark');
	
	
	document.title = "Weather Forecasting";
	
	let start = document.getElementById('div-content-pane');
	start.innerText = "";
	let label = document.createElement("h2");
	label.setAttribute('class', 'display-4 text-dark');
	label.innerText = "Please Choose a City";
	start.appendChild(label);

	let newRow = createCityRow("State", "Capital", "Zip Code", "Latitude", "Longitude", true);
//	console.log(newRow);
	start.appendChild(newRow);


	for (let o of json){
//		console.log(o);
		newRow = createCityRow(o.state, o.capital, o.zipCode, o.latitude, o.longitude);
		start.appendChild(newRow);
	}
}

function createCityRow(state, capital, zip, latitude, longitude, isActive){
	let newRow = document.createElement('DIV');
	newRow.setAttribute("class",'list-group');
	let button = document.createElement('BUTTON');
	if (isActive){
		button.setAttribute('class', 'list-group-item list-group-item-action active');
	} else {
		button.setAttribute('class', 'list-group-item list-group-item-action');
		button.addEventListener('click', function(){buildForecastForm(latitude,longitude,capital);});

	}
	let column = document.createElement('DIV');
		column.setAttribute('class', 'col');
	let colRow = document.createElement('div');
		colRow.setAttribute('class','row');
		
//	let arr =  [abbrev, state, capital, zip, latitude, longitude];
	let arr =  [state, capital, zip];

		for (let i = 0; i < arr.length; i++){
			let c = document.createElement('div');
			c.setAttribute('class','col-sm');
			c.innerText=arr[i]; 
			colRow.appendChild(c);
		}
		column.appendChild(colRow);
		button.appendChild(column);
		newRow.appendChild(button);

		return newRow;
}


/*
 *
 * This is the structure I need for the 5 day forecast
 * 5 cards in 2 rows, 3 on top & 2 on the bottom
 * 
 * 					<div class="card-group">
						<div class="row">
							<div class="card col-sm-4">
								<img class="card-img-top"
									src="./myresources/icons/10d.png"
									alt="Card image cap">
								<div class="card-body">
									<h5 class="card-title">Card title</h5>
									<p class="card-text">This is a wider card with supporting
										text below as a natural lead-in to additional content. This
										content is a little bit longer.</p>
									<p class="card-text">
										<small class="text-muted">Last updated 3 mins ago</small>
									</p>
								</div>
							</div>
							<div class="card col-sm-4">
								<img class="card-img-top"
									src="./myresources/sticker_weather_icons_by_kortoik_d1axjof/256/10.png"
									alt="Card image cap">
								<div class="card-body">
									<h5 class="card-title">Card title</h5>
									<p class="card-text">This card has supporting text below as
										a natural lead-in to additional content.</p>
									<p class="card-text">
										<small class="text-muted">Last updated 3 mins ago</small>
									</p>
								</div>
							</div>
							<div class="card col-sm-4">
								<img class="card-img-top"
									src="./myresources/sticker_weather_icons_by_kortoik_d1axjof/256/20.png"
									alt="Card image cap">
								<div class="card-body">
									<h5 class="card-title">Card title</h5>
									<p class="card-text">This is a wider card with supporting
										text below as a natural lead-in to additional content. This
										card has even longer content than the first to show that equal
										height action.</p>
									<p class="card-text">
										<small class="text-muted">Last updated 3 mins ago</small>
									</p>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="card col-sm-4 offset-md-2">
								<img class="card-img-top"
									src="./myresources/sticker_weather_icons_by_kortoik_d1axjof/256/30.png"
									alt="Card image cap">
								<div class="card-body">
									<h5 class="card-title">Card title</h5>
									<p class="card-text">This is a wider card with supporting
										text below as a natural lead-in to additional content. This
										card has even longer content than the first to show that equal
										height action.</p>
									<p class="card-text">
										<small class="text-muted">Last updated 3 mins ago</small>
									</p>
								</div>
							</div>
							<div class="card col-sm-4">
								<img class="card-img-top"
									src="./myresources/sticker_weather_icons_by_kortoik_d1axjof/256/40.png"
									alt="Card image cap">
								<div class="card-body">
									<h5 class="card-title">Card title</h5>
									<p class="card-text">This is a wider card with supporting
										text below as a natural lead-in to additional content. This
										card has even longer content than the first to show that equal
										height action.</p>
									<p class="card-text">
										<small class="text-muted">Last updated 3 mins ago</small>
									</p>
								</div>
							</div>
						</div>
					</div>
 */
function buildForecastForm(latitude, longitude, capital){
	//https://api.openweathermap.org/data/2.5/onecall?lat=34.746&lon=-92.280&exclude=hourly,minutely&appid=63d7dbcf918332e3cd1364cb169bd101&units=imperial
	
	//save the latitude & longitude in the closures for next time, if needed.
	latitude = lat(latitude);
	longitude = long(longitude);
	capital = city(capital);
	console.log("got " + latitude + " " + longitude + " " + capital);
	
	// change the selected state of the tabs to reflect that the forecast page is active.
	// this is needed because by clicking on a button row doesn't do so
	// automatically
	let link = document.getElementById('pills-forecast-tab');
	link = document.getElementById('pills-forecast-tab');
	link.setAttribute('aria-selected', 'true');
	link.setAttribute('class', 'nav-link active text-light');
	
	link = document.getElementById('pills-cities-tab');
	link.setAttribute('aria-selected', 'false');
	link.setAttribute('class', 'nav-link text-dark');
	
	link = document.getElementById('pills-add-tab');
	link.setAttribute('aria-selected', 'true');
	link.setAttribute('class', 'nav-link text-dark');
	
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if (xhttp.readyState == 4 && xhttp.status == 200){
			let foreObj = JSON.parse(xhttp.responseText);
			forecastDOMBuilder(capital, foreObj);
		}
	}
	const appid = '63d7dbcf918332e3cd1364cb169bd101';
	xhttp.open("GET", `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&appid=${appid}&units=imperial`);
	xhttp.send();
}

function forecastDOMBuilder(capital, json){
	document.title = `Forecast for ${capital}`;
//	console.log(json);
	
	let start = document.getElementById('div-content-pane');
	start.innerText = "";
	let label = document.createElement("h2");
	label.setAttribute('class', 'display-4 text-dark');
	label.innerText = `5 Day Forecast for ${capital}`;
	start.appendChild(label);
	let group = document.createElement('div');
	group.setAttribute('class', 'card-group');
	start.appendChild(group);
	
	// top row
	for (let i = 0; i < 5; i++){
		let newCard = buildForecastCard(json.daily[i]);
		group.appendChild(newCard);
	}
		
	start.appendChild(group);
}

function buildForecastCard(daily){
	let icon = "./myresources/icons/" + daily.weather[0].icon + ".png";
		
	let card = document.createElement('div');
	card.setAttribute('class', 'card col col-sm-auto');
	
	// imagecap
	let img = document.createElement('img');
	img.setAttribute('class', 'card-img-top');
	img.setAttribute('src', icon);
	img.setAttribute('alt', daily.weather[0].main);
	card.appendChild(img);
	
	// card body
	let body = document.createElement('div');
	body.setAttribute('class', 'card-body');
	let title = document.createElement('h6');
	title.setAttribute('class', 'card-title');
	title.innerText=timeConverter(daily.dt);
	body.appendChild(title);
	
	title = document.createElement('h5');
	title.setAttribute('class', 'card-title');
	title.innerHTML = "High: " +
		Math.round(daily.temp.max) + "&#730" + "<br>Low: " +
		Math.round(daily.temp.min) + "&#730";
	body.appendChild(title);
	
	let ul = document.createElement('ul');
	let li = document.createElement('li');
	li.innerHTML = "<b>Feels like:</b> " +
		Math.round(daily.feels_like.day) +"&#730";
	ul.appendChild(li);
	li = document.createElement('li');
	li.innerHTML = "<b>Humidity:</b> " + daily.humidity + "%";
	ul.appendChild(li);
	li = document.createElement('li');
	li.innerHTML = "<b>Dew Point:</b> " + Math.round(daily.dew_point) +"&#730";
	ul.appendChild(li);
	li = document.createElement('li');
	li.innerHTML = "<b>Wind Speed:</b> " + daily.wind_speed + "mph";
	ul.appendChild(li);
	body.appendChild(ul);
	
	smallP = document.createElement('p');
	smallP.setAttribute('class', 'card-text');
	smallP.innerHTML = `<small class="text-muted">${daily.weather[0].main}: ${daily.weather[0].description}</small>`;
	body.appendChild(smallP);
	
	card.appendChild(body);
	return card;
}

function timeConverter(UNIX_timestamp){
	  let a = new Date(UNIX_timestamp * 1000);
	  let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	  let month = months[a.getMonth()];
	  let date = a.getDate();
	  let time = month + ' ' + date;
	  return time;
}



//<div class="card-group justify-content-center">
//<div class="card col-sm-6 ">
//	<h4 class="card-title">Add City</h4>
//	<form id="add_city" method="post"
//		action="Project1/CityServlet/cities">
//		<div class="form-group">
//			<label for="city">City</label> <input type="text"
//				class="form-control" name="city" id="city" placeholder="City" required />
//		</div>
//		<div class="form-group">
//			<label for="state">State</label> <select class="form-control"
//				name="state" id="state" placeholder="State">
//				<option value="NY">NY</option>
//			</select>
//		</div>
//		<div class="form-group">
//			<label for="zip_code">Zip Code</label> <input type="number"
//				class="form-control" name="zip_code" id="zip_code" placeholder="Zip Code"
//				required>
//		</div>
//
//		<div class="form-row">
//			<div class="col">
//				<input type="number" name="latitude" class="form-control"
//					placeholder="Latitude" required>
//			</div>
//			<div class="col">
//				<input type="number" name="longitude" class="form-control"
//					placeholder="Longitude" required>
//			</div>
//		</div>
//		<br>
//		<div class="form-row justify-content-center">
//
//			<button type="submit" class="btn btn-primary">Add City</button>
//		</div>
//	</form>
//</div>
//</div>

function buildAddForm(){
	console.log('building cities');
	let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function(){
		if (xhttp.readyState == 4 &&  xhttp.status == 200){
			let jsonObj = JSON.parse(xhttp.responseText);
//			console.log(jsonObj);
			addFormBuilder(jsonObj);
		}
	}

	xhttp.open("GET", "http://localhost:8080/Project1/cities");
	xhttp.send();
}

function addFormBuilder(json){
	console.log(json);
	document.title = "Add a City";
	let link = document.getElementById('pills-add-tab');
	link = document.getElementById('pills-add-tab');
	link.setAttribute('aria-selected', 'true');
	link.setAttribute('class', 'nav-link active text-light');
	
	link = document.getElementById('pills-forecast-tab');
	link.setAttribute('aria-selected', 'false');
	link.setAttribute('class', 'nav-link text-dark');
	
	link = document.getElementById('pills-cities-tab');
	link.setAttribute('aria-selected', 'true');
	link.setAttribute('class', 'nav-link text-dark');
	
	let start = document.getElementById('div-content-pane');
	start.innerText = "";


	let cardGroup = document.createElement('div');
	cardGroup.setAttribute('class', 'card-group justify-content-center');
	
	let card = document.createElement('div');
	card.setAttribute('class','card col-sm-6');
	let title = document.createElement('h4');
	title.setAttribute('class','card-title');
	title.innerText = 'Add City';
	card.appendChild(title);
	
	let form = document.createElement('form');
	form.setAttribute('id','add_city');
	form.setAttribute('method','post');
	form.setAttribute('action','/Project1/cities');
	
	let formGroup = document.createElement('div');
	formGroup.setAttribute('class','form-group');
	formGroup.innerHTML = '<label for="city">City</label> <input type="text" class="form-control" name="city" id="city" placeholder="City" required />';
	
	form.appendChild(formGroup);
	formGroup = document.createElement('div');
	formGroup.setAttribute('class','form-group');
	formGroup.innerHTML = '<div class="form-group"><label for="state">State</label>';
	form.appendChild(formGroup);
	
	formGroup = document.createElement('select');
	formGroup.setAttribute('id', 'state');
	formGroup.setAttribute('name', 'state');
	formGroup.setAttribute('class','form-control');
	
	for (let o of json){
		let option = document.createElement('option');
		option.setAttribute('value', o.state);
		option.innerText = o.state;
		formGroup.appendChild(option);
	}
	
	form.appendChild(formGroup);
	
	formGroup = document.createElement('div');
	formGroup.setAttribute('class','form-group');
	formGroup.innerHTML = '<label for="zip">Zip Code</label> <input type="number"	class="form-control" name="zip" id="zip" placeholder="Zip Code" required/>';
	form.appendChild(formGroup);
	
	formGroup = document.createElement('div');
	formGroup.setAttribute('class','form-row');
	formGroup.innerHTML = '<div class="col"><input type="number" step=".001" name="latitude" class="form-control" placeholder="Latitude" required></div><div class="col"><input type="number" name="longitude" step=".001" class="form-control"	placeholder="Longitude" required><br>';
	form.appendChild(formGroup);
	formGroup = document.createElement('div');
	formGroup.setAttribute('class','form-row justify-content-center');
	formGroup.innerHTML = '<button type="submit" class="btn btn-primary">Add City</button>';
	form.appendChild(formGroup);
	
	
	card.appendChild(form);
	cardGroup.appendChild(card);
	start.appendChild(cardGroup);
}


//	console.log(timeConverter(1593795600));

//function findMe(){
//	if(navigator.geolocation){
//		console.log('locating');
//		console.log(navigator.geolocation.getCurrentPosition(function(){console.log(postion.coords.latitude + " " + position.coords.longitude);}));
//	}
//}
//
//
//findMe();