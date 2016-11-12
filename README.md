# boxMan






## 객체생성
```js
var boxMan = new BoxMan();
``


## 설정(Global)
```js
boxMan.set('box',{
	background:,
	width:,
	height:,
	content:,
	layerOnMove:'hi'
    isBoxToBox:true,
    isCopy:true,
    isOverwrite:false,    
    appendType:this.APPEND_TYPE_PUSH
});

boxMan.set('obj',{
	background:,
	width:,
	height:,
	content:
});
```


## 템플릿 이용하여 생성
```js
boxMan.detact();
```



## 생성
```js
boxMan.new('box', {
	parent:,
	background:,
	width:,
	height:,
	content:,
	layerOnMove:document.body,
	isBoxToBox:true,
    isCopy:true,
    isOverwrite:false,
    appendType:this.APPEND_TYPE_PUSH,
	acceptBox:'',
	rejectBox:'',
	acceptObj:'',
	rejectObj:''	
});

boxMan.new('obj', {
	parent:,
	background:,
	width:,
	height:,
	content:
});
```


