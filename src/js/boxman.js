function BoxMan(el){
    var that = this;
    this.addedEventFuncs = {};
    this.globalObjSetup = {};
    this.globalBoxSetup = {};
    this.globalExBoxSetup = {};    
    this.objs = {};
    this.boxObjs = {};
    this.exBoxObjs = {};
    this.metaObj = {
        mvObj:undefined,        
        isOnDown:false,
        isOnMoving:false,
        lastPosX:0,
        lastPosY:0,
        mvObjPreviewClone:undefined,
        mvObjStartBodyOffset:undefined,
        mvObjCloneList:[],
        cam:{
            w:window.innerWidth,
            h:window.innerHeight
        },
        limit:2,
        layerOnMove:undefined,
        isCopy:false,
        isOverwrite:false,
        isBoxToBox:true,
        appendType:this.APPEND_TYPE_PUSH
    };
    window.addEventListener('load', function(event){
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
            window.addEventListener('resize', function(event){ that.whenResize(event); });
        }
        // }
    });
    window.addEventListener('resize', function(event){
        that.setMaxSize();
    });

}





BoxMan.prototype.APPEND_TYPE_LAST = 1;
BoxMan.prototype.APPEND_TYPE_FIRST = 2;
BoxMan.prototype.APPEND_TYPE_PUSH = 3;





BoxMan.prototype.set = function(type, infoObj){
    if (type == 'box'){
        this.globalBoxSetup = infoObj;    
    }else if (type == 'exbox '){
        this.globalExBoxSetup = infoObj;
    }else if (type == 'obj'){
        this.globalObjSetup = infoObj;        
    }
};
BoxMan.prototype.new = function(type, infoObj){
    if (type == 'box'){
        this.newBox(infoObj);
    }else if (type == 'exbox'){
        this.newExBox(infoObj);
    }else if (type == 'obj'){
        this.newObj(infoObj);
    }
};
BoxMan.prototype.detect = function(){        
    var tempEls;
    /** 객체탐지 적용(담는 상자) **/
    tempEls = document.querySelectorAll('[data-box]');
    for (var j=0; j<tempEls.length; j++){
        this.addBox(tempEls[j]);
    }    
    /** 객체탐지 적용(상자 끌기) **/
    tempEls = document.querySelectorAll('[data-exbox]');
    for (var j=0; j<tempEls.length; j++){
        this.addExBox(tempEls[j]);
    }
    /** 객체탐지 적용(상자 끌기) **/
    tempEls = document.querySelectorAll('[data-obj]');
    for (var j=0; j<tempEls.length; j++){
        this.addObj(tempEls[j]);
    }
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
        id:el.getAttribute('data-box-id'),
        limit:el.getAttribute('data-limit'),
        acceptbox:getData(el.getAttribute('data-accept-box')).parse(),
        rejectbox:getData(el.getAttribute('data-reject-box')).parse(),
        acceptobj:getData(el.getAttribute('data-accept-obj')).parse(),
        rejectobj:getData(el.getAttribute('data-reject-obj')).parse(),
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
    parentEl = (infoObj.parentEl) ? infoObj.parentEl : document.body;
    this.setBox(newEl, infoObj, parentEl);
    return newEl;    
};
BoxMan.prototype.setBox = function(el, infoObj, parentEl){    
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
    var id = (infoObj.id)? infoObj.id : getEl(boxObjs).getNewSeqId('tmp');
    el.boxid = id;
    this.boxObjs[id] = infoObj;
    this.boxObjs[id].el = el;
    this.boxObjs[id].id = id;

    // Element 설정
    var g = this.globalBoxSetup;
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
    return id;
};
BoxMan.prototype.getBox = function(param){    
    if (typeof param == 'string'){        
        return this.getBoxById(param);
    }else{        
        return this.getBoxByEl(param);
    }    
};
BoxMan.prototype.getBoxById = function(id){
    return this.boxObjs[id];
};
BoxMan.prototype.getBoxByEl = function(el){
    var boxObjs = this.boxObjs;    
    if (el && el.boxid){
        var boxid = el.boxid;        
        var boxObj = boxObjs[boxid];
        return boxObj;        
    }    
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
    parentEl = (infoObj.parentEl) ? infoObj.parentEl : document.body;
    this.setBox(newEl, infoObj, parentEl);
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
    var id = (infoObj.id)? infoObj.id : getEl(exBoxObjs).getNewSeqId('tmp');
    el.exboxid = id;
    this.exBoxObjs[id] = infoObj;
    this.exBoxObjs[id].el = el;
    this.exBoxObjs[id].id = id;

    // Element 설정
    var g = this.globalExBoxSetup;
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
    return id;
};
BoxMan.prototype.getExBox = function(param){    
    if (typeof param == 'string'){        
        return this.getExBoxById(param);
    }else{        
        return this.getExBoxByEl(param);
    }    
};
BoxMan.prototype.getExBoxById = function(id){
    return this.exBoxObjs[id];
};
BoxMan.prototype.getExBoxByEl = function(el){
    var exBoxObjs = this.exBoxObjs;    
    if (el && el.exboxid){
        var exboxid = el.exboxid;        
        var exBoxObjs = exBoxObjs[exboxid];
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
        objid:el.getAttribute('data-obj-id')
    };    
    this.setObj(el, infoObj);
};
BoxMan.prototype.newObj = function(infoObj){    
    var newEl = getNewEl('div', '', '', {'data-obj':'true'}, '');    
    parentEl = (infoObj.parentEl) ? infoObj.parentEl : document.body;
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
    var id = (infoObj.id)? infoObj.id : getEl(objs).getNewSeqId('tmp');
    el.objid = id;
    this.objs[id] = infoObj;
    this.objs[id].el = el;
    this.objs[id].id = id;
        
    // Element 설정
    var g = this.globalObjSetup;    
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
    return id;
};
BoxMan.prototype.getObj = function(param){
    if (typeof param == 'string'){        
        return this.getObjById(param);
    }else{        
        return this.getObjByEl(param);
    }    
    return this.objs[id];
};
BoxMan.prototype.getObjById = function(id){
    return this.objs[id];
};
BoxMan.prototype.getObjByEl = function(el){
    var objs = this.objs;    
    if (el && el.objid){
        var objid = el.objid;
        var obj = objs[objid];
        return obj;
    }    
};
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
    this.createPreviewer(mvObj);
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
    var mvObjBeforeBox = meta.mvObjBeforeBox;
    var mvObjBeforeNextSibling = meta.mvObjBeforeNextSibling;
    var mvObjBeforePosition = meta.mvObjBeforePosition;
    var mvObjStartBodyOffset = meta.mvObjStartBodyOffset;
    var mvObjPreviewClone = meta.mvObjPreviewClone;
    var bfBoxInfo = this.getBox(mvObjBeforeBox);
    var afBoxInfo = this.getBox(boxEl);
    var objInfo = this.getObj(mvObj);
    
    var isFromBox = (bfBoxInfo != undefined);
    var isToBox = (afBoxInfo != undefined);
    var isToTree = ( isToBox 
                  && boxEl.getAttribute("data-tree-type") != undefined );
    var canEnter = ( isToBox 
                  && ( afBoxInfo.limit > this.getMovableObjCount(boxEl) || afBoxInfo.limit == undefined) );
    var isSameBox = ( bfBoxInfo == afBoxInfo );
    var isTypePush = ( meta.appendType == this.APPEND_TYPE_PUSH );
    var isRollback = ( !isTypePush && (isSameBox || !canEnter) );
    var isRollback2 = ( isTypePush && !canEnter && !isSameBox );
    var isRollbackWithEvent = (isToBox && boxEl.executeEventBeforeboxin && !boxEl.executeEventBeforeboxin(boxEl, mvObj, this.getMovableObjCount(mvObjBeforeBox)));    
    var isNotOnlyToBox = ( meta.isBoxToBox && !isToBox && isFromBox);
    var isAcceptedBox = ( !isToBox || getEl(bfBoxInfo).isAccepted(afBoxInfo.acceptbox, afBoxInfo.rejectbox) );
    var isAcceptedObj = ( !isToBox || getEl(objInfo).isAccepted(afBoxInfo.acceptobj, afBoxInfo.rejectobj) );

    // var isFromBox = (mvObjBeforeBox.getAttribute("data-box") != null && mvObjBeforeBox.getAttribute("data-box") != undefined);
    // var isToBox = (boxEl != undefined);
    // var isToTree = ( isToBox 
    //               && boxEl.getAttribute("data-tree-type") != undefined );
    // var canEnter = ( isToBox 
    //               && (boxEl.getAttribute("data-box") > this.getMovableObjCount(boxEl) || boxEl.getAttribute("data-box") == '') );
    // var isSameBox = ( boxEl == mvObjBeforeBox );
    // var isTypePush = ( meta.appendType == this.APPEND_TYPE_PUSH );
    // var isRollback = ( !isTypePush && (isSameBox || !canEnter) );
    // var isRollback2 = ( isTypePush && !canEnter && !isSameBox );
    // var isRollbackWithEvent = (isToBox && boxEl.executeEventBeforeboxin && !boxEl.executeEventBeforeboxin(boxEl, mvObj, this.getMovableObjCount(mvObjBeforeBox)));    
    // var isNotOnlyToBox = ( meta.isBoxToBox && !isToBox && isFromBox);
    
    var flagBeforeBoxEvent = false;
    var flagAfterBoxEvent = false;
    var isMoved = false;

    // 다시 같은 상자면 원위치, 이동을 허가하지 않은 상자면 원위치
    if ( isRollback || isRollbackWithEvent || isNotOnlyToBox || !isAcceptedBox || !isAcceptedObj){
        this.backToBefore(mvObj, mvObjBeforeBox, meta.appendType);        

    // Tree의 data-box기능이면
    }else if (isToTree){
        getEl(boxEl).clas.remove('sj-tree-box-to-go');
        if (boxEl.executeEventDrop){
            // 해당 tree에 정보 저장
            targetTree = sj.treeMan.get(boxEl.sjid);
            targetTree.repository[mvObj.sjid] = sj.objMan.get(mvObj.sjid);
            // 이동의 경우
            mvObj.parentNode.removeChild(mvObj);
            // 복사의 경우
            // 제공할 데이터
            var data = {
                mvObj:mvObj,
                obj:sj.objMan.get(mvObj.sjid),
                decidedBox:boxEl,
                treeObj:targetTree,
                mvObjBeforeBox:mvObjBeforeBox,
                path:sj.treeMan.getPath(boxEl.sjid)
            };
            // 이벤트 실행
            boxEl.executeEventDrop(event, data);
        }

    // 이동전 수행 펑션 true면 통과
    }else{ 
        // 다른 박스로 이동 
        if (boxEl){
            if (isRollback2){
                this.backToBefore(mvObj, mvObjBeforeBox, meta.appendType);
                return;
            }
            var mvTarget;
            if (meta.isOverwrite && !isSameBox){
                boxEl.innerHTML = '';
            }        
            if (meta.isCopy && !isSameBox){
                // 카피
                var copyObj = mvObj.cloneNode(true);                                                        
                this.setObj('', copyObj);
                mvTarget = copyObj;
                // 원위치
                this.backToBefore(mvObj, mvObjBeforeBox, meta.appendType);
            }else{
                mvTarget = mvObj;
            }

            this.goTo(mvTarget, boxEl, meta.appendType, mvObjPreviewClone);
            flagBeforeBoxEvent = true;
            flagAfterBoxEvent = true;
            isMoved = true;
        // 허공에서 허공으로 이동
        }else{
            console.log(11111);
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
BoxMan.prototype.goTo = function(mvObj, boxEl, type, mvObjPreviewClone){
    // APPEND_TYPE_LAST
    if (type == this.APPEND_TYPE_LAST){
        boxEl.appendChild(mvObj);
    // APPEND_TYPE_FIRST
    }else if (type == this.APPEND_TYPE_FIRST){
        boxEl.insertBefore(mvObj, boxEl.firstChild);
    //APPEND_TYPE_PUSH
    }else if (type == this.APPEND_TYPE_PUSH){                    
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
    }    
    mvObj.style.position = '';
};
BoxMan.prototype.backToBefore = function(mvObj, boxEl, type){
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





BoxMan.prototype.createPreviewer = function(mvObj){ 
    var meta = this.metaObj;
    var mvObjPreviewClone = mvObj.cloneNode(true);
    mvObjPreviewClone.setAttribute('data-obj', 'false'); //undefined, null, true, false를 지정하면 조건식에서 정상적으로 작동을 안함. 스트링으로
    mvObjPreviewClone.setAttribute('data-obj-previewer', 'true'); 
    getEl(mvObjPreviewClone).clas.add('sj-preview-going-to-be-in-box');
    mvObjPreviewClone.style.position = "";
    /* ie브라우저를 벗어나서 mouseup이벤트가 발생하지 않는 것 때문에 클론이 지워지지 않는 것 방지 */
    meta.mvObjPreviewClone = mvObjPreviewClone;
    meta.mvObjCloneList.push(mvObjPreviewClone);
};
BoxMan.prototype.setPreviewer = function(mvObj, event){    
    var meta = this.metaObj;
    var lastGoingToBeInThisBox = meta.lastGoingToBeInThisBox;
    var mvObjPreviewClone = meta.mvObjPreviewClone;
    var mvObjBeforeBox = meta.mvObjBeforeBox;    
    /** 가는 위치 미리 보여주기 **/
    var goingToBeInThisBox = this.getDecidedBox(mvObj, this.boxObjs, meta.lastPosX, meta.lastPosY);    
    var boxEl = goingToBeInThisBox;
    var bfBoxInfo = this.getBox(mvObjBeforeBox);
    var afBoxInfo = this.getBox(boxEl);
    var objInfo = this.getObj(mvObj);

    var isFromBox = (bfBoxInfo != undefined);
    var isToBox = (afBoxInfo != undefined);
    var isToTree = ( isToBox 
                  && boxEl.getAttribute("data-tree-type") != undefined );
    var canEnter = ( isToBox 
                  && ( afBoxInfo.limit > this.getMovableObjCount(boxEl) || afBoxInfo.limit == undefined) );
    var isSameBox = ( bfBoxInfo == afBoxInfo );
    var isTypePush = ( meta.appendType == this.APPEND_TYPE_PUSH );
    var isRollback = ( !isTypePush && (isSameBox || !canEnter) );
    var isRollback2 = ( isTypePush && !canEnter && !isSameBox );
    var isRollbackWithEvent = (isToBox && boxEl.executeEventBeforeboxin && !boxEl.executeEventBeforeboxin(boxEl, mvObj, this.getMovableObjCount(mvObjBeforeBox)));    
    var isNotOnlyToBox = ( meta.isBoxToBox && !isToBox && isFromBox);
    var isAcceptedBox = ( !isToBox || getEl(bfBoxInfo).isAccepted(afBoxInfo.acceptbox, afBoxInfo.rejectbox) );
    var isAcceptedObj = ( !isToBox || getEl(objInfo).isAccepted(afBoxInfo.acceptobj, afBoxInfo.rejectobj) );

    // var isFromBox = (mvObjBeforeBox.getAttribute("data-box") != null && mvObjBeforeBox.getAttribute("data-box") != undefined);
    // var isToBox = (boxEl != undefined);
    // var isToTree = ( isToBox 
    //               && boxEl.getAttribute("data-tree-type") != undefined );
    // var canEnter = ( isToBox 
    //               && (boxEl.getAttribute("data-box") > this.getMovableObjCount(boxEl) || boxEl.getAttribute("data-box") == '') );
    // var isSameBox = ( boxEl == mvObjBeforeBox );
    // var isTypePush = ( meta.appendType == this.APPEND_TYPE_PUSH );
    // var isRollback = ( !isTypePush && (isSameBox || !canEnter) );
    // var isRollback2 = ( isTypePush && !canEnter && !isSameBox );
    // var isRollbackWithEvent = (isToBox && boxEl.executeEventBeforeboxin && !boxEl.executeEventBeforeboxin(boxEl, mvObj, this.getMovableObjCount(mvObjBeforeBox)));    
    // var isNotOnlyToBox = ( meta.isBoxToBox && !isToBox && isFromBox);

    // 갈 곳 미리보기 효과 (클론 효과)    
    // Tree의 data-box기능이면 CSS효과만
    if (isToTree){
        if (lastGoingToBeInThisBox) getEl(lastGoingToBeInThisBox).clas.remove('sj-tree-box-to-go');
        getEl(goingToBeInThisBox).clas.add('sj-tree-box-to-go');
        meta.lastGoingToBeInThisBox = goingToBeInThisBox;       
    
    }else{        
        // 원위치로 지정    
        if (isRollback || isNotOnlyToBox || !isAcceptedBox || !isAcceptedObj){
            this.backToBefore(mvObjPreviewClone, mvObjBeforeBox, meta.appendType);
            meta.lastGoingToBeInThisBox = goingToBeInThisBox;

        // 갈 예정인 박스안 지정
        }else{
            if (boxEl){        
                if (isRollback2){
                    this.backToBefore(mvObjPreviewClone, mvObjBeforeBox, meta.appendType);
                    return;
                }
                this.goTo(mvObjPreviewClone, goingToBeInThisBox, meta.appendType, mvObjPreviewClone);
                meta.lastGoingToBeInThisBox = goingToBeInThisBox;
            }else{
                // 박스 밖으로 갈 예정
                if (lastGoingToBeInThisBox) getEl(lastGoingToBeInThisBox).clas.remove('sj-tree-box-to-go');
                if (mvObjPreviewClone.parentNode) mvObjPreviewClone.parentNode.removeChild(mvObjPreviewClone);
            }
        }        
    }
    
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
    if (mvObjCloneList.length > 3){
        mvObjCloneList = [];
    }    
}






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
    console.debug('-> MAX:'+ w +'/'+ h);
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






