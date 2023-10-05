import React, { useEffect, useState } from 'react';
import MealKits from "../../components/menu/MealKits";
import { verify } from '../api/rasoibox-backend';

export default function Menu() {
    const parsedUrl: URL = new URL(location.href)
    const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

    function verifyIfNeeded() {
        const verificationCode: string | null = parsedUrl.searchParams.get('id')
        if (verificationCode) {
            verify(verificationCode)
                .then(_r => setShowSuccessToast(true))
                .catch(e => console.error(e))
        }
    }
    
    useEffect(() => verifyIfNeeded(), [])

    return <MealKits />
}