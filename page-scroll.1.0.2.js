/**
 * page-scroll 1.0.2
 * https://github.com/zhouxitian/page-scroll
 * author:zhouxitian@163.com
 */
;(function($,window,undefined){
	pageScroll=function(opt){
		var t=this;
		t.options={
			type:1,//查找元素的方式，1：id / 2：className 使用id时容器内的一代children为描点对象，用类名则不限。只要包含了类名并且设置了sid并有对应的内容即可。
			id:"pos",              //type为1时的容器id
			className:"pageScroll",//type为2时的类名
			curName:"cur",//当前页添加的类名
			speed:500,//滚动速度
			startAt:0,//导航出现的滚动距离
			offset:0,//判断中线的偏移百分比(-1到1),如 -0.1表示window一半高度的10%;
			            //(默认为窗口的中间，中线用来判断当前页和scrollTop为true时当前页滚动的位置)
			offsetUp:0.3,//中线向上范围的百分比(0到1),如 0.5表示向上移动中线到window顶部距离的50%;
			offsetDown:0.3,//中线向下范围的百分比(0到1),如 0.5表示向下移动中线到window底部距离的50%;
			scrollTop:false,//页面滚动时是否滚动到顶部。默认false 页面内容在窗口中间
			scrollY:0,//页面滚动时设置偏移值。例如 scrollTop为true。默认是滚动到顶部的。设置了60.则会向下偏移60px
			topY:0,//距离顶部的滚动偏移值
			bottomY:10,//距离底部的滚动偏移值
			hold:false,//没有在描点范围内是否保留样式。默认 false 不保留。
			scrollCallback:null,//点击描点滚动后的回调。
			showCallback:null,//导航出现后的回调。
			hideCallback:null//导航隐藏后的回调。
		}
		$.extend(t.options,opt);
		t.container=$("#"+t.options.id);
		t._elemt=t.container.find("*");//所有子对象
		if(t.options.type!=1){
			t._elemt=$("."+t.options.className);
		}
		t.scrolling=false;
		t.hide=true;
		t.hObj={height:window.innerHeight||document.documentElement.clientHeight,ScrollHeight:t.getScrollHeight(),scrollY:t.getScrollTop()};
		t.elemts=new Array();
		t.elemt=new Array();
		var index=0;
		t._elemt.each(function(){//循环描点对象
			var $t=$(this);
			var sid=$t.attr("sid");
			var obj=$("#"+sid);
			if(sid!==undefined&&obj.length>0){
				obj.data("scrollIndex",index);//描点下标
				index++;
				t.elemts.push(obj);//滚动对象(内容区)
				t.elemt.push($t);//有效描点对象(点击区)
				//$t.index=index;//设置描点有效对象下标
				$t.bind("click",function(e){//绑定点击事件
					var href=$t.attr("href");
					if(/^#/.test(href)){
						e=e||event;
						if ( e && e.preventDefault ){//取消默认事件
						   e.preventDefault();
						}else{
						   e.returnValue = false;
						}
					}
					if(!t.scrolling){
						t.scrolling=true;
						var sHeight=obj.height();
						t._elemt.removeClass(t.options.curName);
						$t.addClass(t.options.curName);
						var sTop=obj.offset().top-t.options.scrollY;
						if(!t.options.scrollTop){
							if(t.midHeight-t.hObj.scrollY>=sHeight/2){//内容区比窗口高度要大
								sTop=sTop-((t.hObj.height-sHeight)/2)-t.options.offset*t.hObj.height/2;
							}
						}
						$.when($("html,body").animate({scrollTop:sTop},t.options.speed)).then(function(){//防止触发多次回调
							t.options.scrollCallback&&t.options.scrollCallback.call(t);
							setTimeout(function(){//延迟50ms，预防回调时间上的极小差距导致触发了scroll事件
								t.scrolling=false;
							},50);
						})
					}
				});
			}
		});
		$(window).load(function(){//加载完开始定位才准确
			t.scroll();
			$(window).bind("scroll",function(){
				t.scroll();
			});
		});	
	}
	pageScroll.prototype={
		//获取页面整体高度
		getScrollHeight:function(){
			var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
			if(document.body){
				bodyScrollHeight = document.body.scrollHeight;
			}
			if(document.documentElement){
				documentScrollHeight = document.documentElement.scrollHeight;
			}
			scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
			return scrollHeight;
		},
		//获取滚动条距离顶部的距离
		getScrollTop:function(){
			var scrollPos;  
			if (window.pageYOffset) {  
				scrollPos = window.pageYOffset; }  
			else if (document.compatMode && document.compatMode != 'BackCompat')  
			{ scrollPos = document.documentElement.scrollTop;}  
			else if (document.body) { scrollPos = document.body.scrollTop;}   
			return scrollPos;
		},
		scroll:function(){
			var t=this;
			t.hObj={height:window.innerHeight||document.documentElement.clientHeight,ScrollHeight:t.getScrollHeight(),scrollY:t.getScrollTop()};
			t.midHeight=t.hObj.scrollY+t.hObj.height/2+t.options.offset*t.hObj.height/2;
			t.midUp=t.midHeight-(t.midHeight-t.hObj.scrollY)*t.options.offsetUp;
			t.midDown=t.midHeight+(t.hObj.scrollY+t.hObj.height-t.midHeight)*t.options.offsetDown;
			$(".line").css({top:t.midHeight});
			$(".lineUp").css({top:t.midUp});
			$(".lineDown").css({top:t.midDown});
			if(t.hObj.scrollY>=t.options.startAt&&t.options.type==1&&t.hide){
				t.options.showCallback&&t.options.showCallback.call(t);
				t.hide=false;
			}else if(t.hObj.scrollY<t.options.startAt&&t.options.type==1&&!t.hide){
				t.options.hideCallback&&t.options.hideCallback.call(t);
				t.hide=true;
			}
			if(!t.scrolling){
				t.findMidElemt();
				if(t.midObj){
					var index=t.midObj.data("scrollIndex");//定位描点
					t._elemt.removeClass(t.options.curName);
					t.elemt[index].addClass(t.options.curName);	
				}else{
					if(!t.options.hold){//是否保持cur样式
						t._elemt.removeClass(t.options.curName);
					}
				}
				
			}
		},
		//查找当前描点对象
		findMidElemt:function(){
			var t=this;
			if(t.hObj.scrollY<=t.options.topY){//滚动到顶部
				var _top=t.elemts[0].offset().top;//默认第一个为顶部
				var _height=t.elemts[0].height();
				if(_top<=t.midHeight){
					t.midObj=t.elemts[0];
				}else{
					t.midObj=null;
				}	
			}else if(t.hObj.scrollY+t.hObj.height>=t.hObj.ScrollHeight-t.options.bottomY){//滚动到底部
				var _top=t.elemts[t.elemts.length-1].offset().top;//默认最后一个为底部
				var _height=t.elemts[t.elemts.length-1].height();
				if(_top+_height>=t.midHeight){//顶部或底部对象在可视范围内
					t.midObj=t.elemts[t.elemts.length-1];
				}else{
					t.midObj=null;
				}
			}else{
				var inElemt=new Array();
				for(var i=0;i<t.elemts.length;i++){
					var _top=t.elemts[i].offset().top;
					var _height=t.elemts[i].height();
					var _bottom=_top+_height;
					if(_bottom>=t.midUp&&_top<=t.midDown){//找出出现在3线窗口上的对象
						if(_top<=t.midHeight&&_bottom>=t.midHeight){//判断对象是否在中线上
							t.midObj=t.elemts[i];
							return false;//已经找到在中线上的对象不用再找了
						}
						inElemt.push(t.elemts[i]);
					}else if(_top>t.midDown){//剩余的对象已经不用再比较了
						break;
					}
				}
				if(inElemt.length>0){//如果有出现在3线窗口中的对象
					var findUP=false;
					var d=0;//对比距离用的
					for(var i=0;i<inElemt.length;i++){//循环出现在3线窗口中的对象
						var _top=inElemt[i].offset().top;
						var _height=inElemt[i].height();
						var _bottom=_top+_height;
						if(_top>=t.midUp&&_bottom<t.midHeight){//(上半部分)从上到下判断对象是否完整显示。以最后一个完整显示的对象为当前对象
							t.midObj=inElemt[i];
							findUP=true;
							//return false;
						}else{
							if(findUP){return false;}//之前已经找到了
							if(_bottom<=t.midDown&&_top>t.midHeight){//(下半部分)从上到下判断对象是否完整显示。以第一个完整显示的对象为当前对象
								t.midObj=inElemt[i];
							}else{
								if(_top<t.midUp){
									d=_bottom-t.midUp;
									t.midObj=inElemt[i];
								}else{
									var _d=t.midDown-_top;
									if(_d>d){
										t.midObj=inElemt[i];
									}
								}
							}
						}
					}
				}else{
					t.midObj=null;//没有描点对象出现在3线窗口中
				}
			}
		}
	}
})(jQuery,window);