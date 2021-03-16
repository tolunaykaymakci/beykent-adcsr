// SS React Native
import 'react-native-gesture-handler';

import * as React from 'react';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from './pages/HomeScreen';
import DetailsScreen from './pages/DetailsScreen';
import ProfileScreen from './pages/ProfileScreen';
import SettingsScreen from './pages/SettingsScreen';
import PlansScreen from './pages/PlansScreen';
import AsqmScreen from './pages/AsqmScreen';
import AsqmQuestions from './pages/AsqmQuestionsScreen';
import AsqmThreadScreen from './pages/AsqmThreadScreen';
import CommScreen from './pages/CommScreen';

import Service from './Service';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/* We may not use this one */
const getTabBarVisibility = (route) => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : '';

  if (routeName === 'Plans') {
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
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: '#000',
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
        name="Details"
        component={DetailsScreen}
        options={{title: 'Details Page'}}
      />
      <Stack.Screen
        name="Plans"
        component={PlansScreen}
        options={{title: 'Çalışma Planlarım'}}
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
        name="Details"
        component={DetailsScreen}
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
      <Tab.Navigator
        initialRouteName="Feed"
        tabBarOptions={{
          activeTintColor: '#00f',
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
