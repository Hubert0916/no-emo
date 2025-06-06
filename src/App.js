import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import ActiveMenu from "./components/timer/ActiveMenu";
import MeditationTimer from "./components/timer/MeditationTimer";
import WoodFish from "./components/timer/WoodFish";
import MeditationCountdown from "./components/timer/MeditationCountdown";
import HomeScreen from "./screens//HomeScreen";
import SelectEmoji from "./screens/SelectEmojiScreen";
import ReviewScreen from "./screens//ReviewScreen";
import ProfileScreen from "./screens/ProfileScreen";
import DiaryScreen from "./screens/DiaryScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import ProfileSetupScreen from "./screens/ProfileSetupScreen";
import RecommendResult from "@/screens/RecommendResult";
import { AuthProvider } from "./contexts/AuthContext";
import Theme from './Theme';

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
      <Stack.Screen
        name="ActiveMenu"
        component={ActiveMenu}
        options={{ title: "放鬆活動" }}
      />
      <Stack.Screen
        name="MeditationTimer"
        component={MeditationTimer}
        options={{ title: "冥想計時器" }}
      />
      <Stack.Screen
        name="WoodFish"
        component={WoodFish}
        options={{ title: "敲木魚" }}
      />
      <Stack.Screen
        name="MeditationCountdown"
        component={MeditationCountdown}
        options={{ title: "冥想中..." }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={ProfileScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
}

function MyTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case "Check-In":
              iconName = focused
                ? "checkmark-circle"
                : "checkmark-circle-outline";
              break;
            case "Relax":
              iconName = focused ? "heart" : "heart-outline";
              break;
            case "Diary":
              iconName = focused ? "book" : "book-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "ellipse";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Theme.Colors.primary, // 使用主題色
        tabBarInactiveTintColor: Theme.Colors.placeholder, // 使用主題色
        tabBarStyle: {
          backgroundColor: Theme.Colors.surface, // Tab Bar 背景色
          borderTopColor: Theme.Colors.border, // Tab Bar 頂部邊框顏色
          // 你也可以在這裡設定其他 tabBarStyle 屬性，如 height
        },
        tabBarLabelStyle: {
          fontSize: Theme.Fonts.sizes.xs, // Tab Bar 文字大小
          fontWeight: Theme.Fonts.weights.medium,
        },
      })}
    >
      <Tab.Screen name="Check-In" component={HomeStack} />
      <Tab.Screen name="Relax" component={RelaxStack} />
      <Tab.Screen name="Diary" component={DiaryScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MyTab />
      </NavigationContainer>
    </AuthProvider>
  );
}
