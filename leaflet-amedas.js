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
		this._getJSON(url, function (data) {
			console.log(data);
			this.data = data;
		});
	},

	// substitute $.getJSON
	_getJSON: function (url, callback){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if ((xhr.readyState === 4) && (xhr.status === 200)) {
				var data = JSON.parse(xhr.responseText);
				callback(data);
			}
		}
		xhr.open("GET", url, true);
		xhr.send(null);	
	},

	_update: function (){
	},
});

