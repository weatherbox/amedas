<map-type>
	<div class="map-type">
		<div each='{types}'>
			<input id="map-type-{ id }" type="radio" name="profile" checked={ id == default }>
			<label for="map-type-{ id }">{ name }</label>
		</div>
	</div>

	<script>
		this.types = [
			{ id: 'rain', name: '雨' },
			{ id: 'wind', name: '風' },
			{ id: 'temp', name: '気温' },
			{ id: 'sun',  name: '日照' },
			{ id: 'snow', name: '積雪' }
		]
		this.default = 'wind'
	</script>

	<style>
		:scope * {
			box-sizing: border-box;
		}
		.map-type {
			z-index: 100;
			position: absolute;
			top: 4px;
			right: 10px;
			background: #fff;
			margin: 7px 0 0;
			padding: 2px;
			border-radius: 15px;
			vertical-align: middle;
			box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
		}
		.map-type div {
			display: inline-block;
			margin: 0;
		}
		.map-type label {
		    cursor: pointer;
			vertical-align: top;
			display: block;
			border-radius: 16px;
			padding: 3px 5px;
			font-size: 12px;
			color: rgba(0,0,0,.5);
			line-height: 20px;
			text-align: center;
			width: 54px;
		}
		.map-type input[type=radio]:checked + label {
			background: #eee;
			color: rgba(0,0,0,.75);
		}
		.map-type input[type=radio] {
			display: none;
		}
	</style>
</map-type>


