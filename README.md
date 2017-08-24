
[![Build Status](https://travis-ci.org/sj-js/boxman.svg?branch=master)](https://travis-ci.org/sj-js/boxman)
[![All Download](https://img.shields.io/github/downloads/sj-js/boxman/total.svg)](https://github.com/sj-js/boxman/releases)
[![Release](https://img.shields.io/github/release/sj-js/boxman.svg)](https://github.com/sj-js/boxman/releases)
[![License](https://img.shields.io/github/license/sj-js/boxman.svg)](https://github.com/sj-js/boxman/releases)


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


/////////////////////////
// 리펙토링 전
/////////////////////////
boxMan.detect()
boxMan.detect(function)

boxMan.newBox(box)
boxMan.getBox(box)
boxMan.delBox(box)
boxMan.clearBox(box)
boxMan.getObjListByBox(box)
boxMan.getObjsByBox(box)
boxMan.addAcceptBox(box, targetBox)
boxMan.addRejectBox(box, targetBox)
boxMan.addAcceptObj(box, targetBox)
boxMan.addRejectObj(box, targetBox)
boxMan.addConditionWithBox(box, conditionForBox, mode)
boxMan.addConditionWithObj(box, conditionForobj, mode)
boxMan.setBoxMode(box, mode)

boxMan.newObj()
boxMan.getObj(obj)
boxMan.delObj(obj)

boxMan.newExBox(exbox)
boxMan.getExBox(exbox)
boxMan.delExBox(exbox)

boxMan.getKeyboarder().setSelectorBox(box)
boxMan.getKeyboarder().delSelectorBox()
boxMan.getKeyboarder().getSelectedObjInBox(box)



/////////////////////////
//리펙토링 후
/////////////////////////
boxMan.detect()
boxMan.detect(function)

boxMan.box().new()
boxMan.box().get()
boxMan.box().del()
boxMan.box().clear()
boxMan.box().getObjList()
boxMan.box().getObjs()
boxMan.box().addAcceptBox(box)
boxMan.box().addRejectBox(box)
boxMan.box().addAcceptObj(obj)
boxMan.box().addRejectObj(obj)
boxMan.box().addConditionWithBox(conditionForBox, mode)
boxMan.box().addConditionWithObj(conditionForobj, mode)
boxMan.box().setMode(mode)

boxMan.obj().new()
boxMan.obj().get()
boxMan.obj().del()

boxMan.exbox().new()
boxMan.exbox().get()
boxMan.exbox().del()

boxMan.keyboarder().setSelectorBox(box)
boxMan.keyboarder().delSelectorBox()
boxMan.keyboarder().getSelectedObjInBox(box)

manid 
=> boxmanboxid
=> boxmanobjid
=> boxmanexboxid
