/* global window */
import DeckGL, {GridLayer} from 'deck.gl';
import {pointToGridData} from './grid-aggregator';
import {quantizeScale} from './node_modules/deck.gl/src/utils/scale-utils';

function _needsReProjectPoints(oldProps, props) {
  return oldProps.cellSize !== props.cellSize;
}

export default class GridPointLayer extends GridLayer {

  updateState({oldProps, props, changeFlags}) {
    if (changeFlags.dataChanged || _needsReProjectPoints(oldProps, props)) {
      const {data, cellSize, getPosition} = this.props;

      const {layerData, countRange} =
        pointToGridData(data, cellSize, getPosition);

      Object.assign(this.state, {layerData, countRange});
    }
  }

  _onGetSublayerColor(cell) {
    const {colorRange} = this.props;
    const colorDomain = this.props.colorDomain || this.state.countRange;

    if (cell.count == 0) return [55, 55, 66];

    return quantizeScale(colorDomain, colorRange, cell.count);
  }
};

GridPointLayer.layerName = 'GridPointLayer';

