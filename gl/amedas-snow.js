class AmedasGLSnow {
    constructor (map, data){
        this.map = map;
        this.geojson = this._snowGeoJSON(data);
        this.show();
    }

	_snowGeoJSON (data){
        var features = data.features.filter(function(d){
            return d.properties.snow != null;
        });

		return {
			type: 'FeatureCollection',
			features: features
		};
	}

    show (){
		this.map.addSource('snow-data', {
			type: 'geojson',
			data: this.geojson
		});

		this.map.addLayer({
			id: 'snow-circle1',
			type: 'circle',
			source: 'snow-data',
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
					property: 'snow',
					stops: [
                        [1,   '#b9ebff'],
						[5,   '#0096FF'],
                        [20,  '#0049F5'],
                        [50,  '#FAF351'],
                        [100, '#F39D39'],
                        [150, '#EC4125'],
                        [200, '#A62366']
					]
				}
			},
            filter: ["!=", "snow", 0]
		});
		
        this.map.addLayer({
			id: 'snow-circle0',
			type: 'circle',
			source: 'snow-data',
			paint: {
				'circle-radius': {
					base: 2,
					stops: [[4, 2], [6, 4], [8, 6], [8.0001, 10], [10, 16]]
				},
				'circle-opacity': 0.77,
				'circle-color': '#ccc'
			},
            filter: ["==", "snow", 0],
			minzoom: 6.5
		}, 'snow-circle1');

		this.map.addLayer({
			id: 'snow-label1',
			type: 'symbol',
			source: 'snow-data',
			layout: {
				'text-field': '{snow}',
				'text-size': {
					base: 1.5,
					stops: [[7, 8], [8, 10]]
				},
				'text-allow-overlap': true
			},
			paint: {
				'text-color': '#111'
			},
            filter: ["!=", "snow", 0],
			minzoom: 7
		});
		
        this.map.addLayer({
			id: 'snow-label0',
			type: 'symbol',
			source: 'snow-data',
			layout: {
				'text-field': '{snow}',
				'text-size': {
					base: 1.5,
					stops: [[7, 8], [8, 10]]
				},
				'text-allow-overlap': true
			},
			paint: {
				'text-color': '#111'
			},
            filter: ["==", "snow", 0],
			minzoom: 8
		});

		this.map.addLayer({
			id: 'snow-name-label',
			type: 'symbol',
			source: 'snow-data',
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
		}, 'snow-circle0');
	}
    
    remove (){
        this.map.removeLayer('snow-circle1');
        this.map.removeLayer('snow-circle0');
        this.map.removeLayer('snow-label1');
        this.map.removeLayer('snow-label0');
        this.map.removeLayer('snow-name-label');
        this.map.removeSource('snow-data');
    }
    
    queryFeatures (point){
		return this.map.queryRenderedFeatures(point, { layers: ['snow-circle1', 'snow-circle0'] });
    }
    featureText (feature){
		return feature.properties.name + ' ' + feature.properties.snow + 'cm'
    }
}

