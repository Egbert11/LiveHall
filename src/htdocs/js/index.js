
// 简易tab
function indexEasyTab(tabCName,conCName){
	$('.'+ tabCName +' li').each(function(index){
		$(this).click(function(){
			$('.'+ tabCName +' li').removeClass('active').eq(index).addClass('active');
			$('.'+ conCName +' ul').hide().eq(index).show();
		})
	});
}
// 照片墙
function picWall(){
	var picWall = {
		init : function(){
			this.locked = false;
			this.box = $('#picwall');
			this.follow = $('#picwall_follow');
			this.list_pic = $('#picwall .picwall_ul li').not('.picwall_refresh');
			this.list_refresh = $('.picwall_refresh');
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
			this.list_refresh.click(function(){
				_this.update();
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
		},
		update : function(){
			var _this = this;
			if (_this.locked === true) return false;
			_this.locked = true;
			_this.list_refresh.addClass('loading');
			$.ajax({
				type: 'get',  
				async: false,  
				url: httpRqHost + '/live/top_cb',  
				dataType: 'jsonp',
				success: function(data){
					_this.addToPickWall(data);
				},  
				error: function(){  
					alert('获取照片墙失败');  
				}
			});
		},
		addToPickWall : function(data){
			var _this = this;
			var data = data.data;
			this.box.find('li').not('.picwall_refresh').each(function(i) {
				var actionItem = $(this).find('.ctr_con');
				if(data[i]){
					actionItem.append('<div class="ctr_item">' + _this.itemHtml(data[i]) + '</div>');
				}
				setTimeout(function(){
					_this.changeItem(actionItem);
				},Math.floor(Math.random() * 900));
			});
			setTimeout(function() {
				_this.box.find('.picwall_refresh').removeClass('loading');
				_this.locked = false;
			},
			1300)
		},
		itemHtml : function(data){
			if(data.livetype == 'game'){
				var str_type = 'a_video';
			}else{
				var str_type = 'a_audio';
			}
			var str = '<img src="'+ data.cover +'">\
				<div class="detail">\
					<div class="picwall_follow_img"><img width=166 height=166 src="'+ data.cover +'"></div>\
					<p><em class="a_level"><img src="../image/anchorLevel/'+ data.anchor_level.sublevel +'.png" /></em><span class="a_name">'+ data.nickname +'未</span></p>\
					<p><em class="a_type '+ str_type +'"></em><span class="a_people"><i></i>'+ data.visitor +'</span></p>\
				</div>';
			return str;
		},
		changeItem: function(actionItem) {
			actionItem.stop().animate({
				'top': '-107px'
			},300,function() {
				actionItem.find('.ctr_item').eq(0).remove();
				actionItem.css('top', 0);
			})
		}
	};
	return picWall.init();
}
// banner
function C_focus(cName){
	var focusNow = 0;
	this.focusObj = $('.' + cName);
	this.focusCtrHtml = '<em class="current"></em>';
	this.focusImgs = $('.'+ cName +' .imgbox');
	this.focusLen = $('.'+ cName +' .imgbox').length;
	this.focusPerWidth = this.focusObj.width();
	var _timer = null;
	var _this = this;
	// banner 初始化
	this.init = function(){
		this.addCtr();
		this.addEvent();
		this.autoScroll();
	};
	// banner 添加底部control
	this.addCtr = function(){
		for(var i=1; i<this.focusLen; i++){
			this.focusCtrHtml += '<em></em>';
		}
		this.focusObj.find('.focus_control').html(this.focusCtrHtml);
		this.focusObj.find('.focus_img_bar').width(this.focusLen * this.focusPerWidth);
	};
	// banner 绑定操作事件
	this.addEvent = function(){
		this.focusObj.mouseover(function(){
			$(this).find('.focus_run').show();
			clearInterval(_timer);
		}).mouseout(function(){
			$(this).find('.focus_run').hide();
			_this.autoScroll();
		});
		
		this.focusObj.find('.focus_control em').live('click',function(o){
			focusNow = $(this).index();
			_this.move(focusNow,0);
		});
		
		this.focusObj.find('.focus_run').live('click',function(o){
			if($(this).hasClass('f_left')){
				focusNow --;
				_this.move(focusNow,-1);
			}else{
				focusNow ++;
				_this.move(focusNow,1);
			}
		});
	};
	// banner 自动轮播
	this.autoScroll = function(){
		_timer = setInterval(function(){
			focusNow ++ ;
			_this.move(focusNow,1);
		},4000);
	};
	// banner 轮播的动作
	this.move = function(index,type){
		if(type == -1 && index == -1){
			focusNow = this.focusLen - 1;
			this.focusObj.find('.focus_img_bar').animate({'left': - (this.focusLen-1) * this.focusPerWidth + 'px'},300);
		}else if(type == 1 && index == this.focusLen){
			focusNow = 0;
			this.focusObj.find('.focus_img_bar').animate({'left':'0px'},300);
		}else{
			this.focusObj.find('.focus_img_bar').animate({'left': - index * this.focusPerWidth + 'px'},300);
		}
		setTimeout(function(){
			_this.focusObj.find('.focus_control em').removeClass('current').eq(focusNow).addClass('current');
		},200);
	};
	
	this.init();
}
// 获取banner图 添加到banner容器并执行轮播
function showBanner(){
	$.ajax({
		type: 'get',  
		async: false,  
		url: httpRqHost + '/banner/list_cb',  
		dataType: 'jsonp',  
		success: function(data){  
			addToBanner(data);
		},  
		error: function(){  
			alert('获取banner失败');  
		}
	});
	function addToBanner(data){
		var bannerHtml = '';
		if(data.data != null && data.data.length > 0){
			for(var i=0; i<data.data.length; i++){
				bannerHtml += '<a class="imgbox" target="_blank" title="'+ data.data[i].title +'" href="'+ data.data[i].link +'"><img src="'+ data.data[i].pic +'" alt="banner" width="290" height="320" /></a>';
			}
		}else{
			alert('banner为空'); 
		}
		$('.focus_img_bar').html(bannerHtml);
		var bannerFocus1 = new C_focus('focus1');
	}
}
// 关注某人
function follow(o){
	if(!$(o).hasClass('is_follow')){
		$(o).addClass('is_follow');
	}else{
		$(o).removeClass('is_follow');
	}
}
