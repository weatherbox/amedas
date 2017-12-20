mapboxgl.accessToken = 'pk.eyJ1IjoidGF0dGlpIiwiYSI6ImNqMWFrZ3ZncjAwNmQzM3BmazRtNngxam8ifQ.DNMc6j7E4Gh7UkUAaEAPxA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/tattii/cj8fozpkv0jn22rnwn6h65hvc',
    zoom: 5,
    center: [136.6, 35.5],
    attributionControl: false,
    logoPosition: 'bottom-right',
    hash: true,
    localIdeographFontFamily: "'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ ProN W3', Meiryo, メイリオ, sans-serif"
});

map.on('load', function() {
    var amedas = new AmedasGL(map);
});

