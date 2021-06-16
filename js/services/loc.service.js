const LOCS_KEY = 'locations';
const GEOLOC_API = 'AIzaSyCuXfnc3e6EHlaEeZSoiXAYSxs6y7SKqIQ';

const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]


// const locs = storageService.load(LOCS_KEY) || [];

export const locService = {
	addLoc,
	getLocs,
	removeLoc,
	locs,
	getSearchData,
};

// import { axios } from '../../libs/axios.js';
import { storageService } from './storage-service.js';
import { utilsService } from './utils-service.js';

function addLoc(name, lat, lng) {
	var loc = {
		id: utilsService.getRandomId(),
		name,
		lat,
		lng,
		weather: 'unavailable',
		createdAt: Date.now(),
		updatedAt: Date.now(),
	};
	
	locs.push(loc);
	storageService.save(LOCS_KEY, locs);
	console.log('adding locs');
}

function _testFunctions() {
	addLoc('tokyo', 123, 456);
	console.log(locs);

	updateLoc(locs[2]);
	console.log(locs[2]);
}

// _testFunctions()

function updateLoc(loc) {
	loc.updatedAt = Date.now();
}

function getLocs() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(locs);
		}, 1000);
	});
}

function removeLoc(locId) {
	var toRemove = locs.findIndex((loc) => {
		return loc.id === locId;
	});
	locs.splice(toRemove, 1);
	storageService.save(LOCS_KEY, locs);
}

function getSearchData(text) {
	console.log('getting search data');
	return _loadData('parkway').then((res) => {
		addLoc(text, res.lat, res.lng);
		return res;
	});
}

function _loadData(text) {
	const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${text}y,&key=${GEOLOC_API}`;
	return axios
		.get(url)
		.then((res) => {
			// debugger;
			console.log(res.data.results[0].geometry.location);
			return res.data.results[0].geometry.location;
		})
		.catch((err) => console.log('error: ', err));
}
