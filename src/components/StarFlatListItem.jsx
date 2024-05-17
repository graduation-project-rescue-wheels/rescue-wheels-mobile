import { Pressable } from 'react-native'
import { AntDesign } from '@expo/vector-icons';

const StarFlatListItem = ({ onPress, rate, index }) => {
    return (
        <Pressable onPress={onPress}>
            {
                index < rate ? <AntDesign name="star" size={30} color="#E48700" /> : <AntDesign name="staro" size={30} color="#E48700" />
            }
        </Pressable>
    )
}

export default StarFlatListItem