import PackageJSON from '../../package.json';

async function DeleteTripApi(id) {
    const url = PackageJSON.API.BaseUrl + `/trips/${id}`;

    const response = await fetch(url, {
        method: "DELETE",
        credentials: 'include'
    })

    const json = await response.json();

    if(!response.ok) {
        console.log(json);
        return;
    }

    return json;
}

export default DeleteTripApi;