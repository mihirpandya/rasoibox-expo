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

// {
//     "order_number": "80695030",
//     "order_breakdown": {
//       "items": {
//         "20": 19.99
//       },
//       "promo_codes": [
//         {
//           "name": "WELCOME10",
//           "amount_off": null,
//           "percent_off": 10
//         }
//       ]
//     },
//     "order_date": "2023-08-15T17:39:37",
//     "order_recipient_name": "Mihir Pandya",
//     "order_delivery_address": {
//       "city": "San Jose",
//       "state": "CA",
//       "zipcode": "95125",
//       "user_input": "945 Desmet Dr, San Jose, CA 95125, USA",
//       "street_name": "Desmet Drive",
//       "street_number": 945,
//       "apartment_number": ""
//     },
//     "order_total_dollars": 17.99,
//     "order_delivered": false,
//     "recipes": {
//       "Chana Masala": {
//         "id": 38,
//         "image_url": "https://static.wixstatic.com/media/bbf858_7cf3c205476a4ec8bc78b6efb13b6de4~mv2.png",
//         "serving_size": 2,
//         "price": 19.99
//       }
//     },
//     "customer_email": "mihir.m.pandya@gmail.com"
//   }

export interface OrderInformationResponse {

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