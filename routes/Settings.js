import React, { Component } from 'react';
import {Content, Form, Item, Label, Input, Container, Spinner, Button} from 'native-base';
import firebase from 'react-native-firebase';
import { withRouter } from 'react-router-native';
import { connect } from 'react-redux';
import {Text} from "react-native";

// note: it would be nice to have the settings be a little easier to manage than this. But the display name likely needs to be outside of the other settings to be publicly available

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      displayName: "",
      loading: false,
      docExists: false,
      settingsUserID: null
    };
  }

  componentDidMount() {
    this.getSettings();
  }

  componentDidUpdate() {
    // we might be displaying a different user's settings, though it's not terribly likely
    if (!this.state.loading && this.state.settingsUserID !== this.props.userID) {
      this.getSettings();
    }
  }

  render() {

    if (this.state.loading) {
      return (
        <Container>
          <Spinner color='blue' />
        </Container>
      );
    } else if (this.state.settingsUserID !== this.props.userID) {
      // this.getSettings();
    }

    return (
      <Content>
        <Form>
          <Item floatingLabel>
            <Label>Display Name</Label>
            <Input
              value={this.state.displayName}
              onChangeText={ (displayName) => this.setState({displayName})}
            />
          </Item>
        </Form>
        <Button style={{ marginTop: 5 }} full info onPress={() => this.saveSettings()}>
          <Text>Save</Text>
        </Button>
      </Content>
    )
  }

  saveSettings() {
    this.setState({loading: true});

    if (this.state.docExists) {
      // if userdoc already exists, update it
      this.updateExistingUserdoc();
    } else {
      // this might be a user's first action. create the doc if necessary
      this.saveNewUserdoc();
    }
  }

  updateExistingUserdoc() {
    const userDocRef = firebase.firestore().collection('users').doc(this.props.userID);

    userDocRef.update({
      dname: this.state.displayName
    })
      .then( () => {
        console.log('update succeeded');
      })
      .catch( (err) => {
        // should probs do something here...
        console.log('update failed');
      })
      .finally( () => {
        this.getSettings();
      })
  }

  saveNewUserdoc() {
    const userDocRef = firebase.firestore().collection('users').doc(this.props.userID);

    userDocRef.set({
      dname: this.state.displayName
    })
      .then( () => {
        console.log("new userdoc created... hope you weren't already a user...");
      })
      .catch( () => {
        // do WHAT, man?
        console.log('attempt to create new userDoc failed');
      })
      .finally( () => {
        this.getSettings();
      });
  }

  getSettings() {
    this.setState({
      loading: true,
      settingsUserID: null,
      docExists: false,
      displayName: ""
    });

    const userDocRef = firebase.firestore().collection('users').doc(this.props.userID);

    userDocRef.get()
      .then( (userDoc) => {

        if (!userDoc.exists) {
          this.setState({
            docExists: false,
            settingsUserID: this.props.userID
          });
          return;
        }

        if (userDoc.data().dname) {
          this.setState({
            docExists: true,
            displayName: userDoc.data().dname,
            settingsUserID: this.props.userID
          });
        }

      })
      .catch( (err) => {
        // do something here... but what?
      })
      .finally( () => {
        this.setState({
          loading: false
        })
      });
  }
}

const mapStateToProps = (state) => {
  return {
    userID: state.user.uid
  }
};

export default withRouter(connect(mapStateToProps)(Settings));