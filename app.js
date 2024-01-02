if ('serviceWorker' in navigator) { // check compatability 
    navigator.serviceWorker.register('/sw.js') // register
    .then((res) => {
        console.log('Service worker registered!'); // success
    })
    .catch((err) => {
        console.log('Registration failed!'); // failure
    })
}