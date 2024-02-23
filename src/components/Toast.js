import { StyleSheet } from "react-native"
import Toast from "react-native-root-toast"

const showToast = (message) => {
    Toast.show(message, {
        duration: Toast.durations.LONG,
        containerStyle: styles.container
    })
}

export default showToast

const styles = StyleSheet.create({
    container: {
        borderRadius: 30,
    }
})