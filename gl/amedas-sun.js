class AmedasGLSun {
    constructor (map, data){
        this.map = map;
        this.geojson = this._sunGeoJSON(data);
        this.show();
    }

	_sunGeoJSON (data){
        var features = data.features.filter(function(d){
            return d.properties.sunlight != null;
        });

		return {
			type: 'FeatureCollection',
			features: features
		};
	}

    show (){
		this.map.addSource('sun-data', {
			type: 'geojson',
			data: this.geojson
		});

		this.map.addLayer({
			id: 'sun-circle',
			type: 'circle',
			source: 'sun-data',
			paint: {
				'circle-radius': {
					base: 2,
					stops: [[4, 2], [6, 4], [7, 6], [7.0001, 10], [10, 16]]
				},
				'circle-opacity': {
                    stops: [[4, 0.80], [7, 0.60]]
                },
				'circle-color': {
                    type: 'interval',
					property: 'sunlight',
					stops: [
                        [0,  '#0049F5'],
                        [12, '#b9ebff'],
                        [24, '#FAF351'],
                        [36, '#F39D39'],
                        [48, '#EC4125'],
                        [60, '#A62366']
					]
				}
			}
		});
		

		this.map.addLayer({
			id: 'sun-label',
			type: 'symbol',
			source: 'sun-data',
			layout: {
				'text-field': '{sunlight}',
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
			id: 'sun-name-label',
			type: 'symbol',
			source: 'sun-data',
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
		}, 'sun-circle');
	}
    
    remove (){
        this.map.removeLayer('sun-circle');
        this.map.removeLayer('sun-label');
        this.map.removeLayer('sun-name-label');
        this.map.removeSource('sun-data');
    }
    
    queryFeatures (point){
		return this.map.queryRenderedFeatures(point, { layers: ['sun-circle'] });
    }
    featureText (feature){
		return feature.properties.sunlight + 'min';
    }
}

