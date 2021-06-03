// SS React Native
import 'react-native-gesture-handler';

import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';

import * as Progress from 'react-native-progress';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from './screens/home/HomeScreen';
import PlansScreen from './screens/PlansScreen';

import PlanDetailsScreen from './screens/PlanDetailsScreen';

import ProfileScreen from './screens/ProfileScreen';
import AsqmScreen from './screens/AsqmScreen';
import AsqmQuestions from './screens/AsqmQuestionsScreen';
import AsqmThreadScreen from './screens/AsqmThreadScreen';
import AsqmAddScreen from './screens/AsqmAddScreen';
import AsqmManageReports from './screens/AsqmManageReports';
import CommScreen from './screens/CommScreen';

import ReportsScreen from './screens/home/ReportsScreen';

import ManQuestionsScreen from './screens/home/ManQuestionsScreen';
import ManStudyScreen from './screens/home/ManStudyScreen';

import RecordsScreen from './screens/RecordsScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import TimersScreen from './screens/TimersScreen';
import AddTimerScreen from './screens/AddTimerScreen';
import GuideScreen from './screens/GuideScreen';
import FriendsScreen from './screens/FriendsScreen';
import SettingsScreen from './screens/SettingsScreen';

import {GlobalStyles, GlobalColors} from './src/GlobalStyles';
import {AsyncStorage} from 'react-native';
import {LoginView, CreateAccountView, ResetPwdView} from './src/SignViews';

import StudyProgram from './screens/StudyProgram';
import AddPlan from './screens/AddPlan';

import {authorizedRequest} from './Service';

/* Remove These Later #TODO */
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
/* Remove These Later #TODO */

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const showTabs = (route) => {
  try {
    const routeName = route.state
      ? route.state.routes[route.state.index].name
      : '';

    return (
      !routeName ||
      routeName === '' ||
      [
        'Home',
        'AsqmEntrance',
        'CommScreen',
        'Settings',
        'FriendsEntrance',
        'Friends',
      ].indexOf(routeName) > -1
    );
  } catch {
    return true;
  }
};

function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: GlobalColors.headerBackground,
          elevation: 0,
        },
        headerTintColor: 'black',
        headerTitleStyle: {fontWeight: 'bold'},
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Çalış',
        }}
      />
      <Stack.Screen
        name="PlanDetails"
        component={PlanDetailsScreen}
        options={{title: 'Planım'}}
      />
      <Stack.Screen
        name="AddPlan"
        component={AddPlan}
        options={{title: 'Çalışma Planı Ekle'}}
      />
      <Stack.Screen
        name="StudyProgram"
        component={StudyProgram}
        options={{title: 'Ders Programı'}}
      />
      <Stack.Screen
        name="Plans"
        component={PlansScreen}
        options={{title: 'Çalışma Planlarım'}}
      />
      <Stack.Screen
        name="Reports"
        component={ReportsScreen}
        options={{title: 'Soru Çözümlerim'}}
      />
      <Stack.Screen
        name="ManQuestions"
        component={ManQuestionsScreen}
        options={{title: 'Soru Çözümü Ekle'}}
      />
      <Stack.Screen
        name="ManStudy"
        component={ManStudyScreen}
        options={{title: 'Konu Çalışması Ekle'}}
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
        name="AddTimer"
        component={AddTimerScreen}
        options={{title: 'Sayaç Oluştur', tabBarVisible: false}}
      />
      <Stack.Screen
        name="Guide"
        component={GuideScreen}
        options={{title: 'Puanlar'}}
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
        options={{title: 'Soru Paylaş'}}
      />
      <Stack.Screen
        name="AsqmQuestions"
        component={AsqmQuestions}
        options={{title: 'Sorular'}}
      />
      <Stack.Screen
        name="AsqmAdd"
        component={AsqmAddScreen}
        options={{title: 'Soru Sor'}}
      />
      <Stack.Screen
        name="AsqmThread"
        component={AsqmThreadScreen}
        options={{title: 'Soru'}}
      />
      <Stack.Screen
        name="AsqmManageReports"
        component={AsqmManageReports}
        options={{title: 'Rapor Edilen Gönderiler'}}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: 'Profile Page'}}
      />
    </Stack.Navigator>
  );
}

function CommStack() {
  return (
    <Stack.Navigator
      initialRouteName="FriendsEntrance"
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
        name="Friends"
        component={FriendsScreen}
        options={{title: 'Arkadaşlarım'}}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: 'Profile Page'}}
      />
      <Stack.Screen
        name="Reports"
        component={ReportsScreen}
        options={{title: 'Soru Çözümlerim'}}
      />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        headerStyle: {
          backgroundColor: GlobalColors.headerBackground,
          elevation: 0,
        },
        headerTintColor: 'black',
        headerTitleStyle: {fontWeight: 'bold'},
      }}>
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{title: 'Profilim'}}
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
  const [layoutMode, setLayoutMode] = useState('splashMode');

  useLayoutEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const user = await AsyncStorage.getItem('login_user');
      const pwd = await AsyncStorage.getItem('login_pwd');
      if (user !== null && pwd !== null) {
        global.cred = user;
        global.pwd = pwd;
        connectToServer();
      } else {
        setLayoutMode('loginMode');
      }
    } catch (error) {}
  };

  const connectToServer = () => {
    authorizedRequest('api/account/info', {info_self: true})
      .then((response) => response.json())
      .then((json) => {
        if (json.status && json.status == 401) {
          setLayoutMode('loginMode');
          return;
        }

        global.user = json;
        setLayoutMode('appContainer');
      })
      .catch((error) => setLayoutMode('connectionError'))
      .finally(() => {});
  };

  /**
   * splashMode => Trying to connect to server
   * appContainer => Normal running mode
   * connectionError = Connection error layout mode
   */
  return layoutMode === 'appContainer' ? (
    <AppContainer />
  ) : layoutMode === 'splashMode' ? (
    <SplashContainer />
  ) : layoutMode === 'loginMode' ? (
    <LoginView
      create={() => setLayoutMode('signupMode')}
      forgot={() => setLayoutMode('resetPwdMode')}
      reload={() => checkLogin()}
    />
  ) : layoutMode === 'signupMode' ? (
    <CreateAccountView reload={() => checkLogin()} />
  ) : layoutMode === 'resetPwdMode' ? (
    <ResetPwdView />
  ) : (
    <ErrorContainer tryagain={connectToServer} />
  );
}

const ErrorContainer = ({tryagain}) => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            marginTop: 28,
            marginBottom: 16,
            alignSelf: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>
            Servise Bağlanılamadı
          </Text>
          <Text style={{marginBottom: 12, fontSize: 14}}>
            Tekrar denensin mi?
          </Text>

          <TouchableOpacity
            onPress={() => tryagain()}
            style={{
              backgroundColor: 'whitesmoke',
              padding: 16,
              borderRadius: 12,
            }}>
            <Text>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const SplashContainer = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={require('./assets/adcsr-logo.png')}
          style={{
            width: 96,
            height: 96,
          }}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
};

const AppContainer = () => {
  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor={GlobalColors.headerBackground}
        barStyle={GlobalColors.statusBarFront}
      />
      <Tab.Navigator
        initialRouteName="Feed"
        tabBarOptions={{
          showLabel: false,
          activeTintColor: 'rgba(70,118,163,1)',
          inactiveTintColor: 'rgba(0,0,0,.9)',
          style: {
            backgroundColor: 'white',
          },
        }}>
        <Tab.Screen
          name="HomeStack"
          component={HomeStack}
          options={({route}) => ({
            tabBarVisible: showTabs(route),
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="library" color={color} size={23} />
            ),
          })}
        />

        <Tab.Screen
          name="TogetherStack"
          component={CommStack}
          options={({route}) => ({
            tabBarVisible: showTabs(route),
            tabBarLabel: 'Birlikte',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="account-group"
                color={color}
                size={23}
              />
            ),
          })}
        />

        <Tab.Screen
          name="AsqmStack"
          component={AsqmStack}
          options={({route}) => ({
            tabBarVisible: showTabs(route),
            tabBarLabel: 'Soru Paylaş',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="pencil" color={color} size={23} />
            ),
          })}
        />

        <Tab.Screen
          name="SettingsStack"
          component={SettingsStack}
          options={{
            tabBarLabel: 'Profilim',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="account" color={color} size={23} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
