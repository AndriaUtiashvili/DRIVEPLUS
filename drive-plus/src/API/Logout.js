import PackageJSON from '../../package.json';

async function LogoutApi() {
    const url = PackageJSON.API.BaseUrl + "/auth/logout";

    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
    })

    const json = await response.json();

    if(!response.ok) {
        console.log(json);
        return;
    }

    return json;
}

export default LogoutApi;