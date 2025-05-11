import PackageJSON from '../../package.json';

async function GetTrips() {
    const url = PackageJSON.API.BaseUrl + "/trips";

    const response = await fetch(url, {
        method: "GET",
        credentials: 'include'
    })

    const json = await response.json();

    if(!response.ok) {
        console.log(json);
        return;
    }

    return json;
}

export default GetTrips;