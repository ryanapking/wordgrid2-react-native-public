import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';

class LoginRedirect extends Component {
  componentDidUpdate() {
    const uid = this.props.user.uid;
    const onLoginPath = (this.props.location.pathname === "/login");
    if (!uid && !onLoginPath) {
      console.log('redirecting...');
      this.props.history.push("/login");
    }
  }
  render() {
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
};

export default withRouter(connect(mapStateToProps)(LoginRedirect));