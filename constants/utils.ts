import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../app/api/rasoibox-backend";
import { PromoCode } from "../components/checkout/Checkout";
import { DeliveryAddress, OrderBreakdown, OrderInformationResponse, RecipeInfo } from "../components/order/OrderInformation";
import * as Storage from "../components/common/Storage";
import { AuthDetails } from "../components/common/AuthShim";


export function loginSession(email: string, password: string): Promise<void> {
    return login(email, password).then(loginResponse => {
        if (loginResponse["status"] == 0) {
            AsyncStorage.setItem(Storage.ACCESS_TOKEN, loginResponse[Storage.ACCESS_TOKEN])
            const authDetails: AuthDetails = {
                authenticated: true,
                first_name: loginResponse["first_name"],
                last_name: loginResponse["last_name"],
                email: loginResponse["email"],
                verification_code: loginResponse["verification_code"]
            }
            return Storage.storeAuthDetails(authDetails)
        } else {
            throw Error()
        }
    }).catch(error => {
        console.error(error);
        throw Error(error);
    })
}

export function generateCode(): string {
	return Math.floor(Math.random() * 1_000_000).toString(16);
}

export function twoDecimals(num: number): string {
    return num.toFixed(2)
}

export function getPromoAmount(promoCode: PromoCode): string {
    if (promoCode.amountOff > 0) {
        return "-$" + promoCode.amountOff
    }

    return "-" + promoCode.percentOff + "%"
}

export function getSubtotal(orderInfo: OrderInformationResponse | undefined): number | undefined {
    if (orderInfo == undefined) {
        return undefined
    }

    let total = 0
    Object.values(orderInfo.recipes).forEach(recipe => total += recipe.price)
    return total
}

export function totalAfterPromo(total: number, promoCode: PromoCode): number {
    if (promoCode.amountOff > 0) {
        return total - promoCode.amountOff;
    }

    return total - (promoCode.percentOff / 100) * total;
}

export function getTotal(orderInfo: OrderInformationResponse | undefined): number | undefined {
    if (orderInfo == undefined) {
        return undefined
    }

    let total = getSubtotal(orderInfo)
    const promoCodes: PromoCode[] = orderInfo.orderBreakdown.promoCodes
    if (total != undefined && promoCodes != undefined && promoCodes.length > 0) {
        return totalAfterPromo(total, promoCodes[0])
    } else {
        return total
    }
}

export function cleanDate(date: Date, hideYear?: boolean): string {
	let tzDate = new Date()
	tzDate.setUTCDate(date.getDate())
	tzDate.setUTCMonth(date.getMonth())
	tzDate.setUTCFullYear(date.getFullYear())
	tzDate.setUTCHours(date.getHours())
	tzDate.setUTCMinutes(date.getMinutes())
	tzDate.setUTCSeconds(date.getSeconds())
	tzDate.setUTCMilliseconds(date.getMilliseconds())
    if (hideYear) {
        return (tzDate).toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric"})
    } else {
        return (tzDate).toLocaleDateString('en-us', { weekday:"short", year:"numeric", month:"short", day:"numeric"})
    }
}

export function cleanAddress(address: DeliveryAddress): string {
    let addressStr: string = ""
    if (address.streetNumber > 0) {
        addressStr += address.streetNumber
    }
    addressStr += " "
    addressStr += address.streetName
    addressStr += ", "
    if (address.apartmentNumber != undefined && address.apartmentNumber.length > 0) {
        addressStr += address.apartmentNumber
        addressStr += ", "
    }
    addressStr += address.city
    addressStr += ", "
    addressStr += address.state
    addressStr += " "
    addressStr += address.zipcode

    return addressStr
}

export function orderJsonToOrderInformationResponse(orderJson: any): OrderInformationResponse | undefined {
    if (orderJson == undefined) {
        return undefined
    }
    const items: {[itemId: string] : number} = orderJson['order_breakdown']['items'];
    const promoCodes: PromoCode[] = Object.values(orderJson['order_breakdown']['promo_codes']).map(code => {
        return {
            name: code['name'],
            amountOff: code['amount_off'],
            percentOff: code['percent_off'],
        }
    })
    const orderBreakdown: OrderBreakdown = {
        items: items,
        promoCodes: promoCodes
    }
    const deliveryAddress = {
        city: orderJson['order_delivery_address']['city'],
        state: orderJson['order_delivery_address']['state'],
        zipcode: orderJson['order_delivery_address']['zipcode'],
        userInput: orderJson['order_delivery_address']['user_input'],
        streetName: orderJson['order_delivery_address']['street_name'],
        streetNumber: orderJson['order_delivery_address']['street_number'],
        apartmentNumber: orderJson['order_delivery_address']['apartment_number']
    }
    const recipes: { [recipeName: string] : RecipeInfo } = Object.fromEntries(
        Object.entries(orderJson['recipes']).map(entry => [entry[0], {
            id: entry[1]['id'],
            imageUrl: entry[1]['image_url'],
            servingSize: entry[1]['serving_size'],
            price: entry[1]['price']
        }])
    );

    return {
        orderNumber: orderJson['order_number'],
        orderBreakdown: orderBreakdown,
        orderDate: new Date(orderJson['order_date']),
        recipientName: orderJson['order_recipient_name'],
        deliveryAddress: deliveryAddress,
        totalDollars: orderJson['order_total_dollars'],
        delivered: orderJson['order_delivered'],
        customerEmail: orderJson['customer_email'],
        recipes: recipes,
        createId: orderJson['order_create_id']
    }
}

export function capitalizeFirst(title: string): string {
    const upperCase = title.charAt(0).toUpperCase()
    return upperCase + title.substring(1)
}

export function pluralize(name: string, amount: number) {
	if (amount <= 1) {
		return name;
	}

	if (name == "tomato") {
		return "tomatoes"
	} else if (name == "onion") {
		return "onions"
	} else if (name == "potato") {
        return "potatoes"
    }

	return name;
}

export function getEstimatedDelivery(): string {
    let now = new Date()
    const daysInMillis = 60 * 60 * 24 * 1000
    console.log(now)
    let daysToSunday: number;
    if (now.getDay() < 4) {
        daysToSunday = 7 - now.getDay()
    } else {
        daysToSunday = 7 + 7 - now.getDay()
    }
    return cleanDate(new Date(now.getTime() + daysToSunday * daysInMillis), true)
}