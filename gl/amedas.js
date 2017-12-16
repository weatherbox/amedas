const s3Bucket = "//s3-ap-northeast-1.amazonaws.com/amedas/";


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

			    self.show('temp');
		    });
	}

	_showTime (time){
		var time_str = time.substr(0, 4) + "/" + time.substr(4, 2) + "/" + time.substr(6, 2) +
			" " + time.substr(8, 2) + ":" + time.substr(10, 2);
		//document.getElementById("time").innerHTML = time_str;	
	}

	
	show (type){
        this.temp = new AmedasGLTemp(this.map, this.data);
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
				'text-field': String.fromCharCode("0xf124"),
				'text-rotate': { 
					'type': 'identity',
					'property': 'degree'
				},
                'text-rotation-alignment': 'map',
                'text-font': ['FontAwesome Regular'],
                'text-size': {
                    stops: [
                        [4, 12],
                        [7, 18],
                        [10, 24]
                    ]
                },
                'text-line-height': 1,
                'text-padding': 0,
                'text-allow-overlap': true,
                'icon-optional': true
			},
            paint: {
                'text-color': {
                    type: 'interval',
                    property: 'wind_speed',
                    stops: [
                        [0,  '#b9ebff'],
						[3,  '#0096FF'],
                        [5,  '#0049F5'],
                        [10, '#FAF351'],
                        [15, '#F39D39'],
                        [20, '#EC4125'],
                        [25, '#A62366']
                    ]
                },
                'text-opacity': {
                    stops: [
                        [5, 0.86],
                        [8, 0.95]
                    ]
                }
            },
            filter: ["!=", "wind_dir", "calm"]
		});
		
        this.map.addLayer({
			id: 'wind-dot',
			type: 'symbol',
			source: 'wind-data',
			layout: {
				'text-field': String.fromCharCode("0xf111"),
                'text-font': ['FontAwesome Regular'],
                'text-rotation-alignment': 'map',
                'text-size': {
                    stops: [
                        [6, 6],
                        [8, 10]
                    ]
                },
                'text-line-height': 1,
                'text-padding': 0,
                'text-allow-overlap': true,
                'icon-optional': true
			},
            paint: {
                'text-color': '#aeaeae',
                'text-opacity': {
                    stops: [
                        [5, 0.82],
                        [8, 0.95]
                    ]
                }
            },
            filter: ["==", "wind_dir", "calm"],
			minzoom: 6
		}, 'wind-arrow');

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
				'text-offset': [1.6, -0.2],
                'text-allow-overlap': false
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
					stops: [[7, [0, 1.4]], [10, [0, 1.8]]]
				},
				'text-allow-overlap': false
			},
			paint: {
				'text-color': '#333'
			},
			minzoom: 8.5
		}, 'wind-label');
    }

	_windGeoJSON (){
        var features = this.data.features.filter(function(d){
            return d.properties.wind_dir != null;
        }).map(function(d){
            // for fixed value 0.0
            d.properties.speedf = d.properties.wind_speed.toFixed(1);
            var dir = d.properties.wind_dir;
            d.properties.degree = (dir == 'calm') ? 0 : dir - 45 - 180;
            return d;
        });

		return {
			type: 'FeatureCollection',
			features: features
		};
	}


}

