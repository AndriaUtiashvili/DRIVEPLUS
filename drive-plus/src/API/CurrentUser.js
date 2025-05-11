import PackageJSON from '../../package.json';
async function CurrentUser() {
    const url = PackageJSON.API.BaseUrl + "/auth/currentuser";

    const response = await fetch(url, {
        method: "GET",
        credentials: 'include',
    })

    const json = await response.json();

    if(!response.ok) {
        return null;
    }

    return json;
}

export default CurrentUser;