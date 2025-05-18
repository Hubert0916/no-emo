import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ActiveMenu from './Timer/ActiveMenu';
import MeditationTimer from './Timer/MeditationTimer';
import WoodFish from './Timer/WoodFish';
import MeditationCountdown from './Timer/MeditationCountdown';
import HomeScreen from './HomeScreen'
import SelectEmoji from './Selectemoji';
import ReviewScreen from './ReviewScreen';
import ProfileScreen from './ProfileScreen';
import MoodDiary from './moodDiary';
import { MyTheme } from './components/Theme';
import RecommendResult from './RecommendResult';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SelectEmoji" component={SelectEmoji} />
      <Stack.Screen name="Review" component={ReviewScreen} />
      <Stack.Screen name="RecommendResult" component={RecommendResult} />
    </Stack.Navigator>
  );
}


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

function MyTab() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Check-In" component={HomeStack} />
      <Tab.Screen name="Relax" component={RelaxStack} /> 
      <Tab.Screen name="Diary" component={MoodDiary} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
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