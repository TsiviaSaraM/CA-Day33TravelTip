'use strict';

const API_KEY = '1292f0197db43b3b23160be610336116';

export const weatherService = {
	getWeather,
};

function getWeather(loc) {
	console.log('Getting from Network');

	return axios
		.get(
			`https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lng}&appid=${API_KEY}`
		)
		.then((res) => {
			// console.log(res.data.weather[0].description);
			return res.data.weather[0].description;
		});
}
