/* global window,document */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Header, Button } from 'semantic-ui-react';
import Map from './map.js';

const styles = {
  title1: {
    position: 'absolute',
    top: 15,
    left: 15,
    color: '#fff',
    zIndex: 1000,
    fontSize: '3rem',
    fontWeight: '200'
  },
  title2: {
    position: 'absolute',
    top: 20,
    left: 75,
    margin: 0,
    color: '#fff',
    zIndex: 1000,
    fontWeight: 'normal'
  },
  buttongroup: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    zIndex: 1000,
  },
  button: {
    color: "#fff",
    backgroundColor: "rgba(0, 0,0, 0.8)" 
  }
};

class Root extends Component {
  render() {

    return (
      <div>
        <Header as='h1' style={styles.title1}>24</Header>
        <Header as='h3' style={styles.title2}>時間降水量</Header>
        <Map />
        <Button.Group size='tiny' color='black' style={styles.buttongroup}>
          <Button style={styles.button}>1h</Button>
          <Button style={styles.button}>3h</Button>
          <Button style={styles.button}>24h</Button>
          <Button style={styles.button}>48h</Button>
          <Button style={styles.button}>72h</Button>
        </Button.Group>
      </div>
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement('div')));
