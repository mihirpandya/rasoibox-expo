import { View } from "react-native";
import Header from "../../components/common/Header";
import { Redirect, Stack } from "expo-router";
import Footer from "../../components/common/Footer";
import CreatePasswordForm from "../../components/createpassword/CreatePasswordForm";

export default function CreatePassword() {
    const parsedUrl: URL = new URL(location.href)
    const createId: number = Number(parsedUrl.searchParams.get('create_id'))
    const paymentIntent: string | null = parsedUrl.searchParams.get('payment_intent')

    if (isNaN(createId) || paymentIntent == null) {
        return <Redirect href="/signup" />
    } else {
        return (
            <View style={{ height: '100%' }}>
                <Stack.Screen options={{
                    headerShown: false,
                    title: "Rasoi Box"
                }} />
                <Header />
                <CreatePasswordForm createId={createId} paymentIntent={paymentIntent}/>
                <Footer />
            </View>
        )
    }
}