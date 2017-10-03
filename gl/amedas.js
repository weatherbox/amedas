class AmedasGL {
	constructor (map){
		this.map = map;

		let self = this;
		this._loadAmedasJSON(function (data){
			var data_url = "//s3-ap-northeast-1.amazonaws.com/amedas/temp/" + data.time + ".json";
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
		this.map.addSource('temp-data', {
			type: 'geojson',
			data: geojson
		});

		this.map.addLayer({
			id: 'temp',
			type: 'circle',
			source: 'temp-data',
			paint: {
				'circle-radius': {
					base: 2,
					stops: [[4, 2], [6, 4], [6.99, 6], [7, 10], [10, 16]]
				},
				'circle-opacity': 0.77,
				'circle-color': {
					property: 'temp',
					stops: [
						[-30, '#002080'],
						[-5,  '#0041FF'],
						[0,   '#0096FF'],
						[5,   '#B9EBFF'],
						[10,  '#FFFFF0'],
						[15,  '#FFFF96'],
						[20,  '#FAF500'],
						[25,  '#FF9900'],
						[30,  '#FF2800'],
						[35,  '#B40068'],
					]
				}
			}
		});

		this.map.addLayer({
			id: 'temp-label',
			type: 'symbol',
			source: 'temp-data',
			layout: {
				'text-field': '{tempf}',
				'text-size': {
					base: 1.5,
					stops: [[7, 8], [8, 10]]
				},
				'text-allow-overlap': true
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
					temp: point.temp,
					tempf: point.temp.toFixed(1)
				}
			});
		}

		return geojson;
	}

	_initPopup (){
		var self = this;

		this.map.on('click', function (e){
			var features = self.map.queryRenderedFeatures(e.point, { layers: ['temp'] });
			if (!features.length) return;

			var feature = features[0];
			var popup = new mapboxgl.Popup()
       			.setLngLat(feature.geometry.coordinates)
				.setText(feature.properties.name + ' ' + feature.properties.temp + '℃ ')
				.addTo(self.map);
		});

		this.map.on('mousemove', function(e) {
			var features = self.map.queryRenderedFeatures(e.point, { layers: ['temp'] });
			self.map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
		});
	}
}

