export function validateEmail(email: string): boolean {
    const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
    return emailRegex.test(email);
}

export function validateZipcode(zipcode: string): boolean {
    const zipcodeRegex = new RegExp("^[0-9]{5}$")
    return zipcodeRegex.test(zipcode);
}