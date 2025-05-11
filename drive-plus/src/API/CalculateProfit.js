import PackageJSON from '../../package.json';

async function CalculateProfitApi(model) {
    const url = PackageJSON.API.BaseUrl + "/trips/calculate";

    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(model)
    })

    const json = await response.json();

    if(!response.ok) {
        console.log(json);
        return;
    }

    return json;
}

export default CalculateProfitApi;