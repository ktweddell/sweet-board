var message_ids = [];
var slider;

function getSlider(){
	$.ajax({
		url: "get/vintage.php"
	}).done(function(data){
		$('.slider').html(data);
		$('.slider li').width($('body').innerWidth());
		$('.slider').emoji(64);
		slider = $('.slider').slider({
			pager: false,
			controls: false,
			speed: 500,
			adaptiveHeight: true,
			auto: true,
			pause: 5000,
			startSlide: 0,
			infiniteLoop: true,
			mode: 'horizontal'
		});
		$('.vintage').css('visibility', 'visible');
	});
}

function updateSlider(){
	$('.slider').html('');
	getSlider();
}

function getMessage(isLast, message_id){
	$.ajax({
		url: "get/message.php?id=" + message_id
	}).done(function(data){
		$('.wrapper').prepend(data);
		$('article.new').emoji(64);
		$('article.new').find("abbr.timeago").timeago();
		message_ids.push(message_id);
		$('article:not(.hidden)').last().addClass('hidden');
		setTimeout(function(){
			$('article.new').removeClass('new');
		},100);
		if (isLast){
			update();
		} else {
			$('article:not(.hidden)').last().addClass('hidden');
			updateSlider();
		}
	});
}
function update(){
	$.ajax({
		url: "get/update.php"
	}).done(function(data){
		var new_ids = data.split(',');
		var index = 0;
		
		for (var i=0; i<message_ids.length; i++) {
			index = new_ids.indexOf(message_ids[i]);
			if (index > -1) {
				new_ids.splice(index, 1);
			}
		}
		
		if (new_ids.length === 0){
			update();
		} else {
			for (var j=0; j<new_ids.length; j++) {
				var newid=new_ids[j];
				if (j==(new_ids.length-1)){
					getMessage(true, newid);
				} else {
					getMessage(false, newid);
				}
			}
		}
	});
}

jQuery(document).ready(function() {
	$('article').each(function(){
		var id = $(this).attr('data-sid');
		message_ids.push(id);
	});
	$("abbr.timeago").timeago();
	$('article').emoji(64);
	setTimeout(function(){
		update();
	},1000);

	getSlider();
});