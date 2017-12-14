const s3Bucket = "//s3-ap-northeast-1.amazonaws.com/amedas/"

class AmedasGL {
	constructor (map){
		this.map = map;

		let self = this;
		this._loadAmedasJSON(function (data){
			var data_url = s3Bucket + data.time.substr(0, 8) + '/amedas-' + data.time + ".geojson.gz";
			self._loadGeoJSON(data_url);
			console.log(data.time);
			//self._showTime(data.time);
		});
	}

	_loadAmedasJSON (callback){
		fetch(s3Bucket + "amedas.json")
            .then(function(res){
                return res.json();
            }).then(function(json){
			    callback(json);
            });
	}

	_loadGeoJSON (url){
		this._url = url;
		var self = this;
		fetch(url)
            .then(function(res){
                return res.json();
            }).then(function(json){
                console.log(json);
			    self.data = json;
			    self._showWind();
		    });
	}

	_showTime (time){
		var time_str = time.substr(0, 4) + "/" + time.substr(4, 2) + "/" + time.substr(6, 2) +
			" " + time.substr(8, 2) + ":" + time.substr(10, 2);
		//document.getElementById("time").innerHTML = time_str;	
	}

	
	_showTemp (){
        var geojson = this._tempGeoJSON();

		this.map.addSource('temp-data', {
			type: 'geojson',
			data: geojson
		});

		this.map.addLayer({
			id: 'temp-circle',
			type: 'circle',
			source: 'temp-data',
			paint: {
				'circle-radius': {
					base: 2,
					stops: [[4, 2], [6, 4], [7, 6], [7.0001, 10], [10, 16]]
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
			paint: {
				'text-color': '#111'
			},
			minzoom: 7
		});

		this.map.addLayer({
			id: 'point-name-label',
			type: 'symbol',
			source: 'temp-data',
			layout: {
				'text-field': '{name}',
				'text-size': 12,
				'text-offset': {
					base: 2,
					stops: [[7, [0, 1.4]], [10, [0, 1.8]]]
				},
				'text-allow-overlap': false
			},
			paint: {
				'text-color': '#333'
			},
			minzoom: 8.5
		}, 'temp-circle');

		this._initPopup();
	}

	_tempGeoJSON (){
        var features = this.data.features.filter(function(d){
            return d.properties.temp != null;
        }).map(function(d){
            // for fixed value 0.0
            d.properties.tempf = d.properties.temp.toFixed(1);
            return d;
        });

		return {
			type: 'FeatureCollection',
			features: features
		};
	}

	_showWind (){
        var geojson = this._windGeoJSON();

		this.map.addSource('wind-data', {
			type: 'geojson',
			data: geojson
		});

        // colored icon (FontAwesome)
        // https://github.com/mapbox/mapbox-gl-js/issues/3605#issuecomment-290110941
		this.map.addLayer({
			id: 'wind-arrow',
			type: 'symbol',
			source: 'wind-data',
			layout: {
				'text-field': { 
					'type': 'categorical',
					'property': 'wind_dir',
					'stops': [['calm', String.fromCharCode("0xf111")]],
					'default': String.fromCharCode("0xf124")
				},
				'text-rotate': { 
					'type': 'identity',
					'property': 'degree'
				},
                'text-font': ['FontAwesome Regular'],
                'text-size': 18,
                'text-line-height': 1,
                'text-padding': 0,
                'text-allow-overlap': true,
                'icon-optional': true
			},
            paint: {
                'text-color': '#333'
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
		
        this.map.addLayer({
			id: 'wind-name-label',
			type: 'symbol',
			source: 'wind-data',
			layout: {
				'text-field': '{name}',
				'text-size': 12,
				'text-offset': {
					base: 2,
					stops: [[7, [0, 1.8]], [10, [0, 2]]]
				},
				'text-allow-overlap': false
			},
			paint: {
				'text-color': '#333'
			},
			minzoom: 8.5
		}, 'wind-arrow');
    }

	_windGeoJSON (){
        var features = this.data.features.filter(function(d){
            return d.properties.wind_dir != null;
        }).map(function(d){
            // for fixed value 0.0
            d.properties.speedf = d.properties.wind_speed.toFixed(1);
            var dir = d.properties.wind_dir;
            d.properties.degree = (dir == 'calm') ? 0 : dir - 45;
            return d;
        });

		return {
			type: 'FeatureCollection',
			features: features
		};
	}


	_initPopup (){
		var self = this;

		this.map.on('click', function (e){
			var features = self.map.queryRenderedFeatures(e.point, { layers: ['temp-circle'] });
			if (!features.length) return;

			var feature = features[0];
			var popup = new mapboxgl.Popup()
       			.setLngLat(feature.geometry.coordinates)
				.setText(feature.properties.name + ' ' + feature.properties.temp + '℃ ')
				.addTo(self.map);
		});

		this.map.on('mousemove', function(e) {
			var features = self.map.queryRenderedFeatures(e.point, { layers: ['temp-circle'] });
			self.map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
		});
	}
}

