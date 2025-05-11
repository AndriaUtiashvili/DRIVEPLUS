import PackageJSON from '../../package.json';

async function GetStates() {
    const url = PackageJSON.API.BaseUrl + "/states";

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

export default GetStates;