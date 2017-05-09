function BoxMan(setupObj){
    var that = this;

    this.globalSetup = {
        modeCopy:false,
        modeOnlyBoxToBox:true,
        modeRemoveOutOfBox:false,
        appendType:BoxMan.APPEND_TYPE_SWAP
    }
    this.globalSetupForBox = {};
    this.globalSetupForObj = {};
    this.globalSetupForExBox = {};

    this.objs = {};
    this.boxObjs = {};
    this.exBoxObjs = {};

    this.afterDetectFuncList = [];
    this.addedEventFuncs = {};
    this.metaObj = {
        mvObj:undefined,
        isOnDown:false,
        isOnMoving:false,
        lastPosX:0,
        lastPosY:0,
        mvObjPreviewClone:undefined,
        mvObjPreviewOriginalClone:undefined,
        mvObjStartBodyOffset:undefined,
        mvObjCloneList:[],
        mvObjOriginalShelterList:[],
        cam:{
            w:window.innerWidth,
            h:window.innerHeight
        },
        limit:2,
        layerOnMove:undefined,
        mode:new BoxManMode(this.globalSetup)
    };
    if (setupObj)
        this.set(setupObj);

    getEl().ready(function(){
        getEl().resize(function(){
            that.setMaxSize();
        });
        that.setMaxSize();
        // getEl(document.body).disableSelection();
        /** 이벤트의 중원을 맡으실 분들 **/
        if (that.isMobile()){
            getEl(document).addEventListener('touchstart', function(event){ that.whenMouseDown(event); });
            getEl(document).addEventListener('touchmove', function(event){ that.whenMouseMove(event); });
            getEl(document).addEventListener('touchend', function(event){ that.whenMouseUp(event); });
        }else{
            getEl(document).addEventListener('mousedown', function(event){ that.whenMouseDown(event); });
            getEl(document).addEventListener('mousemove', function(event){ that.whenMouseMove(event); });
            getEl(document).addEventListener('mouseup', function(event){ that.whenMouseUp(event); });
        }
    });
    return this;
}





BoxMan.APPEND_TYPE_LAST = 1;
BoxMan.APPEND_TYPE_FIRST = 2;
BoxMan.APPEND_TYPE_BETWEEN = 3;
BoxMan.APPEND_TYPE_OVERWRITE = 4;
BoxMan.APPEND_TYPE_SWAP = 5;
BoxMan.APPEND_TYPE_INVISIBLE = 6;





BoxMan.prototype.set = function(setupObj){
    for (var objName in setupObj){
        this.globalSetup[objName] = setupObj[objName];
    }
};
BoxMan.prototype.clone = function(param){
    var el = getEl(param).obj
    var copyEl = el.cloneNode(true);
    var originalInfo;
    var copyInfo = {};
    if (el.getAttribute('data-box') != null){
        originalInfo = this.getBoxByManId(el.manid);
    }else if (el.getAttribute('data-obj') != null){
        originalInfo = this.getObjByManId(el.manid);
    }else if (el.getAttribute('data-exbox') != null){
        originalInfo = this.getExBoxByManId(el.manid);
    }
    for (var filedName in originalInfo){
        copyInfo[filedName] = originalInfo[filedName];
    }
    this.setObj(copyEl, copyInfo);
    return copyEl;
};

BoxMan.prototype.detect = function(afterDectectFunc){
    var that = this;
    getEl().ready(function(){
        var tempEls;
        /** 객체탐지 적용(담는 상자) **/
        tempEls = document.querySelectorAll('[data-box]');
        for (var j=0; j<tempEls.length; j++){
            that.addBox(tempEls[j]);
        }
        /** 객체탐지 적용(상자 끌기) **/
        tempEls = document.querySelectorAll('[data-exbox]');
        for (var j=0; j<tempEls.length; j++){
            that.addExBox(tempEls[j]);
        }
        /** 객체탐지 적용(상자 끌기) **/
        tempEls = document.querySelectorAll('[data-obj]');
        for (var j=0; j<tempEls.length; j++){
            that.addObj(tempEls[j]);
        }
        /** Run Function After Detect **/
        afterDectectFunc(that);
        var afterDetectFuncList = that.afterDetectFuncList;
        for (var j=0; j<afterDetectFuncList.length; j++){
            afterDetectFuncList[j]();
        }
    });
    return this;
};
BoxMan.prototype.afterDetect = function(func){
    var that = this;
    that.afterDetectFuncList.push(func);
    return this;
};
BoxMan.prototype.addEventListener = function(eventNm, func){
    if (!this.addedEventFuncs[eventNm]) this.addedEventFuncs[eventNm] = [];
    this.addedEventFuncs[eventNm].push(func);
};
BoxMan.prototype.execEvent = function(eventNm, event){
    var eventList = this.addedEventFuncs[eventNm];
    if (eventList){
        for (var i=0; i<eventList.length; i++){
            eventList[i](event);
        }
    }
};




/*************************
 * Box
 *************************/
BoxMan.prototype.addBox = function(el){
    if (el.getAttribute('data-box') == null && el.getAttribute('data-box') == undefined) el.setAttribute('data-box', '');
    var infoObj = {
        limit:el.getAttribute('data-limit'),
        acceptbox:getData(el.getAttribute('data-accept-box')).parse(),
        rejectbox:getData(el.getAttribute('data-reject-box')).parse(),
        acceptobj:getData(el.getAttribute('data-accept-obj')).parse(),
        rejectobj:getData(el.getAttribute('data-reject-obj')).parse(),
        conditionbox:[],
        conditionobj:[],
        beforeboxin:el.getAttribute('data-event-beforeboxin'),
        boxinout:el.getAttribute('data-event-boxinout'),
        start:el.getAttribute('data-event-start'),
        boxin:el.getAttribute('data-event-boxin'),
        boxout:el.getAttribute('data-event-boxout')
    };
    this.setBox(el, infoObj);
};
BoxMan.prototype.newBox = function(infoObj){
    var newEl = getNewEl('div', '', '', {'data-box':'true'}, '');
    var parentEl;
    if (infoObj.parent){
        if (typeof parent == 'string'){
            parentEl = document.getElementById(infoObj.parent);
        }else{
            parentEl = infoObj.parent;
        }
    }else{
        parentEl = (infoObj.parentEl) ? infoObj.parentEl : document.body;
    }
    this.setBox(newEl, infoObj, parentEl);
    return newEl;    
};
BoxMan.prototype.setBox = function(el, infoObj, parentEl){
    el = getEl(el).obj;
    infoObj = (infoObj)? infoObj:{};
    if (el.isAdaptedBox){
        return false;
    }else{
        el.isAdaptedBox = true;
        getEl(el).clas.add('sj-obj-box');
    }
    // 적용시작
    var that = this;
    var boxObjs = this.boxObjs;
    // ID 적용
    var manid = (infoObj.manid)? infoObj.manid : getEl(boxObjs).getNewSeqId('tmpBox');
    el.manid = manid;
    this.boxObjs[manid] = infoObj;
    this.boxObjs[manid].el = el;
    this.boxObjs[manid].id = el.id;
    this.boxObjs[manid].manid = manid;
    this.boxObjs[manid].mode = new BoxManMode();

    // Element 설정
    var g = this.globalSetupForBox;
    var o = (infoObj)? infoObj:{};
    for (var gNm in g){
        if (!o[gNm]) o[gNm] = g[gNm];
    }
    console.log(o);
    if (o){
        if (o.imgURL) el.style.background = 'url("'+ o.imgURL +'")';
        if (o.width && o.height) el.style.backgroundSize = o.width+' '+o.height;
        if (o.width) el.style.width = o.width;
        if (o.height) el.style.height = o.height;
        if (o.content) el.innerHTML = o.content;
    } 
    // DOM에 추가   
    if (parentEl)
        getEl(parentEl).add(el);
    // Event 추가
    if (o.beforeboxin){
        el.executeEventBeforeboxin = new Function('box', 'obj', 'boxsize', eventFn);
    }    
    if (o.beforeboxinout){
        el.executeEventBoxinout = new Function('box','obj','boxSize', 'boxBefore', eventFn);
    }    
    if (o.start){
        el.executeEventStart = new Function('box','obj','boxSize', eventFn);
        el.executeEventStart(obj, undefined, this.getMovableObjCount(obj));
    }    
    if (o.boxin){
        el.executeEventBoxin = new Function('box','obj','boxSize', 'boxBefore', eventFn);
    }
    if (o.boxout){
        el.executeEventBoxout = new Function('box','obj','boxSize', eventFn);
    }    
    return manid;
};
BoxMan.prototype.delBox = function(param){
    var obj = this.getBox(param);
    var el = obj.el;
    var manid = el.manid;
    delete this.boxObjs[manid];
    el.parentNode.removeChild(el);
    return this;
};
BoxMan.prototype.getBox = function(param){
    if (typeof param == 'string'){
        return this.getBoxById(param);
    }else if (param instanceof Element){
        return this.getBoxByEl(param);
    }else{
        var resultList = this.getBoxesByCondition(param);
        if (resultList != null && resultList.length > 0)
            return resultList[0];
    }
    return;
};
BoxMan.prototype.setBoxMode = function(targetBoxCondition, infoObj){
    //Get Target
    var targetBoxList = this.getBoxesByCondition(targetBoxCondition);
    //Set Condition Data
    for (var i=0; i<targetBoxList.length; i++){
        var targetBox = targetBoxList[i];
        targetBox.mode.set(infoObj);
    }
    return this;
};

BoxMan.prototype.getBoxById = function(id){
    var el = document.getElementById(id);
    return this.boxObjs[el.manid];
};
BoxMan.prototype.getBoxByEl = function(el){
    var boxObjs = this.boxObjs;
    if (el && el.manid){
        var manid = el.manid;
        var boxObj = boxObjs[manid];
        return boxObj;
    }
};
BoxMan.prototype.getBoxByManId = function(manid){
    return this.boxObjs[manid];
};
BoxMan.prototype.getBoxes = function(){
    return this.boxObjs;
};
BoxMan.prototype.getBoxesByCondition = function(condition){
    var resultList = [];
    var boxObjs = this.boxObjs;
    for (var boxName in boxObjs){
        var boxObj = boxObjs[boxName];
        var result = getEl(boxObj).find(condition);
        if (result)
            resultList.push(result);
    }
    return resultList;
};
BoxMan.prototype.getBoxesByDomAttributeCondition = function(condition){
    var resultList = [];
    var boxObjs = this.boxObjs;
    for (var boxName in boxObjs){
        var boxObj = boxObjs[boxName];
        var el = boxObj.el;
        var result = getEl(el).findDomAttribute(condition);
        if (result)
            resultList.push(result);
    }
    return resultList;
};

BoxMan.prototype.clearBox = function(param){
    var el = getEl(param).obj;
    el.innerHTML = "";
    return this;
};
BoxMan.prototype.addAcceptBox = function(targetBoxCondition, condition){
    var el = getEl(targetBoxCondition).obj;
    var manid = el.manid;
    var boxObj = this.boxObjs[manid];
    if (boxObj.acceptbox instanceof Array){
        if (condition instanceof Array)
            boxObj.acceptbox.concat(condition);
        else
            boxObj.acceptbox.push(condition);
    }else{
        boxObj.acceptbox = [boxObj.acceptbox];
    }
    return this;
};
BoxMan.prototype.addRejectBox = function(targetBoxCondition, condition){
    var el = getEl(targetBoxCondition).obj;
    var manid = el.manid;
    var boxObj = this.boxObjs[manid];
    if (boxObj.rejectbox instanceof Array){
        if (condition instanceof Array)
            boxObj.rejectbox.concat(condition);
        else
            boxObj.rejectbox.push(condition);
    }else{
        boxObj.rejectbox = [boxObj.acceptbox];
    }
    return this;
};
BoxMan.prototype.addConditionWithBox = function(targetBoxCondition, condition, data){
    //Get Target
    var targetBoxList = this.getBoxesByCondition(targetBoxCondition);
    //Set Condition Data
    for (var i=0; i<targetBoxList.length; i++){
        var targetBox = targetBoxList[i];
        targetBox.conditionbox.push({
            condition:condition,
            data:data
        });
    }
    return this;
};
BoxMan.prototype.getConditionData = function(target, conditionDataList){
    var result = {};
    if (conditionDataList != null && conditionDataList.length > 0){
        for (var i=0; i<conditionDataList.length; i++){
            var conditionObj = conditionDataList[i];
            var condition = conditionObj.condition;
            var data = conditionObj.data;
            if (getEl(target).isAccepted(condition)){
                for (var filedName in data){
                    result[filedName] = data[filedName];
                }
            }
        }
    }
    return result;
};


BoxMan.prototype.addAcceptObj = function(targetBoxCondition, condition){
    var el = getEl(targetBoxCondition).obj;
    var manid = el.manid;
    var boxObj = this.boxObjs[manid];
    if (boxObj.acceptobj instanceof Array){
        if (condition instanceof Array)
            boxObj.acceptobj.concat(condition);
        else
            boxObj.acceptobj.push(condition);
    }else{
        boxObj.acceptobj = [boxObj.acceptobj];
    }
    return this;
};
BoxMan.prototype.addRejectObj = function(targetBoxCondition, condition){
    var el = getEl(targetBoxCondition).obj;
    var manid = el.manid;
    var boxObj = this.boxObjs[manid];
    if (boxObj.rejectobj instanceof Array){
        if (condition instanceof Array)
            boxObj.rejectobj.concat(condition);
        else
            boxObj.rejectobj.push(condition);
    }else{
        boxObj.rejectobj = [boxObj.rejectobj];
    }
    return this;
};
BoxMan.prototype.addConditionWithObj = function(targetBoxCondition, condition, data){
    this.conditionobj;
    return this;
};



/*************************
 * ExBox
 *************************/
BoxMan.prototype.addExBox = function(el){
    if (el.getAttribute('data-exbox') == null && el.getAttribute('data-exbox') == undefined) el.setAttribute('data-exbox', '');
    var infoObj = {
        id:el.getAttribute('data-exbox-id')
    };
    this.setExBox(el, infoObj);
};
BoxMan.prototype.newExBox = function(infoObj){
    var newEl = getNewEl('div', '', '', {'data-exbox':'true'}, '');
    var parentEl;
    if (infoObj.parent){
        if (typeof parent == 'string'){
            parentEl = document.getElementById(infoObj.parent);
        }else{
            parentEl = infoObj.parent;
        }
    }else{
        parentEl = (infoObj.parentEl) ? infoObj.parentEl : document.body;
    }
    this.setExBox(newEl, infoObj, parentEl);
    return newEl;
};
BoxMan.prototype.setExBox = function(el, infoObj, parentEl){    
    infoObj = (infoObj)? infoObj:{};
    if (el.isAdaptedExBox){
        return false;
    }else{
        el.isAdaptedExBox = true;
        getEl(el).clas.add('sj-obj-exbox');
    }
    // 적용시작
    var that = this;
    var exBoxObjs = this.exBoxObjs;
    // ID 적용
    var manid = (infoObj.manid)? infoObj.manid : getEl(exBoxObjs).getNewSeqId('tmpExBox');
    el.manid = manid;
    this.exBoxObjs[manid] = infoObj;
    this.exBoxObjs[manid].el = el;
    this.exBoxObjs[manid].id = el.id;
    this.exBoxObjs[manid].manid = manid;

    // Element 설정
    var g = this.globalSetupForExBox;
    var o = (infoObj)? infoObj:{};
    for (var gNm in g){
        if (!o[gNm]) o[gNm] = g[gNm];
    }
    if (o){
        if (o.imgURL) el.style.background = 'url("'+ o.imgURL +'")';
        if (o.width && o.height) el.style.backgroundSize = o.width+' '+o.height;
        if (o.width) el.style.width = o.width;
        if (o.height) el.style.height = o.height;
        if (o.content) el.innerHTML = o.content;
    } 
    
    // DOM에 추가   
    if (parentEl) getEl(parentEl).add(el);    
    getEl(el).clas.add('sj-obj-exbox');
    getEl(el).addEventListener('dragenter', that.handleDragOver(that));
    getEl(el).addEventListener('dragover', that.handleDragOver(that));
    getEl(el).addEventListener('dragleave', that.handleDragOut(that));
    getEl(el).addEventListener('drop', that.handleDrop(that));

    var eventFn = el.getAttribute('data-exbox');
    if (eventFn != null && eventFn != undefined) 
        that.addEventListener('drop', new Function('event', eventFn));
    return manid;
};
BoxMan.prototype.getExBox = function(param){    
    if (typeof param == 'string'){        
        return this.getExBoxById(param);
    }else{        
        return this.getExBoxByEl(param);
    }    
};
BoxMan.prototype.getExBoxes = function(){
    return this.exBoxObjs;
};
BoxMan.prototype.getExBoxById = function(id){
    var el = document.getElementById(id);
    return this.exBoxObjs[el.manid];
};
BoxMan.prototype.getExBoxByManId = function(manid){
    return this.exBoxObjs[manid];
};
BoxMan.prototype.getExBoxByEl = function(el){
    var exBoxObjs = this.exBoxObjs;    
    if (el && el.manid){
        var manid = el.manid;
        var exBoxObjs = exBoxObjs[manid];
        return exBoxObjs;        
    }    
};




BoxMan.prototype.handleDragOver = function(eb){
    return function(event){
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        var target = event.target;
        target.style.background = "#ffdddd";
    }
};
BoxMan.prototype.handleDragOut = function(eb){
    return function(event){
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        var target = event.target;
        target.style.background = "";
    }
};
BoxMan.prototype.handleDrop = function(eb){
    return function(event){
        event.stopPropagation();
        event.preventDefault();
        var files = (event.originalEvent) ? event.originalEvent.dataTransfer.files : (event.dataTransfer) ? event.dataTransfer.files : '';
        event.exbox = {files:files};
        eb.execEvent('drop', event);
        event.target.style.background = ""; 
    }
};



/*************************
 * Obj
 *************************/
BoxMan.prototype.addObj = function(el){
    var infoObj = {
        manid:el.getAttribute('data-obj-id')
    };    
    this.setObj(el, infoObj);
};
BoxMan.prototype.newObj = function(infoObj){    
    var newEl = getNewEl('div', '', '', {'data-obj':'true'}, '');
    var parentEl;
    if (infoObj.parent){
        if (typeof parent == 'string'){
            parentEl = document.getElementById(infoObj.parent);
        }else{
            parentEl = infoObj.parent;
        }
    }else{
        parentEl = (infoObj.parentEl) ? infoObj.parentEl : document.body;
    }
    this.setObj(newEl, infoObj, parentEl);
    return newEl;
};
BoxMan.prototype.setObj = function(el, infoObj, parentEl){    
    infoObj = (infoObj)? infoObj:{};    
    if (el.isAdaptedMovable){
        return false;
    }else{
        el.isAdaptedMovable = true;
        getEl(el).clas.add('sj-obj-movable');
    }
    // 적용시작
    var that = this;
    var objs = this.objs;    
    // ID 적용
//    var manid = (infoObj.manid)? infoObj.manid : getEl(objs).getNewSeqId('tmpObj');
    var manid = getEl(objs).getNewSeqId('tmpObj');
    el.manid = manid;
    this.objs[manid] = infoObj;
    this.objs[manid].el = el;
    this.objs[manid].id = el.id;
    this.objs[manid].manid = manid;
        
    // Element 설정
    var g = this.globalSetupForObj;
    var o = (infoObj)? infoObj:{};
    for (var gNm in g){
        if (!o[gNm]) o[gNm] = g[gNm];
    }
    if (o){
        if (o.imgURL) el.style.background = 'url("'+ o.imgURL +'")';
        if (o.width && o.height) el.style.backgroundSize = o.width+' '+o.height;
        if (o.width) el.style.width = o.width;
        if (o.height) el.style.height = o.height;
        if (o.content) el.innerHTML = o.content;        
    }
    el.style.left = el.offsetLeft + 'px';
    el.style.top = el.offsetTop + 'px';       
    // DOM에 추가
    if (parentEl) getEl(parentEl).add(el);
    // Event 추가
    if (this.isMobile()){
        getEl(el).addEventListener('touchstart', function(event){ that.objStartMove(event, el); });
    }else{
        getEl(el).addEventListener('mousedown', function(event){ that.objStartMove(event, el); });
    }
    getEl(el).addEventListener('click', function(){});
    return manid;
};
BoxMan.prototype.delObj = function(param){
    var obj = this.getObj(param);
    var el = obj.el;
    var manid = el.manid;
    delete this.objs[manid];
    el.parentNode.removeChild(el);
    return this;
};
BoxMan.prototype.getObj = function(param){
    if (typeof param == 'string'){        
        return this.getObjById(param);
    }else if (param instanceof Element){
        return this.getObjByEl(param);
    }else{
        var resultList = this.getObjsByCondition(param);
        if (resultList != null && resultList.length > 0)
            return resultList[0];
    }
    return;
};
BoxMan.prototype.getObjs = function(){
    return this.objs;
};
BoxMan.prototype.getObjsByCondition = function(condition){
    var resultList = [];
    var objs = this.objs;
    for (var boxName in objs){
        var obj = objs[boxName];
        var result = getEl(obj).find(condition);
        if (result)
            resultList.push(result);
    }
    return resultList;
};
BoxMan.prototype.getObjById = function(id){
    var el = document.getElementById(id);
    return this.objs[el.manid];
};
BoxMan.prototype.getObjByManId = function(manid){
    return this.objs[manid];
};
BoxMan.prototype.getObjByEl = function(el){
    var objs = this.objs;    
    if (el && el.manid){
        var manid = el.manid;
        var obj = objs[manid];
        return obj;
    }    
};
BoxMan.prototype.getObjsByBox = function(box){
    var resultObj = {};
    var boxObj = this.getBox(box);
    var boxEl = boxObj.el;
    for (var i=0; i<boxEl.children.length; i++){
        var child = boxEl.children[i];
        if (child.getAttribute('data-obj') != null){
            var manid = child.manid;
            var objObj = this.objs[manid];
            resultObj[manid] = objObj;
        }
    }
    return resultObj;
};
BoxMan.prototype.getObjListByBox = function(box){
    var resultList = [];
    var boxObj = this.getBox(box);
    var boxEl = boxObj.el;
    for (var i=0; i<boxEl.children.length; i++){
        var child = boxEl.children[i];
        if (child.getAttribute('data-obj') != null){
            var manid = child.manid;
            var objObj = this.objs[manid];
            resultList.push(objObj);
        }
    }
    return resultList;
};



BoxMan.prototype.moveAllToOtherBox = function(fromBox, toBox){
    var elementFromBox = getEl(fromBox).obj;
    var elementToBox = getEl(toBox).obj;
    var objs = this.getObjsByBox(elementFromBox);
    for (var objName in objs){
        var elementObj = objs[objName].el;
        elementToBox.appendChild(elementObj);
    }
}
BoxMan.prototype.shellterToBox = function(toBox){
    var mvObjOriginalShelterList = this.metaObj.mvObjOriginalShelterList;
    var elementToBox = getEl(toBox).obj;
    for (var i=0; i<mvObjOriginalShelterList.length; i++){
        var el = mvObjOriginalShelterList[i];
        elementToBox.appendChild(el);
    }
}

// ObjMan.prototype.addEventListener = function(eventNm, func){
//     if (!this.addedEventFuncs[eventNm]) this.addedEventFuncs[eventNm] = [];
//     var newFunc;
//     if (eventNm == 'click'){
//         newFunc = function(event){
//             event.stopPropagation();
//             if (sj.getIsOnMoving()) return false;
//             func(event);
//         };
//     }else{
//         newFunc = func;
//     }
//     this.addedEventFuncs[eventNm].push(newFunc);
// };
// ObjMan.prototype.execEvent = function(eventNm, event){
//     var eventList = this.addedEventFuncs[eventNm];
//     if (eventList){
//         for (var i=0; i<eventList.length; i++){
//             eventList[i](event);
//         }
//     }
// };
BoxMan.prototype.hasEvent = function(eventNm){
    var eventList = this.addedEventFuncs[eventNm];
    return (eventList && eventList.length > 0);
};


















/*************************************************************
 *  WHEN you start draging movable object
 *************************************************************/
BoxMan.prototype.whenMouseDown = function(event){
    var meta = this.metaObj;
    meta.isOnMoving = false;
    return true;
};

BoxMan.prototype.objStartMove = function(event, selectedObj){    
    var meta = this.metaObj;
    var mvObj;
    /*sjHelper.cross.stopPropagation(event);*/ //잠시

    //있으면 MIE에서 이미지저장 덜 뜸
    //있으면 MFirefox에서 위아래 이동시 스크롤 되는 것 방지, 객체 이동이 원할, 대신 스크롤로직도 안됨
    //없으면 MChrome에서 스크롤판정로직이 자연스럽게 됨.  ==> 그래서 이미지는 DIV의 backgorund로 설정시키는 data-img 속성 추가로 MIE에서는 없어도 이미지저장이 안뜨게 함
    // 임시방편 : 파이어폭스에서 스크롤로직이 안되더라도  preventDefault를 실행하기
    // 파이어폭스의 특수성 때문에 따로 이벤트 처리 / ★현재 파이어폭스에서만 무빙객체의 이동취소 후 스크롤 시키는 로직이 안됨!!!ㅠ
    if (navigator.userAgent.indexOf('Firefox') != -1) 
        event.preventDefault();
    /* ★ IE8에서 이벤트 넣어줄때 this라고 쓴 부분에서 윈도우 객체를 잡아다 보낸다. 그럼 NONO 할 수 없이 srcElement를 쓰고 부모님에게 묻고 물어서 data-obj가능하신지 여쭈어서 찾는다.*/
    if (selectedObj != window){
        mvObj = selectedObj;
    }else{
        var searchMovableObj = getEl(event.target).getParentEl('data-obj');
        if (searchMovableObj) 
            mvObj = searchMovableObj;
    }
    meta.mvObj = mvObj;    
    /*** 갈 곳 미리보기 클론 ***/
    var previewClone = this.createPreviewer(mvObj);
    meta.mvObjPreviewClone = previewClone;
    meta.mvObjCloneList.push(previewClone);/* ie브라우저를 벗어나서 mouseup이벤트가 발생하지 않는 것 때문에 클론이 지워지지 않는 것 방지 */
    /*** 카피시 원본 위치도 계속 표시하기 위한 클론 ***/
    var previewOriginalClone = this.createPreviewer(mvObj);
    meta.mvObjPreviewOriginalClone = previewOriginalClone;
//    meta.mvObjCloneList.push(previewOriginalClone);
    /*** Swap, Overwrite 용 정리 ***/
    meta.mvObjOriginalShelterList = [];
    /*** 이동 전 정보 저장 ***/
    this.saveInfoBeforeMove(mvObj, event);    
};

BoxMan.prototype.whenMouseMove = function(event){    
    var that = this;
    var meta = this.metaObj;
    var mvObj = meta.mvObj;
    // 현재 마우스/터치 위치를 전역에 저장
    // this.setLastPos(event);
    // 모바일 터치 이벤트 시행 중... 영역에서 벗어나면 드래그 카운터 취소
    if (meta.timerObj && !this.isInBox(meta.timerObj, meta.lastPosX, meta.lastPosY)) 
        this.removeTimer();
    if (meta.isOnDown){
        this.setLastPos(event);
        event.preventDefault();
        /*** 객체 갈 곳 미리보기 ***/
        this.setPreviewer(mvObj, event);
        /** mvObj 이동하여 표시하기 **/
        this.setMovingState(mvObj)
    }
};
BoxMan.prototype.whenMouseUp = function (event){
    var meta = this.metaObj;    
    var mvObj = meta.mvObj;
    /* 객체이동 준비 취소 */
    this.removeTimer();
    /* 이동객체 상태 취소 */
    if (meta.isOnDown){
        getEl(mvObj).clas.remove('sj-obj-is-on-moving');
        meta.isOnDown = false;
    }
    /*** 아래는 이동중이던 객체에게 적용 ***/
    if (meta.isOnMoving){
        // mvObj가 이동할 박스객체 하나 선정
        var decidedBox = this.getDecidedBox(mvObj, this.boxObjs, meta.lastPosX, meta.lastPosY);
        decidedBox = (decidedBox) ? decidedBox : meta.layerOnMove;
        /*** 객체 갈 곳 미리보기 지우기 ***/
        this.deletePreviewer();
        this.deleteOriginalClonePreviewer();
        // 결정된 박스에 mvObj넣기
        // if (decidedBox != undefined){
        this.moveObjTo(mvObj, decidedBox);        
        mvObj.style.zIndex = meta.mvObjBeforeIndex;
        if (meta.additionalStartPosLeft != 0 || meta.additionalStartPosTop != 0){            
            mvObj.style.left = (parseInt(mvObj.style.left) - meta.additionalStartPosLeft) +'px';
            mvObj.style.top = (parseInt(mvObj.style.top) - meta.additionalStartPosTop) +'px';
        }
        // }        
        // confirm mvObj is out of the Box
        // init
        mvObj = null;
    }
    return;
};







BoxMan.prototype.getDecidedBox = function(mvObj, boxObjs, lastPosX, lastPosY){
    var mvObjOnThisBoxObjs = [];
    var decidedBox;
    var decidedBoxLevel = 0;
    var decidedFixedBox;
    var decidedFixedBoxLevel = 0;
    /** 현재 마우스 위치의 박스객체 모으기 **/
    for (var boxNm in boxObjs){
        var el = boxObjs[boxNm].el;
        if(this.isInBox(el, lastPosX, lastPosY) && mvObj != el){
            mvObjOnThisBoxObjs.push(el);            
        }
    }
    /** 들어갈 박스 선정 **/
    for (var i=0; i<mvObjOnThisBoxObjs.length; i++){
        var parentObj = mvObjOnThisBoxObjs[i].parentNode;
        var domLevel = 0;
        var stopFlag = false;
        var flagIsFixed = false;
        /* 자신이  fixed이면 flagIsFixed=true */
        if (mvObjOnThisBoxObjs[i].style.position=='fixed') flagIsFixed = true;

        /* 상자의 domtree단계?? 파악하기 */
        while (parentObj){
            // 박스가 mvObj의 자식이면 건너뛰기
            if (parentObj == mvObj){
                stopFlag=true;
                break;
            }
            // 부모의 영역에 가려진 부분이면 건너뛰기
            if (!this.isInBox(parentObj, lastPosX, lastPosY)
            && parentObj != document.body
            && parentObj != document.body.parentNode
            && parentObj != document.body.parentNode.parentNode){
                stopFlag=true;
                break;
            }
            // 조상 중에  fixed가 있다면 flagIsFixed=true
            if (parentObj.style && parentObj.style.position=='fixed') flagIsFixed = true;
            parentObj = parentObj.parentNode;
            domLevel++;
        }
        /* 박스가 mvObj의 자식이면 건너뛰기 */
        if (stopFlag) continue;
        /* 중첩된 상자들 중에서 domtree단계가 가장 깊은 것으로 결정하기 */
        /* fixed된 객체에 우선권을 주기위해 fixed객체이거나 그의 자손일 때 따로 저장 */
        if (flagIsFixed){
            if (decidedFixedBoxLevel < domLevel){
                decidedFixedBoxLevel = domLevel;
                decidedFixedBox = mvObjOnThisBoxObjs[i];
            }
            /* 일반의 경우 저장 */
        }else{
            if (decidedBoxLevel < domLevel){
                decidedBoxLevel = domLevel;
                decidedBox = mvObjOnThisBoxObjs[i];
            }
        }
    }
    return (decidedFixedBox) ? decidedFixedBox : decidedBox;
};
BoxMan.prototype.getMovableObjCount = function(box){
    var boxSize = 0;
    if (box){
        for (var j=0; j<box.children.length; j++){
            var isMovableObj = box.children[j].getAttribute('data-obj');
            if (isMovableObj != null && isMovableObj != undefined && isMovableObj != 'false'){
                boxSize++;
            }
        }
    }
    return boxSize;
};
BoxMan.prototype.getMovableObj = function(box, event){    
    if (box){        
        for (var j=0; j<box.children.length; j++){
            var obj = box.children[j];
            var isMovableObj = obj.getAttribute('data-obj');
            var isMovablePreviewer = obj.getAttribute('data-obj-previewer');
            if (isMovablePreviewer != null 
            || (isMovableObj != null && isMovableObj != undefined && isMovableObj != 'false')){                
                var offset = getEl(obj).getBoundingClientRect();
                var meta = this.metaObj;
                if (this.isInBox(obj, meta.lastPosX, meta.lastPosY)){                    
                    return obj;
                }
            }
        }
    }    
    return;
};





BoxMan.prototype.saveInfoBeforeMove = function(mvObj, event){
    var meta = this.metaObj;
    meta.mvObjBeforeBox = mvObj.parentNode;
    meta.mvObjBeforeIndex = mvObj.style.zIndex;
    meta.mvObjBeforePosition = mvObj.style.position;    
    meta.mvObjBeforeNextSibling = mvObj.nextSibling;
    meta.mvObjStartBodyOffset = getEl(mvObj).getBoundingClientRect(); // body관점에서 대상객체의 offset    
    mvObj.style.zIndex = getData().findHighestZIndex(['div']) + 1; // 이동객체에 가장 높은 zIndex 설정
    meta.lastGoingToBeInThisBox = meta.mvObjBeforeBox;

    meta.mode.clear()
             .merge(this.globalSetup)
             .merge(this.getBox(meta.mvObjBeforeBox).mode);

    if (mvObj.parentNode != document.body){                
        var o = this.findAbsoluteParentEl(mvObj);
        var offset = getEl(o).getBoundingClientRect();
        meta.additionalStartPosLeft = offset.left;
        meta.additionalStartPosTop = offset.top;
        console.debug(offset.left, offset.top);
    }else{
        meta.additionalStartPosLeft = 0;
        meta.additionalStartPosTop = 0;
    } 

    this.setLastPos(event); // 현재 마우스/터치 위치를 전역에 저장
        
    /* Mobile Control */
    if (event.touches != undefined){
        meta.timerObj = event.touches[0].target;
        this.removeTimer();
        meta.timer = setInterval(setTimer, 100);        
        /* mvObj.adjust = mouseDown을 시작한 곳과 대상객체의 offset과의 거리 */
        mvObj.adjustX = event.touches[0].pageX - meta.mvObjStartBodyOffset.left;
        mvObj.adjustY = event.touches[0].pageY - meta.mvObjStartBodyOffset.top;        
    /* Web Control */
    }else{        
        /* mvObj.adjust = mouseDown을 시작한 곳과 대상객체의 offset과의 거리 */
        mvObj.adjustX = event.clientX - meta.mvObjStartBodyOffset.left + getEl().getBodyScrollX();
        mvObj.adjustY = event.clientY - meta.mvObjStartBodyOffset.top + getEl().getBodyScrollY();        
        /* mvObj의 이동을 허가하는  표시와 설정 */
        getEl(mvObj).clas.add('sj-obj-is-on-moving');
        meta.isOnDown = true;
        meta.isOnMoving = false;        
    }       
    // mvObj.adjustX -= meta.additionalStartPosLeft;
    // mvObj.adjustY -= meta.additionalStartPosTop;
};
BoxMan.prototype.setMovingState = function(mvObj){
    var meta = this.metaObj;   
    var lastPosX = meta.lastPosX;
    var lastPosY = meta.lastPosY;
    var cam = meta.cam;
    var dan = 'px';
    /* X축 이동하기*/
    if (lastPosX - mvObj.adjustX >= 1
    && lastPosX - mvObj.adjustX + mvObj.offsetWidth <= cam.w) {
        mvObj.style.left = (lastPosX - mvObj.adjustX) + dan;
    }else{
        /* X축 이동 제한*/
        if(lastPosX - mvObj.adjustX < 1) mvObj.style.left = 0 + dan;
        if(lastPosX - mvObj.adjustX + mvObj.offsetWidth > cam.w)
            mvObj.style.left = (cam.w - mvObj.offsetWidth) + dan;
    }
    /* Y축 이동하기 */
    if (lastPosY - mvObj.adjustY >= 1
    && lastPosY - mvObj.adjustY + mvObj.offsetHeight <= cam.h){
        mvObj.style.top = (lastPosY - mvObj.adjustY) + dan;
    }else{
        /* Y축 이동 제한 */
        if(lastPosY - mvObj.adjustY < 1) mvObj.style.top = 0 + dan;
        if(lastPosY - mvObj.adjustY + mvObj.offsetHeight > cam.h){
            mvObj.style.top = (cam.h - mvObj.offsetHeight) + dan;
        }
    }

    /** mvObj 이동중인 상태를 적용 **/
    mvObj.style.position = 'absolute';
    mvObj.style.float = '';
    getEl(mvObj).clas.add('sj-obj-is-on-moving');
    // getEl(meta.mvObjBeforeBox).add(mvObj);
    getEl(document.body).add(mvObj);
    
    /* 이동시 크기변이 또는 해당Layout의 scroll계산의 까다로움으로 인하여 mvObj의 영역에 마우스가 위치하지 않는 경우 마우스를 0점 위치로 */
    if (!meta.isOnMoving) {        
        if (mvObj.adjustX > mvObj.offsetWidth || mvObj.adjustX < 0) mvObj.adjustX = mvObj.offsetWidth;
        if (mvObj.adjustY > mvObj.offsetHeight || mvObj.adjustY < 0) mvObj.adjustY = mvObj.offsetHeight;
    }

    /* 이동중 확정 */
    meta.isOnMoving = true;
};
BoxMan.prototype.moveObjTo = function(mvObj, boxEl){
    var meta = this.metaObj;
    var mode = meta.mode;
    var mvObjBeforeBox = meta.mvObjBeforeBox;
//    var mvObjBeforeNextSibling = meta.mvObjBeforeNextSibling;
//    var mvObjBeforePosition = meta.mvObjBeforePosition;
//    var mvObjStartBodyOffset = meta.mvObjStartBodyOffset;
    var mvObjPreviewClone = meta.mvObjPreviewClone;
    var previewOriginalClone = meta.mvObjPreviewOriginalClone;
    var bfBoxInfo = this.getBox(mvObjBeforeBox);
    var afBoxInfo = this.getBox(boxEl);
    var objInfo = this.getObj(mvObj);

    var isFromBox = (bfBoxInfo != undefined);
    var isToBox = (afBoxInfo != undefined);
    var isSameBox = ( bfBoxInfo == afBoxInfo );
    var canEnter = false;
    // Set Mode (Global Set < BeforeBox Set < AfterBoxCondition Set < AfterObjCondition Set)
    if (isToBox){
        var boxConditionData = this.getConditionData(bfBoxInfo, afBoxInfo.conditionbox);
        var objConditionData = this.getConditionData(objInfo, afBoxInfo.conditionobj);
        mode.merge(boxConditionData);
        mode.merge(objConditionData);
        canEnter = ( afBoxInfo.limit > this.getMovableObjCount(boxEl) || afBoxInfo.limit == undefined );
    }
    var appendType = mode.get('appendType');
    var modeRemoveOutOfBox = mode.get('modeRemoveOutOfBox');
    var modeOnlyBoxToBox = mode.get('modeOnlyBoxToBox');
    var modeCopy = mode.get('modeCopy');

    var isTypeBetween = ( appendType == BoxMan.APPEND_TYPE_BETWEEN );
    var isRollback = ( !isTypeBetween && (isSameBox || !canEnter) );
    var isRollback2 = ( isTypeBetween && !canEnter && !isSameBox );
    var isRollbackWithEvent = (isToBox && boxEl.executeEventBeforeboxin && !boxEl.executeEventBeforeboxin(boxEl, mvObj, this.getMovableObjCount(mvObjBeforeBox)));
    var isRemoveOutOfBox = ( modeRemoveOutOfBox && !isToBox && !isSameBox);
    var isNotOnlyToBox = ( modeOnlyBoxToBox && !isToBox && isFromBox);
    var isAcceptedBox = ( !isToBox || getEl(bfBoxInfo).isAccepted(afBoxInfo.acceptbox, afBoxInfo.rejectbox) );
    var isAcceptedObj = ( !isToBox || getEl(objInfo).isAccepted(afBoxInfo.acceptobj, afBoxInfo.rejectobj) );

    var flagBeforeBoxEvent = false;
    var flagAfterBoxEvent = false;
    var isMoved = false;

    // 다시 같은 상자면 원위치, 이동을 허가하지 않은 상자면 원위치
    if ( isRollback || isRollbackWithEvent || isNotOnlyToBox || !isAcceptedBox || !isAcceptedObj){
        if (isRemoveOutOfBox && !isToBox){
            this.delObj(mvObj);
            return;
        }
        this.backToBefore(mvObj, mvObjBeforeBox, appendType);

    // 이동전 수행 펑션 true면 통과
    }else{ 
        // 다른 박스로 이동
        if (boxEl){
            //Back Up Moment
            if (isRollback2){
                this.backToBefore(mvObj, mvObjBeforeBox, appendType);
                return;
            }
            //Copy Moment
            var mvTarget;
            if (modeCopy && appendType != BoxMan.APPEND_TYPE_SWAP && !isSameBox){
                var copyEl = this.clone(mvObj);
                mvTarget = copyEl;
                this.backToBefore(mvObj, mvObjBeforeBox, appendType);
            }else{
                mvTarget = mvObj;
            }
            //Before Move Moment
            if (appendType == BoxMan.APPEND_TYPE_OVERWRITE && !isSameBox){
                this.clearBox(boxEl);
            }else if (appendType == BoxMan.APPEND_TYPE_SWAP && !isSameBox && canEnter){
//                this.moveAllToOtherBox(boxEl, mvObjBeforeBox);
                this.shellterToBox(mvObjBeforeBox);
            }else{
            }
            //Move Moment
            this.goTo(mvTarget, boxEl, appendType, mvObjPreviewClone);
            flagBeforeBoxEvent = true;
            flagAfterBoxEvent = true;
            isMoved = true;
        // 허공에서 허공으로 이동
        }else{
            meta.mvObjBeforeBox.appendChild(mvObj);
            
        }
    }

    // 결정된 박스에 mvObj넣기 (밖 허가 안되면 위치 원상 복구, 허가면 이전 박스의 박스아웃 이벤트 발생)
    // 이벤트 실행(박스객체, 이동객체, 박스안 이동객체 수)
    if ( flagBeforeBoxEvent || (!isNotOnlyToBox && isToBox) ){        
        var bBoxCnt = this.getMovableObjCount(mvObjBeforeBox);
        if (mvObjBeforeBox.executeEventMustDo) mvObjBeforeBox.executeEventMustDo();
        if (mvObjBeforeBox.executeEventBoxinout) mvObjBeforeBox.executeEventBoxinout(mvObjBeforeBox, mvObj, bBoxCnt);
        if (mvObjBeforeBox.executeEventBoxout) mvObjBeforeBox.executeEventBoxout(mvObjBeforeBox, mvObj, bBoxCnt);    
    }    
    if ( flagAfterBoxEvent ){        
        var boxCnt = this.getMovableObjCount(boxEl);
        if (boxEl.executeEventMustDo) boxEl.executeEventMustDo();
        if (boxEl.executeEventBoxinout) boxEl.executeEventBoxinout(boxEl, mvObj, boxCnt, mvObjBeforeBox);
        if (boxEl.executeEventBoxin) boxEl.executeEventBoxin(boxEl, mvObj, boxCnt, mvObjBeforeBox);
    }    
    /* 초기화 */
    mvObj = null;
    return isMoved;
};
BoxMan.prototype.goTo = function(mvObj, boxEl, appendType, mvObjPreviewClone){
    //APPEND_TYPE_LAST
    if (appendType == BoxMan.APPEND_TYPE_LAST){
        boxEl.appendChild(mvObj);
    //APPEND_TYPE_FIRST
    }else if (appendType == BoxMan.APPEND_TYPE_FIRST){
        boxEl.insertBefore(mvObj, boxEl.firstChild);
    //APPEND_TYPE_BETWEEN
    }else if (appendType == BoxMan.APPEND_TYPE_BETWEEN){
        var mousePosObj = this.getMovableObj(boxEl, event);                    
        if (mousePosObj){                        
            if (mousePosObj == mvObjPreviewClone.nextSibling){
                boxEl.insertBefore(mvObj, mousePosObj.nextSibling);
            } else if (mousePosObj != mvObjPreviewClone){
                boxEl.insertBefore(mvObj, mousePosObj);                        
            }
        }else{
            boxEl.appendChild(mvObj);
        }
    //APPEND_TYPE_OVERWRITE
    }else if (appendType == BoxMan.APPEND_TYPE_OVERWRITE){
        boxEl.appendChild(mvObj);
    //APPEND_TYPE_SWAP
    }else if (appendType == BoxMan.APPEND_TYPE_SWAP){
        boxEl.appendChild(mvObj);
    //APPEND_TYPE_INVISIBLE
    }else if (appendType == BoxMan.APPEND_TYPE_INVISIBLE){
    }
    mvObj.style.position = '';
};
BoxMan.prototype.backToBefore = function(mvObj, boxEl, appendType, modeCopy){
    if (modeCopy && appendType != BoxMan.APPEND_TYPE_SWAP)
        return;
    var meta = this.metaObj;
    var mvObjBeforeNextSibling = meta.mvObjBeforeNextSibling;    
    var mvObjBeforePosition = meta.mvObjBeforePosition;
    var mvObjStartBodyOffset = meta.mvObjStartBodyOffset;    
    boxEl.insertBefore(mvObj, mvObjBeforeNextSibling);    
    mvObj.style.position = (mvObjBeforePosition=='absolute') ? 'absolute':'';
    if (mvObjBeforePosition == 'absolute'){
        mvObj.style.left = mvObjStartBodyOffset.x +'px';
        mvObj.style.top = mvObjStartBodyOffset.y +'px';
        mvObj.style.float = ''; //??왜 플롯을??
    }      
};
BoxMan.prototype.originalCopyBackToBefore = function(mvObj, boxEl, appendType, modeCopy){
    if (modeCopy && appendType != BoxMan.APPEND_TYPE_SWAP){
        if (mvObj.parentNode != boxEl){
            if (!modeCopy || appendType == BoxMan.APPEND_TYPE_SWAP)
                return;
            var meta = this.metaObj;
            var mvObjBeforeNextSibling = meta.mvObjBeforeNextSibling;
            var mvObjBeforePosition = meta.mvObjBeforePosition;
            var mvObjStartBodyOffset = meta.mvObjStartBodyOffset;
            boxEl.insertBefore(mvObj, mvObjBeforeNextSibling);
            mvObj.style.position = (mvObjBeforePosition=='absolute') ? 'absolute':'';
            if (mvObjBeforePosition == 'absolute'){
                mvObj.style.left = mvObjStartBodyOffset.x +'px';
                mvObj.style.top = mvObjStartBodyOffset.y +'px';
                mvObj.style.float = ''; //??왜 플롯을??
            }
        }
    }else{
        if (mvObj.parentNode)
            mvObj.parentNode.removeChild(mvObj);
    }
};





BoxMan.prototype.createPreviewer = function(mvObj){ 
    var meta = this.metaObj;
    var mvObjPreviewClone = mvObj.cloneNode(true);
    mvObjPreviewClone.setAttribute('data-obj', 'false'); //undefined, null, true, false를 지정하면 조건식에서 정상적으로 작동을 안함. 스트링으로
    mvObjPreviewClone.setAttribute('data-obj-previewer', 'true'); 
    getEl(mvObjPreviewClone).clas.add('sj-preview-going-to-be-in-box');
    mvObjPreviewClone.style.position = "";
    return mvObjPreviewClone;
};
BoxMan.prototype.setPreviewer = function(mvObj, event){    
    var meta = this.metaObj;
    var mode = meta.mode.clone();
    var lastGoingToBeInThisBox = meta.lastGoingToBeInThisBox;
    var mvObjPreviewClone = meta.mvObjPreviewClone;
    var previewOriginalClone = meta.mvObjPreviewOriginalClone;
    var mvObjBeforeBox = meta.mvObjBeforeBox;    
    /** 가는 위치 미리 보여주기 **/
    var goingToBeInThisBox = this.getDecidedBox(mvObj, this.boxObjs, meta.lastPosX, meta.lastPosY);    
    var boxEl = goingToBeInThisBox;
    var bfBoxInfo = this.getBox(mvObjBeforeBox);
    var afBoxInfo = this.getBox(boxEl);
    var objInfo = this.getObj(mvObj);

    var isFromBox = (bfBoxInfo != undefined);
    var isToBox = (afBoxInfo != undefined);
    var isSameBox = ( bfBoxInfo == afBoxInfo );
    var canEnter = false;
    // Set Mode (Global Set < BeforeBox Set < AfterBoxCondition Set < AfterObjCondition Set)
    if (isToBox){
        var boxConditionData = this.getConditionData(bfBoxInfo, afBoxInfo.conditionbox);
        var objConditionData = this.getConditionData(objInfo, afBoxInfo.conditionobj);
        mode.merge(boxConditionData);
        mode.merge(objConditionData);
        canEnter = ( afBoxInfo.limit > this.getMovableObjCount(boxEl) || afBoxInfo.limit == undefined );
    }
    var appendType = mode.get('appendType');
    var modeRemoveOutOfBox = mode.get('modeRemoveOutOfBox');
    var modeOnlyBoxToBox = mode.get('modeOnlyBoxToBox');
    var modeCopy = mode.get('modeCopy');

    var isTypeBetween = ( appendType == BoxMan.APPEND_TYPE_BETWEEN );
    var isRollback = ( !isTypeBetween && (isSameBox || !canEnter) );
    var isRollback2 = ( isTypeBetween && !canEnter && !isSameBox );
    var isRollbackWithEvent = (isToBox && boxEl.executeEventBeforeboxin && !boxEl.executeEventBeforeboxin(boxEl, mvObj, this.getMovableObjCount(mvObjBeforeBox)));
    var isRemoveOutOfBox = ( modeRemoveOutOfBox && !isToBox && !isSameBox);
    var isNotOnlyToBox = ( modeOnlyBoxToBox && !isToBox && isFromBox);
    var isAcceptedBox = ( !isToBox || getEl(bfBoxInfo).isAccepted(afBoxInfo.acceptbox, afBoxInfo.rejectbox) );
    var isAcceptedObj = ( !isToBox || getEl(objInfo).isAccepted(afBoxInfo.acceptobj, afBoxInfo.rejectobj) );

    // 갈 곳 미리보기 효과 (클론 효과)
    // 원위치로 지정
    if (isRollback || isNotOnlyToBox || !isAcceptedBox || !isAcceptedObj){
        this.originalCopyBackToBefore(previewOriginalClone, mvObjBeforeBox, appendType, modeCopy);
        if (modeRemoveOutOfBox && !isSameBox && !isToBox){
            if (mvObjPreviewClone.parentNode)
                mvObjPreviewClone.parentNode.removeChild(mvObjPreviewClone);
            this.overWriteAndSwapPreview(goingToBeInThisBox, appendType);
            meta.lastGoingToBeInThisBox = goingToBeInThisBox;
            return;
        }
        if (!isAcceptedBox || !isAcceptedObj){
            meta.lastGoingToBeInThisBox = goingToBeInThisBox;
            this.backToBefore(mvObjPreviewClone, mvObjBeforeBox, appendType, modeCopy);
            return;
        }
        this.overWriteAndSwapPreview(goingToBeInThisBox, appendType);
        meta.lastGoingToBeInThisBox = goingToBeInThisBox;
        this.backToBefore(mvObjPreviewClone, mvObjBeforeBox, appendType, modeCopy);

    // 갈 예정인 박스안 지정
    }else{
        if (boxEl){
            //Back Up Moment
            if (isRollback2){
                this.backToBefore(mvObjPreviewClone, mvObjBeforeBox, appendType, modeCopy);
                meta.lastGoingToBeInThisBox = goingToBeInThisBox;
                return;
            }
            var mvTarget;
            //Copy Moment
            this.originalCopyBackToBefore(previewOriginalClone, mvObjBeforeBox, appendType, modeCopy);
            //Before Move Moment
            if (appendType == BoxMan.APPEND_TYPE_OVERWRITE && !isSameBox){
                if (modeCopy && mvObjPreviewClone.parentNode)
                    mvObjPreviewClone.parentNode.removeChild(mvObjPreviewClone);
                this.overWriteAndSwapPreview(goingToBeInThisBox, appendType);
            }else if (appendType == BoxMan.APPEND_TYPE_SWAP && !isSameBox && canEnter){
                this.overWriteAndSwapPreview(goingToBeInThisBox, appendType);
            }else{
            }
            //Move Moment
            this.goTo(mvObjPreviewClone, goingToBeInThisBox, appendType, mvObjPreviewClone);
        }else{
            // 박스 밖으로 갈 예정
            if (lastGoingToBeInThisBox)
                getEl(lastGoingToBeInThisBox).clas.remove('sj-tree-box-to-go');
            if (mvObjPreviewClone.parentNode)
                mvObjPreviewClone.parentNode.removeChild(mvObjPreviewClone);
            this.overWriteAndSwapPreview(goingToBeInThisBox, appendType);
        }
    }
    meta.lastGoingToBeInThisBox = goingToBeInThisBox;
    
};
BoxMan.prototype.deletePreviewer = function(){
    // var getEl = this.getEl;
    var meta = this.metaObj;    
    var mvObjPreviewClone = meta.mvObjPreviewClone;
    var mvObjCloneList = meta.mvObjCloneList;
    /** 미리보기를 위한 mvObj클론 없애기 **/
    if (mvObjPreviewClone && mvObjPreviewClone.parentNode) {
        mvObjPreviewClone.parentNode.removeChild(mvObjPreviewClone);
        mvObjPreviewClone = undefined;
    }
    /** IE브라우저 밖에서 mouseup해도 이벤트 발생이 되지 않아서 클론이 안 지워지는 것 방지 **/
    for (var pp=0; pp<mvObjCloneList.length; pp++){
        if (mvObjCloneList[pp].parentNode){
            mvObjCloneList[pp].parentNode.removeChild(mvObjCloneList[pp]);
        }
    }
    /** 다시 정의하면 기존 메모리에 할당된건 지워주게지? **/
    if (mvObjCloneList.length > 10)
        meta.mvObjCloneList = [];
};
BoxMan.prototype.deleteOriginalClonePreviewer = function(){
    var meta = this.metaObj;
    var mvObjPreviewOriginalClone = meta.mvObjPreviewOriginalClone;
    if (mvObjPreviewOriginalClone.parentNode)
        mvObjPreviewOriginalClone.parentNode.removeChild(mvObjPreviewOriginalClone);
};



BoxMan.prototype.overWriteAndSwapPreview = function(goingToBeInThisBox, appendType){
    var meta = this.metaObj;
    if (meta.lastGoingToBeInThisBox != goingToBeInThisBox){
        //백업되었던 것 원위치
        for (var i=0; i<meta.mvObjOriginalShelterList.length; i++){
            var el1 = meta.mvObjOriginalShelterList[i];
            meta.mvObjOriginalBox.appendChild(el1);
        }
        //미리보기 지우기
        this.deletePreviewer();
        //상자이면
        if (goingToBeInThisBox){
            meta.mvObjOriginalBox = goingToBeInThisBox;
            meta.mvObjOriginalShelterList = [];
            var objs = this.getObjsByBox(goingToBeInThisBox);
            if (objs){
                //원본 백업
                for (var objName in objs){
                    var obj = objs[objName];
                    if (obj){
                        var el = obj.el;
                        meta.mvObjOriginalShelterList.push(el);
                    }
                }
                //원본 지우기
                this.clearBox(goingToBeInThisBox);
                //백업본 미리보기
                if (appendType == BoxMan.APPEND_TYPE_SWAP){
                    for (var i=0; i<meta.mvObjOriginalShelterList.length; i++){
                        var el1 = meta.mvObjOriginalShelterList[i];
                        var previewOriginalClone = this.createPreviewer(el1);
                        meta.mvObjCloneList.push(previewOriginalClone);
                        meta.mvObjBeforeBox.appendChild(previewOriginalClone);
                    }
                }
            }
        }
    }
};



/*****
 * 기타 공통 모듈
 *****/
/* 모바일여부 확인 */
BoxMan.prototype.isMobile = function(){
    var mFilter = "win16|win32|win64|mac";
    var mCheck = false;
    if(navigator.platform) mCheck = ( mFilter.indexOf(navigator.platform.toLowerCase())<0 ) ? true : false;
    return mCheck; 
};
BoxMan.prototype.setMaxSize = function(event){ 
    // var getEl = this.getEl;
    var meta = this.metaObj;
    var testDiv = document.createElement('div');
    testDiv.style.display = 'block';
    testDiv.style.position = 'absolute'; 
    testDiv.style.top = '-7777px'; 
    testDiv.style.left = '-7777px'; 
    testDiv.style.width = '100%'; 
    testDiv.style.height = '100%';    
    testDiv.style.border = '0px solid'; 
    testDiv.style.padding = '0px'; 
    testDiv.style.margin = '0px';  
    getEl(document.body).add(testDiv);
    var w = testDiv.offsetWidth;
    var h = testDiv.offsetHeight;
    console.debug('MAX:'+ meta.cam.w +'/'+ meta.cam.h);
    console.debug('=> '+ w +'/'+ h);
    // if (!meta.cam.w){
        meta.cam.w = w;
        meta.cam.h = h;
    // }
};
BoxMan.prototype.setLastPos = function(event){ 
    var meta = this.metaObj;
    /* Mobile Control */        
    if (event.touches != undefined){
        meta.lastPosX = event.touches[0].pageX;
        meta.lastPosY = event.touches[0].pageY;              
    /* Web Control */
    }else{    
        meta.lastPosX = event.clientX + getEl().getBodyScrollX();
        meta.lastPosY = event.clientY + getEl().getBodyScrollY();
    }    
    // console.log(meta.lastPosX, meta.additionalStartPosLeft, meta.mvObj.adjustX);
    // meta.lastPosX -= meta.additionalStartPosLeft;
    // meta.lastPosY -= meta.additionalStartPosTop;
};  
/* X,Y가 영역 안에 존재하는지 확인
 * 의존 : getBoundingClientRect()  */
BoxMan.prototype.isInBox = function (target, objX, objY){       
    var targetBodyOffset = getEl(target).getBoundingClientRect();
    var targetBodyOffsetX = targetBodyOffset.left;
    var targetBodyOffsetY = targetBodyOffset.top;            
    /* 상자 안인지 판정 */
    if(targetBodyOffsetX + target.scrollLeft< objX
    && targetBodyOffsetX + target.offsetWidth + target.scrollLeft> objX
    && targetBodyOffsetY + target.scrollTop< objY
    && targetBodyOffsetY + target.offsetHeight + target.scrollTop > objY){
        return true;        
    }
    return false;       
};



BoxMan.prototype.setTimer = function(event){    
    // var getEl = this.getEl;
    var that = this;
    var meta = this.metaObj;    
    return function(event){
        /* 100밀리세컨드 단위로 흐르는 시간 */
        meta.timerTime += 100;
        if (meta.timerTime >= meta.timeForReadyToDrag){
            event.preventDefault(event);       //MCHROME에서 이게 있어야함. MIE에선 이게 있으면 안됨... 아 모르겠다.
            getEl(meta.mvObj).clas.add('sj-obj-is-on-moving');     
            meta.isOnDown = true;
            meta.isOnMoving = false;
            clearTimeout(timer); 
            meta.timerTime = 0;        
        }
    }    
};
BoxMan.prototype.removeTimer = function(){
    var meta = this.metaObj;
    /* 객체 길게 누름 관련 */
    clearTimeout(meta.timer);
    meta.timerTime = 0;      
};





BoxMan.prototype.findAbsoluteParentEl = function(el){
    var searchSuperObj = el.parentNode;
    while(searchSuperObj){
        if (searchSuperObj.style && searchSuperObj.style.position && searchSuperObj.style.position == 'absolute') break;
        searchSuperObj = searchSuperObj.parentNode;
    }
    return searchSuperObj ? searchSuperObj : document.body;
};




/**
 * 테스트중
 * @param setupObj
 * @constructor
 */
function BoxManBox(setupObj){
    this.limit;
    this.acceptbox = [];
    this.rejectbox = [];
    this.acceptobj = [];
    this.rejectobj = [];
    this.conditionbox = [];
    this.conditionobj = [];
    this.beforeboxin;
    this.boxinout;
    this.start;
    this.boxin;
    this.boxout;
    this.mode = new BoxManMode();
}

function BoxManObj(setupObj){
}
function BoxManExBox(setupObj){
}


/**
* BoxManMode
* @param setupObj
* @constructor
*/
function BoxManMode(modes){
    this.modes = {};
    this.set(modes);
}

BoxManMode.prototype = {
    set: function(param){
        if (param instanceof Object){
            for (var modeName in param){
                this.modes[modeName] = param[modeName];
            }
        }else if (typeof param == 'string'){
            this.modes[param] = true;
        }
        return this;
    },
    get: function(modeName){
        return this.modes[modeName];
    },
    del: function(modeName){
        delete this.modes[modeName];
        return this;
    },
    toggle: function(modeName){
        var mode = this.modes[modeName];
        if (this.modes[modeName] != undefined && this.modes[modeName] != null){
            if (typeof mode == 'boolean')
                this.modes[modeName] = !mode;
        }
        return this;
    },
    clear:function(){
        this.modes = {};
        return this;
    },
    clone: function(){
        return new BoxManMode(this.modes);
    },
    merge: function(mode){
        if (mode instanceof BoxManMode){
            var targetModes = mode.modes;
            for (var modeName in targetModes){
                this.modes[modeName] = targetModes[modeName];
            }
        }else{
            this.set(mode);
        }
        return this;
    }
};