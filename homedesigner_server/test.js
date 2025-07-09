import clientPublic from './clientPublic.json';

async function checkUrlExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok; // returns true if the status code is in the range 200-299
    } catch (error) {
        return false; // returns false if the fetch request fails
    }
}

(async () => {
    let check = await checkUrlExists(clientPublic.webStoreUrl);
    console.log(check);
})();