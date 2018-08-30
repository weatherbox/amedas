import React, {Component} from 'react';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';

import { Header } from 'semantic-ui-react';
import {request, json as requestJSON} from 'd3-request';
import {csvParseRows} from 'd3-dsv';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidGF0dGlpIiwiYSI6ImNqMWFrZ3ZncjAwNmQzM3BmazRtNngxam8ifQ.DNMc6j7E4Gh7UkUAaEAPxA'; // eslint-disable-line

const styles = {
  timeinfo: {
    position: 'absolute',
    top: 20,
    left: 20,
    margin: 0,
    color: '#fff',
    zIndex: 1000,
    fontWeight: 'normal'
  }
};


export default class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 500,
        height: 500
      },
      data: null
    };

    requestJSON('data/amedas-point.json', (error, res) => {
      if (!error) {
        let point = res;
        this.state.point = point;
        this._loadCSV(this.props.url);
      }
    });
  }

  _loadCSV(url) {
    let time;
    let point = this.state.point;

    request(url)
      .get((xhr) => {
        if (!point) return;
        let data = csvParseRows(xhr.responseText, (d, i) => {
          if (i == 0) return null; // header
          if (i == 1) time = d.slice(4, 10);

          let id = d[0];
          if (!point[id]) return;
          return [
            point[id].name,
            +d[12], // value
            point[id].lat,
            point[id].lon
          ];
        });
        this.setState({ url, time, data });
      });
  } 

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
  }

  _resize() {
    this._onChangeViewport({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onChangeViewport(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  _onHover({x, y, object}) {
    this.setState({tx: x, ty: y, hovered: object});
  }

  _renderTooltip() {
    const {tx, ty, hovered} = this.state;

    if (!hovered) {
      return null;
    }
    const name = hovered.points[0][0];
    const count = hovered.count;

    return (
      <div className="tooltip"
           style={{left: tx, top: ty}}>
        <div>{`${name}`}</div>
        <div>{`${count.toFixed(1)} mm`}</div>
      </div>
    );
  }

  _renderTimeInfo() {
    const {time} = this.state;

    if (!time) {
      return null;
    }
    const time_str = time[0] + '/' + time[1] + '/' + time[2] + ' 〜 ' +
      time[3] + '/' + time[4] + '/' + time[5] + ' 期間降水量';

    return <Header as='h3' style={styles.timeinfo}>{time_str}</Header>;
  }

  render() {
    let {viewport, data} = this.state;

    if (this.state.url != this.props.url){
      data = [];
      this._loadCSV(this.props.url);
    }

    return (
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/tattii/cj1bob6hw003t2rr5s2svi3iq"
        dragRotate={true}
        onViewportChange={this._onChangeViewport.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}>
        <div>
          {this._renderTimeInfo()}
          {this._renderTooltip()}
          <DeckGLOverlay
            viewport={viewport}
            data={data || []}
            max={this.props.max}
            onHover={this._onHover.bind(this)}
          />
        </div>
      </MapGL>
    );
  }
}
