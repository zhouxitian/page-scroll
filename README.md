# page-scroll
页面导航描点定位功能,参数设定比较自由,可以根据实际调整定位效果

```javascript
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
	
```