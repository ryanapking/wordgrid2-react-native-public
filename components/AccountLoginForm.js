import React, { Component } from 'react';
import { View, Button } from 'react-native';
import { Input } from "react-native-elements";
import { connect } from 'react-redux';

import { userStandardLogin } from "../data/redux/user";

class AccountLoginForm extends Component {
  constructor() {
    super();

    this.state = {
      username: "",
      password: "",
    };

  }

  render() {
    const { username, password } = this.state;
    return (
      <View style={{width: '100%'}}>
        <Input
          label="Username or Email"
          autoCapitalize="none"
          onChangeText={ (username) => this.setState({username}) }
        />
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <Input
            label="Password"
            autoCapitalize="none"
            secureTextEntry={true}
            onChangeText={ (password) => this.setState({password}) }
          />
        </View>
        <Button
          disabled={!username || !password}
          title="Login"
          onPress={ () => this.props.userStandardLogin(this.state.username, this.state.password) }
        />
      </View>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = {
  userStandardLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountLoginForm);