import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import { withRouter } from 'react-router-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Icon } from "native-base";

class TopBar extends Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col>
            <Icon type='MaterialCommunityIcons' name='menu' style={styles.menuButton} onPress={() => this.props.openDrawer()} />
          </Col>
          <Col style={styles.titleContainer}>
            <Text style={styles.title} >Title</Text>
          </Col>
          <Col>
            <Icon type='MaterialCommunityIcons' name='home' style={styles.homeButton} onPress={() => this.props.history.push('/')} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

const styles = StyleSheet.create({
  homeButton: {
    paddingRight: 10,
    textAlign: 'right'
  },
  menuButton: {
    paddingLeft: 10
  },
  title: {
    textAlign: 'center',
  },
  titleContainer: {
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default withRouter(TopBar);