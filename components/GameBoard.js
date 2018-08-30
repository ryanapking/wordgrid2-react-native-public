import React, { Component } from 'react';
import {Col, Grid, Row} from "react-native-easy-grid";
import connect from "react-redux/es/connect/connect";
import { withRouter } from 'react-router-native';

import GridSquare from "./GridSquare";

class GameBoard extends Component {
  render() {
    const { board } = this.props;

    return(
      <Grid>
        {board.rows.map((row, i) =>
          <Row key={i}>
            {row.map( (letter, i) =>
              <Col key={i}>
                <GridSquare letter={letter} />
              </Col>
            )}
          </Row>
        )}
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    board: state.board
  }
};

const mapDispatchToProps = {

};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GameBoard));