import { Pressable, Text } from "react-native"

export default function TextLink(props: {
    link: string,
    text: string
}) {

    const {link, text} = props;

    return (
        <Pressable onPress={() => window.open(link)}>
            <Text style={{textDecorationLine: 'underline'}}>
                {text}
            </Text>
        </Pressable>
    )
}