import { Image, Pressable, StyleSheet, View } from 'react-native'
import PoppinsText from './PoppinsText'

const UserServicesFlatListItem = ({ imageSrc, label, onPress }) => {
    return (
        <Pressable
            style={styles.container}
            onPress={onPress}
        >
            <View style={styles.imageView}>
                <Image
                    style={styles.image}
                    source={imageSrc}
                />
            </View>
            <PoppinsText style={styles.label}>{label}</PoppinsText>
        </Pressable>
    )
}

export default UserServicesFlatListItem

const styles = StyleSheet.create({
    container: {
        margin: 8,
        alignItems: 'center',
        padding: 8
    },
    image: {
        height: 50,
        width: 50,
        borderRadius: 50,
    },
    label: {
        fontSize: 12
    },
    imageView: {
        elevation: 10,
        borderRadius: 50,
        padding: 4,
        backgroundColor: 'white'
    }
})