import PackageJSON from '../../package.json';

async function EditTripApi(model, id) {
    const url = PackageJSON.API.BaseUrl + `/trips/${id}`;

    const response = await fetch(url, {
        method: "PUT",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(model)
    })

    const json = await response.json();

    if(!response.ok) {
        console.log(json);
        return;
    }

    return json;
}

export default EditTripApi;