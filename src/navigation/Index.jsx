import { Provider } from 'react-redux'
import { store } from '../store/store'
import AppNavigationContainer from './AppNavigationContainer'

const Index = () => {
    return (
        <Provider store={store}>
            <AppNavigationContainer />
        </Provider>
    )
}

export default Index