export const utilsService = {
	getRandomId,
	debounce,
};

function getRandomId(){
    return Math.floor(Math.random() * 1000);
}
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// `wait` milliseconds.
function debounce(func, wait = 1000) {
	console.log('Debouncing...');
	let timeout;

	return function executedFunction(...args) {
		const later = () => {
			console.log('Go search!');
			clearTimeout(timeout);
			func(...args);
		};

		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}
