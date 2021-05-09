import React, {useState, useEffect} from 'react';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {casualRequest} from '../Service';

import TouchChoose from './components/TouchChoose';
import {AsyncStorage} from 'react-native';
import {GlobalStyles, GlobalColors} from './GlobalStyles';

export const LoginView = ({create, forgot, reload}) => {
  const [cred, setCred] = useState('');
  const [pwd, setPwd] = useState('');
  const [layoutVisible, setLayoutVisible] = useState(true);

  const login = () => {
    setLayoutVisible(false);
    casualRequest('api/adcsr/login', {cred, pwd})
      .then((response) => response.json())
      .then(async (json) => {
        if (json.success) {
          try {
            await AsyncStorage.setItem('login_user', cred);
            await AsyncStorage.setItem('login_pwd', pwd);
            reload();
          } catch (error) {
            alert('Bir sorun oluştu');
            setLayoutVisible(true);
          }
        } else {
          alert('Bir sorun oluştu');
          setLayoutVisible(true);
        }
      })
      .catch((error) => {
        console.log(error);
        alert('bir sorun oluştu');
        setLayoutVisible(true);
      })
      .finally(() => {});
  };

  return !layoutVisible ? (
    <></>
  ) : (
    <View style={styles.container}>
      <Text style={styles.logo}>ADCSR</Text>
      <Text style={styles.action}>Giriş Yap</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email yada Kullanıcı Adı"
          placeholderTextColor="#003f5c"
          autoCapitalize="none"
          onChangeText={(text) => setCred(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          secureTextEntry
          style={styles.inputText}
          placeholder="Şifre"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setPwd(text)}
        />
      </View>
      <TouchableOpacity onPress={() => forgot()}>
        <Text style={styles.forgot}>Şifrenizi mi unuttunuz?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => login()} style={styles.loginBtn}>
        <Text style={styles.loginText}>GİRİŞ YAP</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => create()}>
        <Text style={styles.signupText}>Hesap Oluştur</Text>
      </TouchableOpacity>
    </View>
  );
};

export const CreateAccountView = ({reload}) => {
  const [accept, setAccept] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [pwd, setPwd] = useState('');

  const [layoutVisible, setLayoutVisible] = useState(true);

  const createAccount = () => {
    setLayoutVisible(false);
    casualRequest('api/adcsr/signup', {email, username, pwd})
      .then((response) => response.json())
      .then(async (json) => {
        if (json.success) {
          try {
            await AsyncStorage.setItem('login_user', username);
            await AsyncStorage.setItem('login_pwd', pwd);
            reload();
          } catch (error) {
            alert('Bir sorun oluştu');
            setLayoutVisible(true);
          }
        } else {
          alert(json.reason ?? 'Bir sorun oluştu');
          setLayoutVisible(true);
        }
      })
      .catch((error) => {
        console.log(error);
        alert('bir sorun oluştu');
        setLayoutVisible(true);
      })
      .finally(() => {});
  };

  return layoutVisible ? (
    <View style={styles.container}>
      <Text style={styles.logo}>ADCSR</Text>
      <Text style={styles.action}>Hesap Oluştur</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          autoCapitalize="none"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Kullanıcı Adı"
          autoCapitalize="none"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setUsername(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          secureTextEntry
          style={styles.inputText}
          placeholder="Şifre"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setPwd(text)}
        />
      </View>
      <View style={{marginStart: 24, marginEnd: 24}}>
        <TouchChoose
          action={() => {
            setAccept(!accept);
          }}
          title="Kullanım Koşullarını ve Gizlilik Sözleşmesini Kabul Ediyorum"
          icon={accept ? 'checkbox-marked' : 'checkbox-blank-outline'}
          titleSize={14}
          value=""
        />
      </View>
      <TouchableOpacity onPress={() => createAccount()} style={styles.loginBtn}>
        <Text style={styles.loginText}>HESAP OLUŞTUR</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => reload()}>
        <Text style={styles.signupText}>Hesabınız zaten var mı? Giriş Yap</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View></View>
  );
};

export const ResetPwdView = () => {
  return <Text>You forgot biç!</Text>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 46,
    color: GlobalColors.accentColor,
  },
  action: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 12,
    marginBottom: 30,
  },
  inputView: {
    width: '80%',
    backgroundColor: 'rgb(228,228,228)',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'black',
  },
  forgot: {
    color: 'black',
    fontSize: 13,
    fontWeight: 'bold',
  },
  loginBtn: {
    width: '80%',
    backgroundColor: GlobalColors.accentColor,
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
  },
  signupText: {
    marginTop: 12,
    color: 'black',
    padding: 12,
  },
});
