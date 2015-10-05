# 介绍 #


TB.widget.SimpleSlide 是淘宝网站频道页使用的轮播卡盘脚本实现，用于展示促销大图或广告。支持自动切换，及滚动切换、淡入淡出两种切换效果。

# Usage #

TB.widget.SimpleSlide基于 Unobtrusive Javascript 的思想构建，分离了结构、表现及行为。典型使用形式如下：

xHTML:
```
<div id="slide-demo">
  <ul>
    <li> 
      内容块 或 <iframe> 
    </li>
    <li>
      内容块 或 <iframe> 
    </li>
    ......
  </ul>
</div>
```

CSS:
```
<style type="text/css">
#slide-demo {
        margin: 0;
	padding: 0;
	list-style: none;
        /* 必须指定宽度和高度 */
	width: 360px;
	height: 190px;
        /* 要求相对定位和隐藏溢出 */
        position: relative;
	overflow: hidden;
}
</style>
```

JavaScript:
```
<script type="text/javascript">
TB.widget.SimpleSlide.decorate('slide-demo' [,config]);
</script>
```

TB.widget.SimpleSlide 会自动产生一个控制条<ul>，并插入到轮播卡盘<ul>之后。控制条<ul>根据内容块的数量产生对应数目的<li>，每个<li>的innerHTML即它的索引值+1。<br>
<br>
<h2>Config 参数说明</h2>

<table><thead><th> 参数名 </th><th> 可选值 </th><th> 备注 </th></thead><tbody>
<tr><td> slidesClass </td><td> 自定义/空 </td><td> container下第一个拥有该className 命名的<ul>将会被认为是轮播卡盘的标签，默认为 <i>Slides</i> 。如果不提供，将自动取container下的第一个<ul> </td></tr>
<tr><td> triggersClass </td><td> 自定义 </td><td> 自动生成的控制条<ul>的className，用于定义控制条的样式，为兼容之前的版本，默认值为 SlideTriggers ，TBra默认样式使用 <i>tb-slide-triggers</i> 。参见后面的版本说明。</td></tr>
<tr><td> currentClass </td><td> 自定义 </td><td> 控制条<ul>的显示当前状态的<li>的className。TBra默认样式使用 <i>current</i> 。参见后面的版本说明。 </td></tr>
<tr><td> eventType </td><td> mouse / click </td><td> click 即鼠标点击触发切换，mouse 即鼠标移动到控制条<li>上便触发。默认值为 <i>click</i> 。 </td></tr>
<tr><td> disableAutoPlay </td><td> true / false </td><td> 禁用自动播放，默认为 <i>false</i> </td></tr>
<tr><td> autoPlayTimeout </td><td> 自定义秒数 </td><td> 激活自动播放时，切换的时间间隔，默认值为5，表示5秒</td></tr>
<tr><td> effect </td><td> scroll / fade </td><td> scroll 即滚动切换， fade 为淡入淡出切换 </td></tr></tbody></table>

<h1>范例</h1>

<b>淘宝首页的轮播卡盘</b>：<br>
<br>
xHTML:<br>
<pre><code>&lt;div id="fp:slide" class="slide-player"&gt;<br>
	&lt;ul&gt;<br>
		&lt;li&gt;&lt;iframe /&gt;&lt;/li&gt;<br>
		&lt;li&gt;&lt;iframe /&gt;&lt;/li&gt;<br>
		&lt;li&gt;&lt;iframe /&gt;&lt;/li&gt;<br>
	&lt;/ul&gt;<br>
&lt;/div&gt;<br>
</code></pre>

CSS:<br>
<pre><code>.slide-player {<br>
	height:190px;<br>
	width:360px;<br>
	position:relative;<br>
	overflow:hidden;<br>
}<br>
</code></pre>

JavaScript:<br>
<pre><code>TB.widget.SimpleSlide.decorate('fp:slide', {triggersClass:'tb-slide-triggers', currentClass:'current', eventType:'mouse', effect:'scroll'});<br>
</code></pre>

其使用的是默认样式，控制条会通过绝对定位显示在右下角。可以很容易的自定义一套控制条的样式，例如可以修改上面的例子：<br>
<br>
<b>自定义轮播卡盘控制条</b>：<br>
<br>
CSS:<br>
<pre><code>.custom-triggers {<br>
	width: 100%;<br>
	background: #eee;<br>
	padding:2px 0 2px 300px;<br>
	position: absolute;<br>
	bottom: 1px;<br>
	opacity: 0.8;<br>
	filter: alpha(opacity=80);<br>
}<br>
<br>
.custom-triggers li {<br>
	display: inline;<br>
	float:left;<br>
	width:15px;<br>
	height:15px;<br>
	line-height:15px;<br>
	margin:0pt 0pt 0pt 2px;<br>
	text-align:center;<br>
	font-family: arial;<br>
	font-size:0.9em;<br>
	cursor: pointer;<br>
	border: 1px solid #dcdcdc;<br>
	color: #9f9f9f;<br>
}<br>
<br>
.custom-triggers li.current {<br>
	background:#c00100;<br>
	border: 1px solid #a00100;<br>
	color: #fff;<br>
	font-size:1.1em;<br>
	font-weight:bold;<br>
}<br>
</code></pre>

JavaScript:<br>
<pre><code>TB.widget.SimpleSlide.decorate('fp:slide', {triggersClass:'custom-triggers', currentClass:'current', eventType:'mouse', effect:'fade'});<br>
</code></pre>

上面的例子自定义了控制条的样式，且使用淡入淡出的切换效果。<br>
<br>
可运行的范例参见：<a href='http://tbra.googlecode.com/svn/trunk/tbra/examples/widget/test-simpleslide2.html'>http://tbra.googlecode.com/svn/trunk/tbra/examples/widget/test-simpleslide2.html</a>

更多自定义控制条的例子参见：<a href='http://tbra.googlecode.com/svn/trunk/tbra/examples/widget/test-simpleslide.html'>http://tbra.googlecode.com/svn/trunk/tbra/examples/widget/test-simpleslide.html</a>


<h1>版本说明</h1>

以前的版本中，缺省的 triggersClass 参数值为 SlideTriggers，缺省的 currentClass 参数值为 Current 。 也就是说，如果不带任何配置参数地去调用 TB.widget.SimpleSlide , 那么它默认会从当前 css 中寻找这些类的定义。<br>
<br>
新版本中，为配合TBSP的css命名规范，TBra缺省提供了一套符合规范的控制条CSS实现，对应的 triggersClass=tb-slide-triggers, currentClass=current。建议不要再使用原来的css定义。