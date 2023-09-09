const BACKEND: string = "https://rasoibox.onrender.com/api/"

export function getAvailableItems(): Promise<any> {
    return fetch(BACKEND + 'order/get_available_items', {
        method: 'GET',
        headers: {
            "Accept": "application/json"
        }
    }).then(response => {
        return response.json();
    }).catch(error => console.error(error));
}

export function isAuthenticated(token: string | undefined | null): Promise<any> {
    console.log("token:")
    console.log(token);
    return fetch(BACKEND + 'users/check', {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + token
        }
    }).then(response => {
        return response.json()
    }).catch(error => console.error(error));
}