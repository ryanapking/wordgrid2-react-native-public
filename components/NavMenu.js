import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import { List, ListItem, Container } from 'native-base';
import { withRouter } from 'react-router-native';

class NavMenu extends Component {

  render() {
    return (
      <Container style={styles.container}>
        <List>
          <ListItem onPress={() => this.navigateTo(`/games`)}>
            <Text>Games</Text>
          </ListItem>
          <ListItem onPress={() => this.navigateTo('/settings')}>
            <Text>Settings</Text>
          </ListItem>
        </List>
      </Container>
    );
  }

  navigateTo(route) {
    this.props.closeDrawer();
    this.props.history.push(route);
  }

}

const styles = StyleSheet.create({
  navItem: {

  },
  container: {
    backgroundColor: 'white'
  }
});

export default withRouter(NavMenu);