$(function(){
	/**var options={
		type:1,//查找元素的方式，1：id / 2：className 默认为 1
		       //使用id时容器内的一代children为描点对象，用类名则不限。只要包含了类名并且设置了sid并有对应的内容即可。
		id:"pos",              //type为1时的容器id
		className:"pageScroll",//type为2时的类名
		curName:"cur",//当前页添加的类名
		speed:500,//滚动速度
		startAt:0,//导航出现的滚动距离 默认0 一直存在
		offset:0,//判断中线的偏移百分比(-1到1),如 -0.1表示向"上"移动window一半高度的10%;0.1表示向"下"移动window一半高度的10%;
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
	}**/
	var kk=new pageScroll({
		id:"pos",//容器id
		curName:"cur",//当前页添加的类名
		speed:500,//滚动速度 默认 500
		startAt:0,//导航出现的滚动距离 默认0 一直存在
		scrollTop:true,//页面滚动时是否滚动到顶部。默认false 页面内容在窗口中间
		scrollY:60,//页面滚动时设置偏移值。例如 scrollTop为true。默认是滚动到顶部的。设置了60.则会向下偏移60px
		hideCallback:function(){
			this.container.fadeOut();
			console.log(this.hObj.scrollY,"hide后的回调");
		},
		showCallback:function(){
			this.container.fadeIn();
			console.log(this.hObj.scrollY,"show后的回调");
		}
	});
	
})
