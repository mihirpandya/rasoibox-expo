export function getAvailableItems(): Promise<any> {
    return fetch('https://rasoibox.onrender.com/api/order/get_available_items', {
        method: 'GET',
        headers: {
            "Accept": "application/json"
        }
    })
    .then(response => {
        return response.json();
    })
    .catch(error => console.error(error));
}