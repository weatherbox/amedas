/*
 * @class L.Amedas
 * @inherits L.Layer
 * @author Yuta Tachibana
 *
 * for leaflet v1.0
 *
 * requirements:
 */

L.Amedas = L.Layer.extend({
	options: {},

	initialize: function (url, options){
		L.setOptions(this, options);

		this._url = url;
		this._loadJSON(url);
	},

	onAdd: function (map){
		this._map = map;

		// first draw
		this._update();
	},

	onRemove: function (){
		this._map.getPanes().overlayPane.removeChild(this._layer);
	},

	_loadJSON: function (url){
		var self = this;
		$.getJSON(url, function (data) {
			console.log(data);
			this.data = data;
		});	
	},

	_update: function (){
	},
});

