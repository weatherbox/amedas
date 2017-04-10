/* global window */
import DeckGL, {GridLayer} from 'deck.gl';
import {pointToDensityGridData} from './grid-aggregator';

function _needsReProjectPoints(oldProps, props) {
  return oldProps.cellSize !== props.cellSize;
}

export default class GridPointLayer extends GridLayer {

  updateState({oldProps, props, changeFlags}) {
    if (changeFlags.dataChanged || _needsReProjectPoints(oldProps, props)) {
      const {data, cellSize, getPosition} = this.props;

      const {layerData, countRange} =
        pointToDensityGridData(data, cellSize, getPosition);

      Object.assign(this.state, {layerData, countRange});
    }
  }

};

GridPointLayer.layerName = 'GridPointLayer';

