import { View, StyleSheet, Pressable } from 'react-native';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

function UserTabBar({ state, descriptors, navigation }) {
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
                                    /> : <Ionicons
                                        name='person-circle-outline'
                                        style={{
                                            ...styles.icon,
                                            color: isFocused ? '#E48700' : '#ADADAD'
                                        }}
                                    />
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

export default UserTabBar

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
    }
})