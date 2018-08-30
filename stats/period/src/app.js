/* global window */
import React, {Component} from 'react';
import Map from './map';
import Charts from './charts';


export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ...props,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        ...props.viewport
      },
      url: 'data/pre_sm20180628-20180708.csv',
      max: 1000,
      status: 'LOADING',
      selectedHour: null
    };
    this._resize = this._resize.bind(this);
  }

  componentDidMount() {
    this._processData();
    window.addEventListener('resize', this._resize);
    this._resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }
  _processData() {
      this.setState({status: 'LOADED'});
  }

  _onHighlight(highlightedHour) {
    this.setState({highlightedHour});
  }


  _onSelect(selectedHour) {
    this.setState({selectedHour:
      selectedHour === this.state.selectedHour ?
        null :
        selectedHour
      });
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _updateLayerSettings(settings) {
    this.setState({settings});
  }

  render() {
    return (
      <div>
        <Map
          url={this.state.url}
          max={this.state.max}
        />
        <Charts {...this.state}
          highlight={hour => this._onHighlight(hour)}
          select={hour => this._onSelect(hour)}
        />
      </div>
    );
  }
}
