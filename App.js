import * as React from 'react';
import { Text, View, Image, Animated} from 'react-native';
import { NavigationContainer, useNavigation, DefaultTheme } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SelectEmoji from './selectemoji';
import ReviewScreen from './ReviewScreen';
import CloudAnimation from './Cloud';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'rgb(193, 196, 192)',
    primary: 'rgb(3, 0, 1)',
  },
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SelectEmoji" component={SelectEmoji} />
      <Stack.Screen name="Review" component={ReviewScreen} />
    </Stack.Navigator>
  );
}

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Image
        source={require('./assets/gradient.png')}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
      />
      <Text style={{fontSize: 48, color: 'white', top: '20%'}}>今天好嗎?</Text>
      <CloudAnimation/>
      <Button onPress={() => navigation.navigate('SelectEmoji')} style={{ position: 'absolute', bottom: '20%' }}>
        立即放鬆！
      </Button>
    </View>
  );
}

/* empty page start */
function SomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={SomeScreen} />
    </Stack.Navigator>
  );
}

function SomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>
        To be update...
      </Text>
    </View>
  );
}
/* empty page end */


function MyTab() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Check-In" component={HomeStack} />
      <Tab.Screen name="..." component={SomeStack} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <MyTab />
    </NavigationContainer>
  );
}