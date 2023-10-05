import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { rasoiBoxGrey } from "../../constants/Colors";
import { updateCart } from "../../app/api/rasoibox-backend";

export default function RemoveFromCartButton(props: {
    verificationCode: string | undefined,
    recipeName: string,
    updateCartCallback: () => void,
}) {

    const {verificationCode, recipeName, updateCartCallback} = props;

    function deleteItem() {
        if (verificationCode) {
            updateCart(verificationCode, recipeName, 0).then(_response => updateCartCallback())
        }
    }

    return (
        <View style={styles.deleteItem}>
            <Pressable onPress={deleteItem}>
                <Ionicons name="trash-outline" size={20} color={rasoiBoxGrey} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    deleteItem: {
        justifyContent: 'center',
        left: 40
    },
});