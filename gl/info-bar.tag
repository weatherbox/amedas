<info-bar>
	<div>
		<div class="close"><i class="remove icon grey"></i></div>

		<div class="title">
			<h2>{ title }</h2>
		</div>

		<div class="ui divider" style="margin-bottom:10px"></div>

		<div class="content">
			{ content }
		</div>
	</div>

	<script>
		this.on('mount', function() {
			this.$sidebar = $("#sidebar");
			this.mobile = $(window).width() < 640;
		
			// init pc
			if (!this.mobile){
				this.$sidebar.removeClass("bottom").addClass("right");
				$("#sidebar .close").show();
				$("#sidebar .close").on("click", function(){
					$("#sidebar").sidebar("hide");
				});
			}

			// sidebar setting
			this.$sidebar.sidebar('setting', 'transition', 'overlay')
				.sidebar('setting', 'dimPage', false)
				.sidebar('setting', 'closable', false);
		});

		show (){
			//this.$sidebar.sidebar("show");
			this.$sidebar.addClass("visible");
		}
	</script>

	<style>
		#sidebar { padding:10px; }
		.close { position:absolute; top:5px; right:5px; display:none; }
		.title h2 { font-weight:500; margin-top:8px; }
		.content { margin-top:10px; }
	</style>
</info-bar>

