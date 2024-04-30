import { View, StyleSheet, Pressable, Image } from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

function TechnicianTabBar({ state, descriptors, navigation }) {
    const { user } = useSelector(state => state.user)

    return (
        <View style={styles.container}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <Pressable
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{ flex: 1, alignItems: 'center', padding: 8 }}
                        key={index}
                    >
                        {
                            label === 'Home' ?
                                <AntDesign
                                    name='home'
                                    style={{
                                        ...styles.icon,
                                        color: isFocused ? '#E48700' : '#ADADAD'
                                    }}
                                /> : label === 'Emergency-stack' ?
                                    <MaterialCommunityIcons
                                        name='car-emergency'
                                        style={{
                                            ...styles.icon,
                                            color: isFocused ? '#E48700' : '#ADADAD'
                                        }}
                                    /> : <View style={{ borderWidth: 3, borderColor: isFocused ? '#E48700' : '#ADADAD', borderRadius: 24 }}>
                                        <Image
                                            source={user.profilePic.length !== 0 ? { uri: user.profilePic } : require('../../assets/images/avatar.png')}
                                            style={styles.profilePic}
                                            resizeMode='contain'
                                        />
                                    </View>
                        }
                        <View
                            style={{
                                backgroundColor: isFocused ? '#E48700' : 'white',
                                ...styles.indicator
                            }}
                        />
                    </Pressable>
                );
            })}
        </View>
    );
}

export default TechnicianTabBar

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 16,
        elevation: 5,
        marginHorizontal: 8,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 16
    },
    icon: {
        fontSize: 24
    },
    indicator: {
        height: 6,
        width: 6,
        borderRadius: 6,
        marginTop: 6
    },
    profilePic: {
        height: 24,
        width: 24,
        borderRadius: 24
    }
})