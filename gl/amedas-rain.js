class AmedasGLRain {
    constructor (map, data){
        this.map = map;
        this.geojson = this._rainGeoJSON(data);
        this.show();
    }

	_rainGeoJSON (data){
        var features = data.features.filter(function(d){
            return d.properties.rain != null;
        }).map(function(d){
            // for fixed value 0.0
            var rain = d.properties.rain;
            d.properties.rainf = (rain == 0) ? '0' : rain.toFixed(1);
            return d;
        });

		return {
			type: 'FeatureCollection',
			features: features
		};
	}

    show (){
		this.map.addSource('rain-data', {
			type: 'geojson',
			data: this.geojson
		});

		this.map.addLayer({
			id: 'rain-circle1',
			type: 'circle',
			source: 'rain-data',
			paint: {
				'circle-radius': {
					base: 2,
					stops: [[4, 2], [6, 4], [7, 6], [7.0001, 10], [10, 16]]
				},
				'circle-opacity': {
                    stops: [[4, 0.98], [7, 0.70]]
                },
				'circle-color': {
                    type: 'interval',
					property: 'rain',
					stops: [
                        [0.1, '#c6dbef'],
                        [1,   '#b9ebff'],
						[5,   '#0096FF'],
                        [10,  '#0049F5'],
                        [20,  '#FAF351'],
                        [30,  '#F39D39'],
                        [50,  '#EC4125'],
                        [80,  '#A62366']
					]
				}
			},
            filter: ["!=", "rain", 0]
		});
		
        this.map.addLayer({
			id: 'rain-circle0',
			type: 'circle',
			source: 'rain-data',
			paint: {
				'circle-radius': {
					base: 2,
					stops: [[4, 2], [6, 4], [8, 6], [8.0001, 10], [10, 16]]
				},
				'circle-opacity': 0.77,
				'circle-color': '#ccc'
			},
            filter: ["==", "rain", 0],
			minzoom: 6.5
		}, 'rain-circle1');

		this.map.addLayer({
			id: 'rain-label1',
			type: 'symbol',
			source: 'rain-data',
			layout: {
				'text-field': '{rainf}',
				'text-size': {
					base: 1.5,
					stops: [[7, 8], [8, 10]]
				},
				'text-allow-overlap': true
			},
			paint: {
				'text-color': '#111'
			},
            filter: ["!=", "rain", 0],
			minzoom: 7
		});
		
        this.map.addLayer({
			id: 'rain-label0',
			type: 'symbol',
			source: 'rain-data',
			layout: {
				'text-field': '{rainf}',
				'text-size': {
					base: 1.5,
					stops: [[7, 8], [8, 10]]
				},
				'text-allow-overlap': true
			},
			paint: {
				'text-color': '#111'
			},
            filter: ["==", "rain", 0],
			minzoom: 8
		});

		this.map.addLayer({
			id: 'rain-name-label',
			type: 'symbol',
			source: 'rain-data',
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
			minzoom: 8.7
		}, 'rain-circle0');
	}
    
    remove (){
        this.map.removeLayer('rain-circle1');
        this.map.removeLayer('rain-circle0');
        this.map.removeLayer('rain-label1');
        this.map.removeLayer('rain-label0');
        this.map.removeLayer('rain-name-label');
        this.map.removeSource('rain-data');
    }
    
    queryFeatures (point){
		return this.map.queryRenderedFeatures(point, { layers: ['rain-circle1', 'rain-circle0'] });
    }
    featureText (feature){
		return feature.properties.name + ' ' + feature.properties.rainf + 'mm'
    }
}

