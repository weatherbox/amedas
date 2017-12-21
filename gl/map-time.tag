<map-time>
	<div class="map-time">
		{ time }
	</div>

	<script>
		this.time = '--:--'

		set(time) {
			this.time = time;
			this.update();
		}
	</script>
	
	<style>
		:scope * {
			box-sizing: border-box;
			-webkit-tap-highlight-color: rgba(0,0,0,0);
		}
		.map-time {
			z-index: 100;
			position: absolute;
			bottom: 10px;
			left: 10px;
			background: #fff;
			margin: 7px 0 0;
			padding: 2px;
			border-radius: 15px;
			vertical-align: middle;
			box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
			font-size: 14px;
			color: rgba(0,0,0,.5);
			line-height: 22px;
			text-align: center;
			width: 80px;
		}
	</style>
</map-time>
