const BACKEND: string = "https://rasoibox.onrender.com/api/"

export interface OrderBackendApi {
    order_date: Date,
    recipient_first_name: string,
    recipient_last_name: string,
    delivery_address: {
        user_input: string,
        street_name: string,
        street_number: number,
        apartment_number?: string,
        city: string,
        state: string,
        zipcode: string
    },
    phone_number: string,
    promo_codes: string[]
}

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

export function isValidPromoCode(token: string, promo_code: string) {
    return fetch(BACKEND + "order/is_valid_promo_code?promo_code=" + promo_code, {
        "method": "get",
        "headers": {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
    }).then((response) => {
        if (response.status == 200) {
            return response.json()
        } else if (response.status == 400) {
            return {
                "status": -1
            }
        } else {
            return {
                "status": -2
            }
        }
    })
}

export function initiateIntent(token: string) {
    return fetch(BACKEND + "orderV2/initiate_intent", {
        "method": "post",
        "headers": {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
    }).then((response) => {
        if (response.status == 200) {
            return response.json()
        } else if (response.status == 400) {
            return {
                "status": -1
            }
        } else {
            return {
                "status": -2
            }
        }
    })
}

export function initiatePlaceOrder(token: string, order: OrderBackendApi) {
    return fetch(BACKEND + "orderV2/initiate_place_order", {
        "method": "post",
        "headers": {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        "body": JSON.stringify(order)
    }).then((response) => {
        if (response.status == 200) {
            return {
                "status": 0
            }
        } else if (response.status == 400) {
            console.error(response);
            return {
                "status": -2,
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

export function getOrder(token: string, orderNumber: string) {
    return fetch(BACKEND + "order/get_order?order_id=" + orderNumber, {
        "method": "get",
        "headers": {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
    }).then((response) => {
        if (response.status == 200) {
            return response.json()
        } else {
            console.error(response);
            throw Error();
        }
    }).catch((error) => {
        console.error(error);
        throw error;
    })
}

export function getOrderHistory(token: string) {
    return fetch(BACKEND + "order/get_order_history", {
        "method": "get",
        "headers": {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
    }).then((response) => {
        if (response.status == 200) {
            return response.json()
        } else {
            console.error(response);
            throw Error();
        }
    }).catch((error) => {
        console.error(error);
        throw error;
    })
}

export function getRecipeById(id: number) {
    return fetch(BACKEND + "recipe/get_by_id?id=" + id).then((response) => {
        if (response.status == 200) {
            return response.json();
        } else {
            throw Error();
        }
    }).catch((error) => {
        console.error(error);
        throw error;
    })
}

export function getRecipeMetadata(recipeName: string, servingSize: number) {
    return fetch(BACKEND + "recipe/get_recipe_metadata?name=" + recipeName + "&serving_size=" + servingSize).then((response) => {
        if (response.status == 200) {
            return response.json()
        } else {
            throw Error();
        }
    }).catch((error) => {
        console.error(error);
        throw error;
    })
}

export function getRecipeSteps(recipeName: string, servingSize: number) {
    return fetch(BACKEND + "recipe/get_recipe_steps?name=" + recipeName + "&serving_size=" + servingSize).then((response) => {
        if (response.status == 200) {
            return response.json()
        } else {
            throw Error();
        }
    }).catch((error) => {
        console.error(error);
        throw error;
    })
}

export function getActiveRecipes(token: string) {
    return fetch(BACKEND + "order/get_active_recipes", {
        "method": "get",
        "headers": {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
    }).then((response) => {
        if (response.status == 200) {
            return response.json()
        }
        console.error(response);
        throw Error();
    });
}

export function signup(
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    zipcode: string, 
    joinDate: Date, 
    verificationCode: string
) {
    const request_body = {
        "email": email,
        "password": password,
        "first_name": firstName,
        "last_name": lastName,
        "zipcode": zipcode,
        "join_date": joinDate,
        "verification_code": verificationCode
    }

    return fetch(BACKEND + "users/create", {
        "method": "post",
        "headers": {
            "accept": "application/json",
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(request_body)
    }).then((response) => {
        if (response.status == 200) {
            return response.json()
        } else {
            console.error(response);
            return {
                "status": -2
            }
        }
    }).catch ((error) => {
        console.error(error);
        throw error;
    })
}
