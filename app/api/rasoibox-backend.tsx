const BACKEND: string = "https://rasoibox.onrender.com/api/"

export function getAvailableItems(): Promise<any> {
    return fetch(BACKEND + 'order/get_available_items', {
        method: 'GET',
        headers: {
            "Accept": "application/json"
        }
    }).then(response => {
        return response.json();
    }).catch(error => {
        console.error(error)
        throw error;
    });
}

export function isAuthenticated(token: string | undefined | null): Promise<any> {
    return fetch(BACKEND + 'users/check', {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + token
        }
    }).then(response => {
        return response.json()
    }).catch(error => {
        console.error(error)
        throw error;
    });
}

export function login(email: string, password: string): Promise<any> {
    return fetch(BACKEND + "users/token", {
        "method": "post",
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "accept": "application/json"
        },
        "body": "grant_type=&username=" + email + "&password=" + password + "&scope=&client_id=&client_secret="
    }).then((response) => {
        if (response.status == 200) {
            return response.json()
        } else if (response.status == 401) {
            return {
                "status": -1,
                "error": "invalid username or password"
            }
        }
    }).catch(error => {
        console.error(error);
        throw error;
    })
}