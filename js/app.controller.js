import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onRemoveLoc = onRemoveLoc;
window.onSearch = onSearch;

function onInit() {
	var idx = 0;
	mapService
		.initMap()
		.then((map) => {
			map.addListener('click', (mapsMouseEvent) => {
				onClickMap(mapsMouseEvent, map, idx++);
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
        </tr>`
    }).join('')
    document.querySelector('.locs-data').innerHTML = strHTML;
    
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
function onPanTo(lat, lan) {
	console.log('Panning the Map');
	mapService.panTo(lat, lan);
}

function onClickMap(mapsMouseEvent, map, id) {
	//add marker to the map
	let infoPopUp;
	infoPopUp = new google.maps.InfoWindow({
		content: 'testing',
		position: mapsMouseEvent.latLng,
	});
	infoPopUp.setContent(
		JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
	);

	infoPopUp.open(map);
	console.log(mapsMouseEvent.latLng);
	// return mapsMouseEvent.latLng.toJSON();

	//saves to Loc service as new loc
	locService.addLoc(
		'idx' + id,
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
	renderLocations();
}

// function renderMap() {}
function renderLocations() {
	let strHTML = '';
	locService.getLocs().then((locs) => {
		locs.map((loc) => {
			// console.log(loc);
			strHTML += `<ul> 
			<li> Name: ${loc.name} </li>
			<li> Lat: ${loc.lat} </li>
			<li> Lng:${loc.lng} </li>
		</ul>
		`;
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
	const prm = Promise.resolve(text)
		.then((res) => {
			panTo(res.lat, res.lng);
			addMarker(res);	
		})
		
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
