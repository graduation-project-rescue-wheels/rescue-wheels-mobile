import { Pressable } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { mainColor } from '../colors';

const StarFlatListItem = ({ onPress, rate, index }) => {
    return (
        <Pressable onPress={onPress}>
            {
                index < rate ? <AntDesign name="star" size={30} color={mainColor} /> : <AntDesign name="staro" size={30} color={mainColor} />
            }
        </Pressable>
    )
}

export default StarFlatListItem