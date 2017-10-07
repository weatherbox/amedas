class AmedasGL {
	constructor (map){
		this.map = map;

		let self = this;
		this._loadAmedasJSON(function (data){
			var data_url = "//s3-ap-northeast-1.amazonaws.com/amedas/wind/" + data.time + ".json";
			self._loadJSON(data_url);
			//self._showTime(data.time);
		});
	}

	_loadAmedasJSON (callback){
		var url = "//s3-ap-northeast-1.amazonaws.com/amedas/amedas.json";
		this._getJSON(url, function (data){
			callback(data);
		});
	}

	_loadJSON (url){
		this._url = url;
		var self = this;
		this._getJSON(url, function (data){
			console.table(data.data);
			self.data = data;
			self._init();
		});
	}

	_showTime (time){
		var time_str = time.substr(0, 4) + "/" + time.substr(4, 2) + "/" + time.substr(6, 2) +
			" " + time.substr(8, 2) + ":" + time.substr(10, 2);
		//document.getElementById("time").innerHTML = time_str;	
	}

	// substitute $.getJSON
	_getJSON (url, callback){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if ((xhr.readyState === 4) && (xhr.status === 200)) {
				var data = JSON.parse(xhr.responseText);
				callback(data);
			}
		}
		xhr.open("GET", url, true);
		xhr.send(null);	
	}
	
	_init (){
		var geojson = this._initGeoJSON();
		this.map.addSource('wind-data', {
			type: 'geojson',
			data: geojson
		});

		this.map.addLayer({
			id: 'wind-arrow',
			type: 'symbol',
			source: 'wind-data',
			layout: {
				'icon-image': { 
					'type': 'categorical',
					'property': 'dir',
					'stops': [['calm', 'dot-11']],
					'default': 'airport-15'
				},
				'icon-rotate': { 
					'type': 'identity',
					'property': 'degree'
				},
				'icon-allow-overlap': true
			}
		});

		this.map.addLayer({
			id: 'wind-label',
			type: 'symbol',
			source: 'wind-data',
			layout: {
				'text-field': '{speedf}',
				'text-size': {
					base: 1.5,
					stops: [[7, 8], [8, 10]]
				},
				'text-offset': [1.6, 0]
			},
			minzoom: 7
		});

		this._initPopup();
	}

	_initGeoJSON (){
		var geojson = {
			type: 'FeatureCollection',
			features: []
		};

		for (var id in this.data.data){
			var point = this.data.data[id];
			geojson.features.push({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [point.lon, point.lat]
				},
				properties: {
					id: id,
					name: point.name,
					dir: point.dir,
					degree: this._degrees(point.dir),
					speed: point.speed,
					speedf: point.speed.toFixed(1)
				}
			});
		}

		return geojson;
	}

	_initPopup (){
		var self = this;

		this.map.on('click', function (e){
			var features = self.map.queryRenderedFeatures(e.point, { layers: ['wind-arrow'] });
			if (!features.length) return;

			var feature = features[0];
			var popup = new mapboxgl.Popup()
       			.setLngLat(feature.geometry.coordinates)
				.setText(feature.properties.name + '  ' + feature.properties.dir + ' ' + feature.properties.speedf + 'm/s ')
				.addTo(self.map);
		});

		this.map.on('mousemove', function(e) {
			var features = self.map.queryRenderedFeatures(e.point, { layers: ['wind-arrow'] });
			self.map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
		});
	}

	_degrees (dir){
		var degrees = {
			N: 0,   NNE: 22.5,  NE: 45,  ENE: 67.5,
			E: 90,  ESE: 112.5, SE: 135, SSE: 157.5,
			S: 180, SSW: 202.5, SW: 225, WSW: 247.5,
			W: 270, WNW: 292.5, NW: 315, NNW: 337.5
		};
		return degrees[dir] - 180;
	}
}

