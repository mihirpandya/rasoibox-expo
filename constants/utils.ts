import { PromoCode } from "../components/checkout/Checkout";

export function twoDecimals(num: number): string {
    return num.toFixed(2)
}

export function getPromoAmount(promoCode: PromoCode): string {
    if (promoCode.amountOff > 0) {
        return "-$" + promoCode.amountOff
    }

    return "-" + promoCode.percentOff + "%"
}

export function totalAfterPromo(total: number, promoCode: PromoCode): number {
    if (promoCode.amountOff > 0) {
        return total - promoCode.amountOff;
    }

    return total - (promoCode.percentOff / 100) * total;
}