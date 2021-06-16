export const locService = {
    getLocs
}

//todo create local storage service

//todo update locs objects - weather and timestamps
// createLoc -->saveToStorage
// updateLoc


const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 }, 
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

// function deleteLoc();


