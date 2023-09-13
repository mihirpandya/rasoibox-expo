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
        if (response.status == 200) {
            return response.json()
        } else {
            return {
                "authenticated": false
            }
        }
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

export function updateCart(verification_code: string, recipe_name: string, serving_size: number) {
    const request_body = {
        "recipe_name": recipe_name,
        "serving_size": serving_size
    }

    return fetch(BACKEND + "order/update_cart?verification_code=" + verification_code, {
        "method": "post",
        "headers": {
            "accept": "application/json",
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(request_body)
    }).then((response) => {
        if (response.status == 200) {
            return {
                "status": 0
            }
        } else if (response.status == 404) {
            return {
                "status": -1
            }
        } else {
            console.error(response);
            throw Error(response.statusText)
        }
    }).catch((error) => {
        console.error(error);
        throw error;
    })
}

export function getCart(verification_code: string) {
    return fetch(BACKEND + "order/get_cart?verification_code=" + verification_code, {
        "method": "get",
        "headers": {
            "accept": "application/json",
        }
    }).then((response) => {
        if (response.status == 200) {
            return response.json()
        } else {
            console.error(response);
            return {}
        }
    }).catch((error => {
        console.error(error);
        throw error;
    }))
}