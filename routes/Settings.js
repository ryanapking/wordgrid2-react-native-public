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
      newDisplayName: "",
      displayingUserID: null,
      loading: false
    };
  }

  componentDidMount() {
    this.getDisplayName();
  }

  componentDidUpdate() {
    // we might be displaying a different user's settings, though it's not terribly likely
    if (!this.state.loading && this.state.displayingUserID !== this.props.userID) {
      this.getDisplayName();
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
              value={this.state.newDisplayName}
              onChangeText={ (newDisplayName) => this.setState({newDisplayName})}
            />
          </Item>
        </Form>
        <Button style={{ marginTop: 5 }} full info onPress={() => this.saveDisplayName()}>
          <Text>Save</Text>
        </Button>
      </Content>
    )
  }

  getDisplayName() {
    this.setState({
      loading: true,
      displayName: ""
    });

    const displayNamesRef = firebase.firestore().collection('displayNames');

    displayNamesRef
      .where("id", "==", this.props.userID)
      .limit(1)
      .get()
      .then( (results) => {
        console.log('got display name');
        const displayName = (results.docs.length > 0) ? results.docs[0].id : "";
        this.setState({
          displayName,
          newDisplayName: displayName,
          displayingUserID: this.props.userID
        });
      })
      .catch( (err) => {
        // who knows what happened...
      })
      .finally( () => {
        this.setState({
          loading: false
        });
      });

  }

  saveDisplayName() {
    // only try to save if the displayName has changed.
    if (this.state.displayName === this.state.newDisplayName) {
      return;
    }

    this.setState({
      loading: true,
    });

    const displayNamesRef = firebase.firestore().collection('displayNames');
    const newDisplayNameRef = displayNamesRef.doc(this.state.newDisplayName);

    // search for existing names to be deleted
    displayNamesRef
      .where("id", "==", this.props.userID)
      .get()
      .then( (results) => {

        let batch = firebase.firestore().batch();

        results.docs.forEach( (doc) => {
          const docRef = firebase.firestore().collection('displayNames').doc(doc.id);
          batch.delete( docRef );
        });

        batch.set(newDisplayNameRef, {
          id: this.props.userID
        });

        batch.commit()
          .then( () => {
            console.log('batch success');
          })
          .catch( (err) => {
            console.log('batch error:', err);
          })
          .finally( () => {

          });


      })
      .catch( (err) => {
        // who knows what happened...
      })
      .finally( () => {
        this.setState({
          loading: false
        });
      });

  }










  // will likely use this in the near future for settings besides display name

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