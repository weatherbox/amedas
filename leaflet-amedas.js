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

		if (!url){
			var self = this;
			this._loadAmedasJSON(function (data){
				var data_url = "//s3-ap-northeast-1.amazonaws.com/amedas/wind/" + data.time + ".json";
				self._loadJSON(data_url);
				self._showTime(data.time);
			});

		}else{
			this._loadJSON(url);
		}
	},

	onAdd: function (map){
		this.map = map;
	},

	onRemove: function (){
	},

	getEvents: function (){
		return {
			viewreset: this._update,
			moveend:   this._update,
			zoom:      this._update,
		};
	},

	_loadAmedasJSON: function (callback){
		var url = "//s3-ap-northeast-1.amazonaws.com/amedas/amedas.json";
		this._getJSON(url, function (data){
			callback(data);
		});
	},

	_loadJSON: function (url){
		this._url = url;
		var self = this;
		this._getJSON(url, function (data){
			console.log(data);
			self.data = data;
			self._init();
		});
	},

	_showTime: function (time){
		var time_str = time.substr(0, 4) + "/" + time.substr(4, 2) + "/" + time.substr(6, 2) +
			" " + time.substr(8, 2) + ":" + time.substr(10, 2);
		document.getElementById("time").innerHTML = time_str;	
	},

	// substitute $.getJSON
	_getJSON: function (url, callback){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if ((xhr.readyState === 4) && (xhr.status === 200)) {
				var data = JSON.parse(xhr.responseText);
				callback(data);
			}
		}
		xhr.open("GET", url, true);
		xhr.send(null);	
	},

	_init: function (){
		this._defaultMarkers = L.featureGroup();

		for (id in this.data.data){
			var point = this.data.data[id];

			if (point.type == "observatory"){
				var marker = this._createMarker(point);
				this._defaultMarkers.addLayer(marker);
			}
		}

		this._defaultMarkers.addTo(this.map);
		console.log("default", this._defaultMarkers.getLayers().length);

		// upscaled markers
		this._upscaledMarkers = L.featureGroup();
		this._showUpscaled = false;
	},

	_update: function (){
		var zoom = this._map.getZoom(),
			bounds = this._map.getBounds();

		if (zoom > 7){
			for (id in this.data.data){
				var point = this.data.data[id];

				if (point.type != "observatory"){
					var contains = bounds.contains([point.lat, point.lon]);
					if (!point.show && contains){ 
						point.show = true;
						var marker = this._createMarker(point);
						this._upscaledMarkers.addLayer(marker);
						point.layerId = this._upscaledMarkers.getLayerId(marker);

					}else if (point.show && !contains){
						point.show = false;
						this._upscaledMarkers.removeLayer(point.layerId);
					}
				}
			}

			if (!this._showUpscaled){
				this._showUpscaled = true;
				this._upscaledMarkers.addTo(this.map);
			}

		}else{
			if (this._showUpscaled){
				this._showUpscaled = false;
				this._upscaledMarkers.remove();
			}
		}

		console.log("upscaled:", this._upscaledMarkers.getLayers().length);
	},

	_createMarker: function (point){
		var icon = L.WindBarb.icon({
			deg: this._degrees[point.dir],
			speed: point.speed * 2,
			pointRadius: 4,
			forceDir: true
		});
		var marker = L.marker([point.lat, point.lon], {icon: icon});
		//marker.bindPopup(point.name + '<br>' + point.dir + ' ' + point.speed + 'm/s');
		return marker;
	},

	_degrees: {
		N: 0,   NNE: 22.5,  NE: 45,  ENE: 67.5,
		E: 90,  ESE: 112.5, SE: 135, SSE: 157.5,
		S: 180, SSW: 202.5, SW: 225, WSW: 247.5,
		W: 270, WNW: 292.5, NW: 315, NNW: 337.5
	},

});

