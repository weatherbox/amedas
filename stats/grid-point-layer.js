/* global window */
import DeckGL, {GridLayer} from 'deck.gl';
import {pointToGridData} from './grid-aggregator';

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
    const {colorRange, max} = this.props;
    const colorDomain = this.props.colorDomain || this.state.countRange;

    if (cell.count == 0) return [55, 55, 66];

    const step = max / colorRange.length;
    const idx = Math.floor(cell.count / step);
    const clampIdx = Math.max(Math.min(idx, colorRange.length - 1), 0);

    return colorRange[clampIdx];
  }
};

GridPointLayer.layerName = 'GridPointLayer';

