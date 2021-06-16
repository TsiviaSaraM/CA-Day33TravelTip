import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
import { weatherService } from './services/weather-service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onRemoveLoc = onRemoveLoc;
window.onSearch = onSearch;

function onInit() {
	mapService
		.initMap()
		.then((map) => {
			map.addListener('click', (mapsMouseEvent) => {
				onClickMap(mapsMouseEvent, map);
			});
		})

		.catch((err) => console.log(err));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
	console.log('Getting Pos');
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject);
	});
}

function onAddMarker(newLat, newLng, name) {
	console.log('Adding a marker');
	console.log(newLat, newLng);
	mapService.addMarker({ lat: newLat, lng: newLng }, name);
}

function onGetLocs() {
	locService.getLocs().then((locs) => {
		console.log('Locations:', locs);
		return renderLocs(locService.locs);
	});
}

function onRemoveLoc(id) {
	locService.removeLoc(id);
	renderLocs(locService.locs);
	renderMap();
}

function renderMap() {
	getPosition().then((pos) => {
		// console.log(pos);
		mapService
			.initMap(pos.coords.latitude, pos.coords.longitude)
			.then((map) => {
				map.addListener('click', (mapsMouseEvent) => {
					onGetUserPos();

					onClickMap(mapsMouseEvent, map);
				});
				locService.getLocs().then((locs) => {
					locs.forEach((loc) => {
						onAddMarker(loc.lat, loc.lng, loc.name);
					});
				});
			})

			.catch((err) => console.log(err));
	});
}

// onRemoveLoc(3)

function renderLocs(locs) {
	Promise.all(
		locs.map((loc) => {
			return weatherService.getWeather(loc);
		})
	).then((weatherRes) => {
		var strHTML = locs
			.map(function (loc, id) {
				loc.weather = weatherRes[id];
				var name = loc.name;

				var id = loc.id;
				// console.log('now rendering ', name, loc.weather);

				return `<tr>
            <td>${name}</td>
            <td>${loc.weather}</td>
            <td>
			<button onclick="onPanTo(${loc.lat},${loc.lng})">Go</button>
                <button onclick="onRemoveLoc(${id})">Delete</button>
            </td>
        </tr>`;
			})
			.join('');
		document.querySelector('.locs-data').innerHTML = strHTML;
	});
}

function onGetUserPos() {
	getPosition()
		.then((pos) => {
			console.log('User position is:', pos.coords);
			document.querySelector(
				'.user-pos'
			).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
			onPanTo(pos.coords.latitude, pos.coords.longitude);
		})

		.catch((err) => {
			console.log('err!!!', err);
		});
}
function onPanTo(lat, lan) {
	console.log('Panning the Map');
	mapService.panTo(lat, lan);
}

function onClickMap(mapsMouseEvent, map) {
	//add marker to the map
	let infoPopUp;
	let locName = prompt('Enter Loc Name');
	onAddMarker(
		mapsMouseEvent.latLng.toJSON().lat,
		mapsMouseEvent.latLng.toJSON().lng,
		locName
	);

	infoPopUp = new google.maps.InfoWindow({
		content: locName,
		position: mapsMouseEvent.latLng,
	});
	// infoPopUp.setContent(
	// 	JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
	// );

	infoPopUp.open(map);
	// console.log(mapsMouseEvent.latLng);
	// return mapsMouseEvent.latLng.toJSON();

	//saves to Loc service as new loc
	locService.addLoc(
		locName,
		mapsMouseEvent.latLng.toJSON().lat,
		mapsMouseEvent.latLng.toJSON().lng

		//BUG - HOW TO CLOSE POPUP?
	);

	// pan map
	onPanTo(
		mapsMouseEvent.latLng.toJSON().lat,
		mapsMouseEvent.latLng.toJSON().lng
	);

	//renderings
	renderPage(
		mapsMouseEvent.latLng.toJSON().lat,
		mapsMouseEvent.latLng.toJSON().lng
	);
}

function renderPage(lan, lat) {
	// renderMap();

	renderCurrLoc(lan, lat);
	renderLocs(locService.locs);
	// renderLocations();
	// renderLocs(locService.locs);
}

// function renderMap() {}
function renderLocations() {
	let strHTML = '';
	// let itemNum = 1;
	locService.getLocs().then((locs) => {
		locs.map((loc) => {
			strHTML += `<ul> 
			<li onclick="onPanTo(${loc.lat},${loc.lng})"> Location Number ${loc.id} </li>
			<li onclick="onPanTo(${loc.lat},${loc.lng})"> Location Name: ${loc.name} </li>
			<li onclick="onPanTo(${loc.lat},${loc.lng})"> Lat: ${loc.lat} </li>
			<li onclick="onPanTo(${loc.lat},${loc.lng})"> Lng:${loc.lng} </li>
		</ul>
		`;
			// itemNum++;
		});
		console.log(strHTML);
		document.querySelector('.locs').innerHTML = strHTML;
	});
}

function renderCurrLoc(lan, lat) {
	console.log('sanity');

	document.querySelector(
		'.user-pos'
	).innerText = `Latitude: ${lat} - Longitude: ${lan}`;
}

function onSearch(text) {
	// console.log("searching... ", text);
	// return Promise.resolve(text)
	locService.getSearchData(text);
	const prm = Promise.resolve(text).then((res) => {
		mapService.panTo(res.lat, res.lng);
		addMarker(res);
	});
}

// function onSearch(text){
//     QU what name need to be searched
//      use submit button, later add debounce
//     -->send to geocode-service & get lat lang
//     -->add marker
//     -->pan
//     -->addLocation
//

//     render map
//     render locations table

// }
