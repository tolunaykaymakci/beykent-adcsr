// SS React Native
import 'react-native-gesture-handler';

import * as React from 'react';
import {StatusBar} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from './screens/HomeScreen';
import PlansScreen from './screens/PlansScreen';

import PlanDetailsScreen from './screens/PlanDetailsScreen';

import ProfileScreen from './screens/ProfileScreen';
import AsqmScreen from './screens/AsqmScreen';
import AsqmQuestions from './screens/AsqmQuestionsScreen';
import AsqmThreadScreen from './screens/AsqmThreadScreen';
import CommScreen from './screens/CommScreen';

// New Screens!

import QuestionsReportScreen from './screens/QuestionsReportScreen';
import StudiesReportScreen from './screens/StudiesReportScreen';

import RecordsScreen from './screens/RecordsScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import TimersScreen from './screens/TimersScreen';
import GuideScreen from './screens/GuideScreen';
import SettingsScreen from './screens/SettingsScreen';

import {GlobalStyles, GlobalColors} from './src/GlobalStyles';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/* We may not use this one */
const getTabBarVisibility = (route) => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : '';

  const hideTabsScreens = ['Plans', 'PlanDetails'];

  if (hideTabsScreens.indexOf(routeName) > -1) {
    return false;
  }

  return true;
};

function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: GlobalColors.windowBackground,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: GlobalColors.titleText,
        headerTitleStyle: {},
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Soru Sayacı',
        }}
      />
      <Stack.Screen
        name="PlanDetails"
        component={PlanDetailsScreen}
        options={{title: 'Planım'}}
      />
      <Stack.Screen
        name="Plans"
        component={PlansScreen}
        options={{title: 'Çalışma Planlarım'}}
      />
      <Stack.Screen
        name="QuestionsReport"
        component={QuestionsReportScreen}
        options={{title: 'Soru Çözümlerim'}}
      />
      <Stack.Screen
        name="StudiesReport"
        component={StudiesReportScreen}
        options={{title: 'Çalışmalarım'}}
      />

      <Stack.Screen
        name="Records"
        component={RecordsScreen}
        options={{title: 'Kayıtlarım'}}
      />
      <Stack.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{title: 'İstatistiklerim'}}
      />
      <Stack.Screen
        name="Timers"
        component={TimersScreen}
        options={{title: 'Sayaçlarım'}}
      />
      <Stack.Screen
        name="Guide"
        component={GuideScreen}
        options={{title: 'Puanlar & Tercih'}}
      />
    </Stack.Navigator>
  );
}

function AsqmStack() {
  return (
    <Stack.Navigator
      initialRouteName="AsqmEntrance"
      screenOptions={{
        headerStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: '#000',
        headerTitleStyle: {},
      }}>
      <Stack.Screen
        name="AsqmEntrance"
        component={AsqmScreen}
        options={{title: 'Sor & Çöz'}}
      />
      <Stack.Screen
        name="AsqmQuestions"
        component={AsqmQuestions}
        options={{title: 'Sorular'}}
      />
      <Stack.Screen
        name="AsqmThread"
        component={AsqmThreadScreen}
        options={{title: 'Soru'}}
      />
    </Stack.Navigator>
  );
}

function CommStack() {
  return (
    <Stack.Navigator
      initialRouteName="AsqmEntrance"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: '#000',
        headerTitleStyle: {},
      }}>
      <Stack.Screen
        name="CommScreen"
        component={CommScreen}
        options={{title: 'Forum'}}
      />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        headerStyle: {backgroundColor: '#42f44b'},
        headerTintColor: '#fff',
        headerTitleStyle: {fontWeight: 'bold'},
      }}>
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{title: 'Setting Page'}}
      />
      <Stack.Screen
        name="PlanDetails"
        component={PlanDetailsScreen}
        options={{title: 'Details Page'}}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: 'Profile Page'}}
      />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor={GlobalColors.windowBackground}
        barStyle={GlobalColors.statusBarFront}
      />
      <Tab.Navigator
        initialRouteName="Feed"
        tabBarOptions={{
          activeTintColor: '#00f',
          inactiveTintColor: '#f00',
          style: {
            backgroundColor: GlobalColors.primaryCard,
          },
        }}>
        <Tab.Screen
          name="HomeStack"
          component={HomeStack}
          options={({route}) => ({
            tabBarVisible: getTabBarVisibility(route),
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          })}
        />

        <Tab.Screen
          name="AsqmStack"
          component={AsqmStack}
          options={({route}) => ({
            tabBarVisible: getTabBarVisibility(route),
            tabBarLabel: 'Sor & Çöz',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="chart-bubble"
                color={color}
                size={size}
              />
            ),
          })}
        />

        <Tab.Screen
          name="CommStack"
          component={CommStack}
          options={({route}) => ({
            tabBarVisible: getTabBarVisibility(route),
            tabBarLabel: 'Forum',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="chart-bubble"
                color={color}
                size={size}
              />
            ),
          })}
        />

        <Tab.Screen
          name="SettingsStack"
          component={SettingsStack}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="dns" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
