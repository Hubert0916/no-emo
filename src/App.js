import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import ActiveMenu from "@/components/relax/ActiveMenu";
import MeditationTimer from "@/components/relax/MeditationTimer";
import WoodFish from "@/components/relax/WoodFish";
import MeditationCountdown from "@/components/relax/MeditationCountdown";
import HomeScreen from "@/screens/home/HomeScreen";
import SelectEmojiScreen from "@/screens/relax/SelectEmojiScreen";
import ReviewScreen from "@/screens/relax/ReviewScreen";
import DiaryScreen from "@/screens/diary/DiaryScreen";
import AuthScreen from "@/screens/profile/AuthScreen";
import ProfileSetupScreen from "@/screens/profile/ProfileSetupScreen";
import UserProfileScreen from "@/screens/profile/UserProfileScreen";
import RecommendResultScreen from "@/screens/relax/RecommendResultScreen";
import { AuthProvider } from "@/contexts/AuthContext";
import Theme from "@/lib/theme";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SelectEmoji" component={SelectEmojiScreen} />
      <Stack.Screen name="Review" component={ReviewScreen} />
      <Stack.Screen name="RecommendResult" component={RecommendResultScreen} />
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

function DiaryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DiaryMain" component={DiaryScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthScreen} />
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
        tabBarActiveTintColor: Theme.Colors.primary,
        tabBarInactiveTintColor: Theme.Colors.placeholder,
        tabBarStyle: {
          backgroundColor: Theme.Colors.surface,
          borderTopColor: Theme.Colors.border,
        },
        tabBarLabelStyle: {
          fontSize: Theme.Fonts.sizes.xs,
        },
      })}
    >
      <Tab.Screen name="Check-In" component={HomeStack} />
      <Tab.Screen name="Relax" component={RelaxStack} />
      <Tab.Screen name="Diary" component={DiaryStack} />
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
