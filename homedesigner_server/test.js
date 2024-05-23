

async function checkUrlExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok; // returns true if the status code is in the range 200-299
    } catch (error) {
        return false; // returns false if the fetch request fails
    }
}

(async () => {
    let check = await checkUrlExists('https://fargovintage.fi/en/collections/seating/products/baarijakkarat-malli-64-2-kpl-alvar-aalto-artek-1900-luvun-loppupuol');
    console.log(check);
})();