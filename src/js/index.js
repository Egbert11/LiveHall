require.config({
	// baseUrl 基目录 
	baseUrl: '../js/lib',
	// paths 指定各个模块位于基目录的路径
	paths: {
		'jquery': 'jquery',
	}
});

requirejs(['jquery'], function (jquery) {
	
	$(function(){
		$('.left_bar_list .li_content').live('click',function(){
			
			$('.left_bar_list li').removeClass('current');
			
			if($(this).parent().hasClass('has_l_2')){
				var nowList = $(this).parent().find('.l_2_list');
				var nowListA = $(this).parent().find('.l_2_list a');
				var nowSelect = false;
				$('.left_bar_list li .l_2_list').slideUp(200);
				if(nowList.css('display') != 'block'){
					nowList.slideDown(200);
				}else{
					$(this).parent().addClass('current');
				}
				for(var i=0; i<nowListA.length; i++){
					if(nowListA.eq(i).hasClass('current')){
						nowSelect = true;
						break;
					}
				}
				if(!nowSelect){
					$(this).parent().addClass('current');
				}
			}else{
				$('.left_bar_list li .l_2_list a').removeClass('current');
				$('.left_bar_list li .l_2_list').slideUp(200);
				$(this).parent().addClass('current');
			}
		});
		
		$('.left_bar_list .l_2_list a').live('click',function(){
			$(this).parent().parent().removeClass('current');
			$('.left_bar_list .l_2_list a').removeClass('current');
			$(this).addClass('current');
		});
		
	});
	
	var picWall = {
		init : function(){
			this.box = $('#picwall');
			this.follow = $('#picwall_follow');
			this.list_pic = $('#picwall .picwall_ul li').not('#picwall_refresh');
			this.list_refresh = $('#picwall_refresh');
			this.addHoverEvent();
		},
		addHoverEvent : function(){
			var _this = this;
			this.list_pic.mouseover(function(e){
				_this.follow.html($(this).find('.detail').html());
			}).mouseout(function(e){
				_this.follow.stop().animate({
					opacity: 0
				},200,
				function() {
					$(this).hide();
				});
			}).mousemove(function(e){
				_this.showPop(e, this)
			});
		},
		showPop : function(e , o){
			var posY = e.pageY - this.box.offset().top;
			var posX = e.pageX - this.box.offset().left;
			this.follow.css({
				left: posX + 10,
				top: posY + 10,
				display: 'block'
			}).stop().animate({
				opacity: 1
			},100);
		}
	}
    picWall.init();

});