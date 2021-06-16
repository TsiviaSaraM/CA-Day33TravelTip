import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onRemoveLoc = onRemoveLoc;

function onInit() {
	mapService
		.initMap()
		.then((map) => {
			map.addListener('click', (mapsMouseEvent) => {
				let infoPopUp;
				// infoPopUp.close();
				// console.log('clicking!');

				infoPopUp = new google.maps.InfoWindow({
					content: 'tempName',
					position: mapsMouseEvent.latLng,
				});
				infoPopUp.setContent(
					JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
				);

				infoPopUp.open(map);
				console.log(mapsMouseEvent.latLng.toJSON());
				return mapsMouseEvent.latLng.toJSON();

				// console.log(infoPopUp);
				// renderMap();
			});
		})
		.then((location) => {
			console.log(location);
			//PLACEHOLDER: createLoc(location)
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

function onAddMarker() {
	console.log('Adding a marker');
	mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
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
}

// onRemoveLoc(3)

function renderLocs(locs) {
	console.log('now rendering***', locs);

	var strHTML = locs
		.map(function (loc) {
			var name = loc.name;
			var weather = loc.weather;
			var id = loc.id;
			console.log('now rendering ', name, weather);
			return `<tr>
            <td>${name}</td>
            <td>${weather}</td>
            <td>
                <button oncick="">Go</button>
                <button onclick="onRemoveLoc(${id})" >Delete</button>
            </td>
        </tr>`;
		})
		.join('');
	document.querySelector('.locs-data').innerHTML = strHTML;
	console.log('strHTML', strHTML);
}

function onGetUserPos() {
	getPosition()
		.then((pos) => {
			console.log('User position is:', pos.coords);
			document.querySelector(
				'.user-pos'
			).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
		})
		.catch((err) => {
			console.log('err!!!', err);
		});
}
function onPanTo() {
	console.log('Panning the Map');
	mapService.panTo(35.6895, 139.6917);
}

function onClickMap() {
	//TODO: get location on map (map)
	//TODO: add marker to the map
	//TODO: pan map
	//TODO: add location to locations Array: createLoc
	//TODO: render
	renderPage();
}

function renderPage(lan, lat) {
	renderMap();
	renderLocations();
	renderCurrLoc(lan, lat);
}

function renderMap() {}
function renderLocations() {}

function renderCurrLoc(lan, lat) {
	document.querySelector(
		'.user-pos'
	).innerText = `Latitude: ${lat} - Longitude: ${lan}`;
}

// function onDelete(loc-id){
//     -->deleteLoc
//     if this is curr location, repan to curr location
//     renderLocs();
// }

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
