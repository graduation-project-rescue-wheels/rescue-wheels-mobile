import { useFonts } from 'expo-font'
import { Text } from 'react-native'

const PoppinsText = ({ style, children, onPress }) => {
    const [fontsLoaded] = useFonts({
        'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf')
    })

    if (!fontsLoaded) {
        return null
    }

    return <Text style={{ fontFamily: 'Poppins-Medium', ...style }} onPress={onPress}>{children}</Text>
}

export default PoppinsText