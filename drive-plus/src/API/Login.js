import PackageJSON from '../../package.json';

async function LoginApi(model) {
    const url = PackageJSON.API.BaseUrl + "/auth/login";

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

export default LoginApi;