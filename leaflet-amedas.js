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
		this._markers = [];
		this._loadJSON(url);
	},

	onAdd: function (map){
		this.map = map;
	},

	onRemove: function (){
	},

	_loadJSON: function (url){
		var self = this;
		this._getJSON(url, function (data) {
			console.log(data);
			self.data = data;
			self._update();
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
		for (id in this.data.data){
			var point = this.data.data[id];

			if (point.type == "airport" || point.type == "observatory"){
				var marker = L.marker([point.lat, point.lon]);
				marker.bindPopup(point.name);
				marker.addTo(this.map);
				this._markers.push(marker);
			}
		}
		console.log(this._markers.length);
	},
});

