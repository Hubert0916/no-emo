import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ActiveMenu from './components/timer/ActiveMenu';
import MeditationTimer from './components/timer/MeditationTimer';
import WoodFish from './components/timer/WoodFish';
import MeditationCountdown from './components/timer/MeditationCountdown';
import HomeScreen from './screens//HomeScreen'
import SelectEmoji from './screens/SelectEmojiScreen';
import ReviewScreen from './screens//ReviewScreen';
import ProfileScreen from './screens/ProfileScreen';
import DiaryScreen from './screens/DiaryScreen';
import RecommendResult from '@/screens/RecommendResult';

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
      <Tab.Screen name="Diary" component={DiaryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyTab />
    </NavigationContainer>
  );
}