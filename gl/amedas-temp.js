class AmedasGLTemp {
    constructor (map, data){
        this.map = map;
        this.geojson = this._tempGeoJSON(data);
        this.show();
    }

	_tempGeoJSON (data){
        var features = data.features.filter(function(d){
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

    show (){
		this.map.addSource('temp-data', {
			type: 'geojson',
			data: this.geojson
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
				'text-color': {
                    type: 'interval',
					property: 'temp',
                    stops: [
                        [-100, '#fff'],
                        [0, '#111']
                    ]
                }
			},
			minzoom: 7
		});

		this.map.addLayer({
			id: 'temp-name-label',
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

		//this._initPopup();
	}
    
    remove (){
        this.map.removeLayer('temp-circle');
        this.map.removeLayer('temp-label');
        this.map.removeLayer('temp-name-label');
        this.map.removeSource('temp-data');
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
