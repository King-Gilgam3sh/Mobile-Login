import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignupPage from './components/SignupPage';
import SigninPage from './components/SigninPage';
import LandingPage from './components/LandingPage';
import ForgotPass from './components/ForgotPass';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName = "Signin" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Signin" component={SigninPage}/>
        <Stack.Screen name="Signup" component={SignupPage}/>
        <Stack.Screen name="ForgotPass" component={ForgotPass}/>
        <Stack.Screen name="LandingPage" component={LandingPage}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}






