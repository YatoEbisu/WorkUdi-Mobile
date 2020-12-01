import React, {Component} from 'react';
import {
  ImageBackground,
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import backgroundImage from '../../assets/imgs/login.jpg';
import Icon from 'react-native-vector-icons/FontAwesome';
import AuthInput from '../components/AuthInput';
import {server, showError, showSuccess} from '../common';
import axios from 'axios';

const initialState = {
  name: '',
  email: '',
  cpf: '',
  password: '',
  confirmPassword: '',
  stageNew: false,
};

export default class Auth extends Component {
  state = {
    ...initialState,
  };

  signinOrSignup = () => {
    if (this.state.stageNew) {
      this.signup();
    } else {
      this.signin();
    }
  };

  signup = async () => {
    try {
      await axios.post(`${server}/signup`, {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword,
      });

      showSuccess('Usuário cadastro!');
      this.setState({...initialState});
    } catch (e) {
      showError(e);
    }
  };

  signin = async () => {
    try {
      const res = await axios.post(`${server}/signin`, {
        email: this.state.email,
        password: this.state.password,
      });
 
     // AsyncStorage.setItem('userData', JSON.stringify(res.data));
      axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`;
      this.props.navigation.navigate('Home', res.data,);
    } catch (e) {
      showError(e);
    }
  };
  render() {

    const validations = []
    validations.push(this.state.email && this.state.email.includes('@'))
    validations.push(this.state.password && this.state.password.length >= 6)

    if(this.state.stageNew) {
        validations.push(this.state.name && this.state.name.trim().length >= 3)
        validations.push(this.state.password === this.state.confirmPassword)
    }

    const validForm = validations.reduce((t, a) => t && a)


    return (
      <ImageBackground style={styles.background} source={backgroundImage}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            <Icon name="angle-double-right" size={50} color={'#FFF'} />
                <Text style={{marginLeft: '10px'}}>WorkUdi</Text> 
          </Text>
          <Text style={styles.subtitle}>
            {this.state.stageNew ? 'Cadastre-se:' : 'Login:'}
          </Text>
          {this.state.stageNew && (
            <AuthInput
              icon="user"
              placeholder="Name"
              value={this.state.name}
              style={styles.input}
              onChangeText={name => this.setState({name})}
            />
          )}
          <AuthInput
            icon="at"
            placeholder="E-mail"
            value={this.state.email}
            style={styles.input}
            onChangeText={email => this.setState({email})}
          />
             {this.state.stageNew && (
            <AuthInput
              icon="user"
              placeholder="Cpf"
              value={this.state.cpf}
              style={styles.input}
              onChangeText={cpf => this.setState({cpf})}
            />
          )}
          <AuthInput
            icon="lock"
            placeholder="Senha"
            value={this.state.password}
            style={styles.input}
            secureTextEntry={true}
            onChangeText={password => this.setState({password})}
          />
          {this.state.stageNew && (
            <AuthInput
              icon="asterisk"
              placeholder="Confirmar senha"
              value={this.state.confirmPassword}
              style={styles.input}
              secureTextEntry={true}
              onChangeText={confirmPassword => this.setState({confirmPassword})}
            />
          )}
          <TouchableOpacity onPress={this.signinOrSignup} disabled={!validForm}>
            <View style={[styles.button, validForm ? {} : { backgroundColor: '#AAA' }]}>
              <Text style={styles.buttonText}>
                {this.state.stageNew ? 'Cadastrar' : 'Logar'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{padding: 10}}
          onPress={() => this.setState({stageNew: !this.state.stageNew})}>
          <Text style={styles.buttonText2}>
            {this.state.stageNew
              ? 'Já possui cadastro?'
              : 'Ainda não está cadastrado?'}
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Manga',
    color: '#FFF',
    fontSize: 50,
    textAlign: 'center',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  formContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    width: '90%',
    borderRadius: 20,
  },
  input: {
    marginTop: 10,
    backgroundColor: '#FFF',
    opacity: 0.9,
  },
  button: {
    backgroundColor: '#F6B131',
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
    borderRadius: 7,
  },
  buttonText: {
    fontFamily: 'Lato',
    color: '#FFF',
    fontSize: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 10,
  },
  buttonText2: {
    fontFamily: 'sans-serif-light',
    color: '#FFF',
    fontSize: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 2, height: 1},
    textShadowRadius: 10,
  },
  subtitle: {
    fontFamily: 'Lato',
    color: '#FFF',
    fontSize: 20,
    marginTop: 10,
  },
});
