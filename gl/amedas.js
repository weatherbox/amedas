const s3Bucket = "//s3-ap-northeast-1.amazonaws.com/amedas/";


class AmedasGL {
	constructor (map){
		this.map = map;

		let self = this;
		this._loadAmedasJSON(function (data){
			var data_url = s3Bucket + data.time.substr(0, 8) + '/amedas-' + data.time + ".geojson.gz";
			self._loadGeoJSON(data_url);
			console.log(data.time);
			self._showTime(data.time);
		});

        this._initMapEvent();
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

                var init = self._getQueryType() || 'wind';
			    self.show(init);
		    });
	}

	_showTime (time){
        var time_str = time.substr(8, 2) + ":" + time.substr(10, 2);
        window.mapTime.set(time_str);
	}

	
	show (type){
        if (type == this._type) return;
        if (this._layer) this._layer.remove();

        switch (type){
            case 'rain':
                this._layer = new AmedasGLRain(this.map, this.data);
                break;
            case 'temp':
                this._layer = new AmedasGLTemp(this.map, this.data);
                break;
            case 'wind':
                this._layer = new AmedasGLWind(this.map, this.data);
                break;
            case 'sun':
                this._layer = new AmedasGLSun(this.map, this.data);
                break;
            case 'snow':
                this._layer = new AmedasGLSnow(this.map, this.data);
                break;
            default:
                this._layer = null;
                return;
        }

        this._type = type;
        this._setQueryType(type);
    }

    _getQueryType (){
        return location.search.slice(1);
    }

    _setQueryType (type){
        history.replaceState(null, null, '?' + type + location.hash);
    }

    _initMapEvent (){
        this._popup = new mapboxgl.Popup({ closeButton: false });
        this._moving = false;
        this._zooming = false;

        var self = this;
        this.map.on('click', function (e){ self.select(e); });
        this.map.on('mousemove', function (e){ self._hover(e); });
        this.map.on('movestart', function (){ self._moving = true; });
        this.map.on('moveend',   function (){ self._moving = false; });
        this.map.on('zoomstart', function (){ self._zooming = true; });
        this.map.on('zoomend',   function (){ self._zooming = false; });
    }

    _hover (e){
        if (this._moving || this._zooming) return false;

        if (this._layer){
            var features = this._layer.queryFeatures(e.point);
            map.getCanvas().style.cursor = (features.length) ? 'crosshair' : '';
            
            if (!features.length) {
                this._popup.remove();
                return;
            }

            var feature = features[0];
            this._popup.setLngLat(feature.geometry.coordinates)
                .setText(this._layer.featureText(feature))
                .addTo(this.map);
        }
    }

    select (e){
        if (this._layer){
            var features = this._layer.queryFeatures(e.point);   
            if (!features.length) return;
            
            var feature = features[0];
            var id = feature.properties.tid;
            console.log(id);
            window.infoBar.show();
        }
    }
}

