import * as React from 'react';
import { Text, View, Image, Animated} from 'react-native';
import { NavigationContainer, useNavigation, DefaultTheme } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SelectEmoji from './Selectemoji';
import ReviewScreen from './ReviewScreen';
import ActiveMenu from './Timer/ActiveMenu';
import MeditationTimer from './Timer/MeditationTimer';
import WoodFish from './Timer/WoodFish';
import MeditationCountdown from './Timer/MeditationCountdown';
import CloudAnimation from './components/Cloud';
import MoodDiary from './moodDiary'

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
        source={require('../assets/gradient.png')}
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

function MyTab() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Check-In" component={HomeStack} />
      <Tab.Screen name="Relax" component={RelaxStack} /> 
      <Tab.Screen name="Diary" component={MoodDiary} />
      <Tab.Screen name="..." component={SomeStack} />
    </Tab.Navigator>
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

function RelaxStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="ActiveMenu" component={ActiveMenu} options={{ title: '放鬆活動' }} />
      <Stack.Screen name="MeditationTimer" component={MeditationTimer} options={{ title: '冥想計時器' }} />
      <Stack.Screen name="WoodFish" component={WoodFish} options={{ title: '敲木魚' }} />
      <Stack.Screen name="MeditationCountdown" component={MeditationCountdown} options={{ title: '冥想中...' }} />
    </Stack.Navigator>
  );
}


export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <MyTab />
    </NavigationContainer>
  );
}