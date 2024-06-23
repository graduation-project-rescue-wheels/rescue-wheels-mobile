import { View, StyleSheet, Pressable } from 'react-native';
import { mainColor } from '../../colors'
import PoppinsText from '../../components/PoppinsText';

function HistoryTabBar({ state, descriptors, navigation }) {
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
                        <PoppinsText style={{ color: isFocused ? mainColor : '#ADADAD' }}>{label}</PoppinsText>
                        <View
                            style={{
                                backgroundColor: isFocused ? mainColor : 'white',
                                ...styles.indicator
                            }}
                        />
                    </Pressable>
                );
            })}
        </View>
    );
}

export default HistoryTabBar

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        elevation: 5,
        backgroundColor: 'white',
    },
    indicator: {
        height: 6,
        width: 6,
        borderRadius: 6,
        marginTop: 6
    }
})