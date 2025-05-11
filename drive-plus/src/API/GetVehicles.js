import PackageJSON from '../../package.json';

async function GetVehicles() {
    const url = PackageJSON.API.BaseUrl + "/vehicles";

    const response = await fetch(url, {
        method: "GET"
    })

    const json = await response.json();

    if(!response.ok) {
        console.log(json);
        return;
    }

    return json;
}

export default GetVehicles;