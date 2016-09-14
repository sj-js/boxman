/*************************
 * getEl
 * do cross browsing
 *************************/
window.getNewEl = function(elNm, id, classNm, attrs, inner, eventNm, eventFunc){  
    var newEl = document.createElement(elNm);   // HTML객체 생성
    if (id) newEl.id = id;                              // 아이디  
    if (classNm) newEl.setAttribute('class', classNm);      // 클래스 
    for (var attrNm in attrs){ newEl.setAttribute(attrNm, attrs[attrNm]); } // 속성   
    if (inner) newEl.innerHTML = inner;         // 안 값  
    if (eventNm) getEl(newEl).addEventListener(eventNm, function(event){ eventFunc(event); });  // 이벤트
    return newEl;                               // 반환 
};

window.getEl = function(id){

    var querySelectorAll = function(selector){
        if (document.querySelectorAll){
            // return document.querySelectorAll(selector);
            return document.getElementById(selector);
        }else if (document.getElementsByTagName){
            /* Attribute */         
            var startIdx = selector.indexOf('[');
            var endIdx = selector.indexOf(']');
            var attr;
            var selectedList = [];
            if (startIdx != -1 && endIdx != -1){
                attr = selector.substring(startIdx +1, endIdx);
                /* 유효성검사에 맞는 Form 태그 들만 */
                var nodeNames = ['div', 'span', 'form', 'input', 'select', 'textarea'];
                for (var searchI=0; searchI< nodeNames.length; searchI++){
                    var elements = document.getElementsByTagName(nodeNames[searchI]);                   
                    for (var searchJ=0; searchJ<elements.length; searchJ++){                        
                        if (elements[searchJ].getAttribute(attr) != undefined){
                            selectedList.push(elements[searchJ]);
                        }
                    }
                }
            }
            return selectedList;        
        }
    };  
    
    
    var el = (typeof id == 'object') ? id : document.getElementById(id);    
    // var el = (typeof id == 'object') ? id : querySelectorAll(id);    
    this.obj = el;  

    this.attr = function(key, val){ 
        if (val){
            el.setAttribute(key, val); 
            return this;
        }else{
            return el.getAttribute(key);
        }       
    };
    this.clas = (function(){
        var classFuncs = {
            has: function(classNm){
                return (el.className.indexOf(classNm) != -1);                   
            },
            add: function(classNm){
                if (el.classList){
                    el.classList.add(classNm);
                }else{
                    el.className += ' ' +classNm+ ' ';
                }
                return classFuncs;
            },
            remove: function(classNm){
                if (el.classList){
                    el.classList.remove(classNm);
                }else{                  
                    var classList = el.className.split(' ');                    
                    while (classList.indexOf(classNm) != -1){
                        classList.splice(classList.indexOf(classNm), 1);                        
                    }
                    el.className = classList.join(' ');
                }
                return classFuncs;
            }
        };
        return classFuncs;
    }());
    this.findEl = function(attr, val){
        var subEls = el.children;
        for (var i=0; i<subEls.length; i++){
            if (subEls[i].getAttribute(attr) == val) return subEls[i];          
        }                   
    };
    this.findParentEl = function(attr, val){
        var foundEl;
        var parentEl = el;      
        while(parentEl){
            if (parentEl != document.body.parentNode){
                if (parentEl.getAttribute(attr) == val){
                    foundEl = parentEl;
                    break;              
                }
            }else{
                foundEl = null;
                break;
            }
            parentEl = parentEl.parentNode;
        }       
        return foundEl;
    };
    this.add = function(appender){
        if (typeof appender == 'object') 
            el.appendChild(appender);
        else 
            el.innerHTML += appender;
        return this;
    };
    this.addln = function(appender){        
        if (typeof appender == 'object')
            el.appendChild(appender);
        else
            el.innerHTML += (appender) ? appender : '';     
        el.appendChild(document.createElement('br'));
        return this;
    };
    this.hasEventListener = function(eventNm){
        return el.hasEventListener(eventNm);
    };
    this.removeEventListener = function(eventNm, fn){
        el.removeEventListener(eventNm, fn);
        return this;
    };
    this.addEventListener = function(eventNm, fn){      
        /* FireFox는 이 작업을 선행하게 하여 window.event객체를 전역으로 돌려야한다.*/
        if (navigator.userAgent.indexOf('Firefox') != -1){  
            el.addEventListener(eventNm, function(e){window.event=e;}, true);
        }       
        /* 일반 */
        if (el.addEventListener){           
            el.addEventListener(eventNm, function(event){
                fn(event);
                // fn(event, getEventTarget(event)); 
            });     
        /* 옛 IE */
        }else{                      
            el.attachEvent('on'+eventNm, function(event){               
                if (!event.target && event.srcElement) event.target = event.srcElement;
                fn(event);
                // fn(event, getEventTarget(event)); 
            });         
        }
        return;
    };  
    this.del = function(removeElObj){
        el.removeChild(removeElObj);
        return this;
    };
    this.html = function(innerHTML){
        el.innerHTML = innerHTML;
        return this;
    };  
    this.clear = function(){
        el.innerHTML = '';
        return this;
    };
    this.scrollDown = function(){
        el.scrollTop = el.scrollHeight;
        return this;
    };
    this.hideDiv = function(){          
        el.style.display = 'block';
        el.style.position = 'absolute';
        el.style.left = '-5555px';
        el.style.top = '-5555px';
        return this;
    };
    this.showDiv = function(){      
        el.style.display = 'block';
        el.style.position = 'absolute';
        el.style.left = '0px';
        el.style.top = '0px';       
        return this;        
    };
    this.getNewSeqId = function (idStr){        
        for (var seq=1; seq < 50000; seq++){
            var searchEmptyId = idStr + seq
            if (!(searchEmptyId in el)) return searchEmptyId;
        }       
        return null;
    };

    return this;
};
function BoxMan(el){
    var that = this;
    // var getEl = this.getEl;
    this.addedEventFuncs = {};    
    this.objs = {};        
    this.boxObjs = [];    
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
        isCopy:true,
        isOverwrite:false
    };    
    window.addEventListener('load', function(event){
        that.setMaxSize();
        //    sjHelper.cross.disableSelection(document.body);
//    sj.setMaxSize();
    /** 총괄 이벤트 등록 **/
//    if (!sj.isAdapted){
//        sj.isAdapted = true;
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
//    }
    });    

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
    testDiv.style.top = '-5555px'; 
    testDiv.style.left = '-5555px'; 
    testDiv.style.width = '100%'; 
    testDiv.style.height = '100%';    
    testDiv.style.border = '0px solid'; 
    testDiv.style.padding = '0px'; 
    testDiv.style.margin = '0px';  
    getEl(document.body).add(testDiv);
    var w = testDiv.offsetWidth;
    var h = testDiv.offsetHeight;
    console.log('MAX:'+ meta.cam.w +'/'+ meta.cam.h);
    console.log('-> MAX:'+ w +'/'+ h);
    if (!meta.cam.w){
        meta.cam.w = w;
        meta.cam.h = h;
    }
};
BoxMan.prototype.setLastPos = function(event){ 
    var meta = this.metaObj;
    /* Mobile Control */        
    if (event.touches != undefined){
        meta.lastPosX = event.touches[0].pageX;
        meta.lastPosY = event.touches[0].pageY;              
    }else{
    /* Web Control */
        meta.lastPosX = event.clientX + this.getBodyScrollX();
        meta.lastPosY = event.clientY + this.getBodyScrollY();
    }
};  
/* X,Y가 영역 안에 존재하는지 확인
 * 의존 : getBodyOffset()  */
BoxMan.prototype.isInBox = function (target, objX, objY){       
    var targetBodyOffset = this.getBodyOffset(target);
    var targetBodyOffsetX = targetBodyOffset.x;
    var targetBodyOffsetY = targetBodyOffset.y;

    // 20160706 이게 왜있는거지??? 주석처리하자!
    /* 문서 영역을 벗어났을 때 보정 */
    // objX = (objX <= 1) ? 1 : objX
    // objX = (objX > sjHelper.cross.getBodyOffsetX()) ? sjHelper.cross.getBodyOffsetX() : objX
    // objY = (objY <= 1) ? 1 : objY
    // objY = (objY > sjHelper.cross.getBodyOffsetY()) ? sjHelper.cross.getBodyOffsetY() : objY
            
    /* 상자 안인지 판정 */
    if(targetBodyOffsetX + target.scrollLeft< objX
    && targetBodyOffsetX + target.offsetWidth + target.scrollLeft> objX
    && targetBodyOffsetY + target.scrollTop< objY
    && targetBodyOffsetY + target.offsetHeight + target.scrollTop > objY){
        return true;        
    }
    return false;       
};
/*****
 * 문서의 스크롤된 수치 반환
 * IE8 : document.documentElement.scrollLeft 
 * IE9 : window.pageXOffset 
 * IE11 & others : document.body.scrollLeft 
 *****/
BoxMan.prototype.getBodyScrollX = function(event){    
    var bodyPageX = 0;
    if (document.documentElement && document.documentElement.scrollLeft) bodyPageX = document.documentElement.scrollLeft;
    if (window.pageXOffset) bodyPageY = window.pageXOffset;
    if (document.body && document.body.scrollLeft) bodyPageX = document.body.scrollLeft;
    return bodyPageX;
};
BoxMan.prototype.getBodyScrollY = function(event){    
    var bodyPageY = 0;
    if (document.documentElement && document.documentElement.scrollTop) bodyPageY = document.documentElement.scrollTop;
    if (window.pageYOffset) bodyPageY = window.pageYOffset;
    if (document.body && document.body.scrollTop) bodyPageY = document.body.scrollTop;
    return bodyPageY;
};
/*****
 * 문서의 크기
 * IE구버전 : document.documentElement.offsetWidth 
 * IE11 & others : document.body.offsetWidth 
 *****/
BoxMan.prototype.getBodyOffsetX = function(event){    
    var bodyOffsetX = 0;
    if (document.documentElement && document.documentElement.offsetWidth) return document.documentElement.offsetWidth;
    if (document.body && document.body.offsetWidth) return document.body.offsetWidth;
    return bodyOffsetX;
};
BoxMan.prototype.getBodyOffsetY = function(event){
    var bodyOffsetY = 0;
    if (document.documentElement && document.documentElement.offsetHeight) return document.documentElement.offsetHeight;
    if (document.body && document.body.offsetHeight) return document.body.offsetHeight;
    return bodyOffsetY;
};
/* 눈에 보이는 좌표 값 (객체마다  DOM TREE구조와 position의 영향을 받기 때문에, 다른 계산이 필요하여 만든 함수)
 * 재료는 DOM객체 */
BoxMan.prototype.getBodyOffset = function(objTemp){    
    var sumOffsetLeft = 0;
    var sumOffsetTop = 0;
    var thisObj = objTemp;
    var parentObj = objTemp.parentNode;
    
    while(parentObj){
        if (parentObj!=document.body.parentNode.parentNode
        && parentObj!=document.body.parentNode.parentNode.parentNode) {
            
            var scrollX = 0;
            var scrollY = 0;
            if (thisObj != document.body){
                scrollX = thisObj.scrollLeft;
                scrollY = thisObj.scrollTop;                    
            }
            
            if (parentObj.style.position == 'absolute') {
                sumOffsetLeft += thisObj.offsetLeft - scrollX;
                sumOffsetTop += thisObj.offsetTop - scrollY;
            }else if(parentObj.style.position == 'fixed' || thisObj.style.position == 'fixed'){
                sumOffsetLeft += thisObj.offsetLeft + this.getBodyScrollX();
                sumOffsetTop += thisObj.offsetTop + this.getBodyScrollY();
                break;
            }else{
                sumOffsetLeft += (thisObj.offsetLeft - parentObj.offsetLeft) - scrollX;
                sumOffsetTop += (thisObj.offsetTop - parentObj.offsetTop) - scrollY;                    
            }           
        }           
        thisObj = parentObj;
        parentObj = parentObj.parentNode;           
    }

    var objBodyOffset = {x:sumOffsetLeft, y:sumOffsetTop};  
    return objBodyOffset;
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





/*************************************************************
 *  WHEN you start draging movable object
 *************************************************************/
BoxMan.prototype.whenMouseDown = function(event){
    var meta = this.metaObj;
    meta.isOnMoving = false;
    return true;
};

BoxMan.prototype.objStartMove = function(event, selectedObj){
    // var getEl = this.getEl;
    var meta = this.metaObj;
    var mvObj;    
    /*sjHelper.cross.stopPropagation(event);*/ //잠시

    //있으면 MIE에서 이미지저장 덜 뜸
    //있으면 MFirefox에서 위아래 이동시 스크롤 되는 것 방지, 객체 이동이 원할, 대신 스크롤로직도 안됨
    //없으면 MChrome에서 스크롤판정로직이 자연스럽게 됨.  ==> 그래서 이미지는 DIV의 backgorund로 설정시키는 data-img 속성 추가로 MIE에서는 없어도 이미지저장이 안뜨게 함
    // 임시방편 : 파이어폭스에서 스크롤로직이 안되더라도  preventDefault를 실행하기
    // 파이어폭스의 특수성 때문에 따로 이벤트 처리 / ★현재 파이어폭스에서만 무빙객체의 이동취소 후 스크롤 시키는 로직이 안됨!!!ㅠ
    if (navigator.userAgent.indexOf('Firefox') != -1) event.preventDefault();


    /* ★ IE8에서 이벤트 넣어줄때 this라고 쓴 부분에서 윈도우 객체를 잡아다 보낸다. 그럼 NONO 할 수 없이 srcElement를 쓰고 부모님에게 묻고 물어서 data-movable가능하신지 여쭈어서 찾는다.*/
    if (selectedObj != window){
        mvObj = selectedObj;
    }else{
        // var searchMovableObj = sjHelper.cross.srcElement(event);
        var searchMovableObj = event.target;
        while(searchMovableObj){
            if (searchMovableObj.getAttribute('data-movable') != undefined) break;
            searchMovableObj = searchMovableObj.parentNode;
        }
        if (searchMovableObj){
            mvObj = searchMovableObj;
        }
    }
    meta.mvObj = mvObj;

    /*** 갈 곳 미리보기 클론 ***/
    this.createPreviewer(mvObj);    

    /* 이동 전 정보 저장 */
    meta.mvObjBeforeBox = mvObj.parentNode;
    meta.mvObjBeforePosition = mvObj.style.position;    
    meta.mvObjBeforeNextSibling = mvObj.nextSibling;

    /* 현재 마우스/터치 위치를 전역에 저장 */
    this.setLastPos(event);

    /* mvObjStartBodyOffset = body관점에서 대상객체의 offset */        
    var mvObjStartBodyOffset = this.getBodyOffset(mvObj);    
    meta.mvObjStartBodyOffset = mvObjStartBodyOffset;

    /* Mobile Control */
    if (event.touches != undefined){
        meta.timerObj = event.touches[0].target;
        this.removeTimer();
        meta.timer = setInterval(setTimer, 100);        
        /* mvObj.adjust = mouseDown을 시작한 곳과 대상객체의 offset과의 거리 */
        mvObj.adjustX = event.touches[0].pageX - mvObjStartBodyOffset.x;
        mvObj.adjustY = event.touches[0].pageY - mvObjStartBodyOffset.y;
        return;

    /* Web Control */
    }else{        
        /* mvObj.adjust = mouseDown을 시작한 곳과 대상객체의 offset과의 거리 */
        mvObj.adjustX = event.clientX - mvObjStartBodyOffset.x + this.getBodyScrollX();
        mvObj.adjustY = event.clientY - mvObjStartBodyOffset.y + this.getBodyScrollY();
        /* mvObj의 이동을 허가하는  표시와 설정 */
        getEl(mvObj).clas.add('sj-obj-is-on-moving');
        meta.isOnDown = true;
        meta.isOnMoving = false;
    }
    
};

BoxMan.prototype.whenMouseMove = function(event){
    // var getEl = this.getEl;
    var that = this;
    var meta = this.metaObj;   
    var lastPosX = meta.lastPosX;
    var lastPosY = meta.lastPosY;
    var cam = meta.cam;
    var mvObj = meta.mvObj;

    /* 페인트 이벤트가 ON이면, 객체이동 이벤트 취소 */
    // if (isOnPaintDown) {
    //     isOnDown = false;
    //     sjHelper.cross.classList.remove(mvObj, 'sj-obj-is-on-moving');
    // }
    /* 현재 마우스/터치 위치를 전역에 저장 */
    this.setLastPos(event);
    /* 모바일 터치 이벤트 시행 중... 영역에서 벗어나면 드래그 카운터 취소 */
    if (meta.timerObj && !this.isInBox(meta.timerObj, meta.lastPosX, meta.lastPosY)) this.removeTimer();

    if (meta.isOnDown){
        event.preventDefault();

        /*** 객체 갈 곳 미리보기 ***/
      	this.setPreviewer(mvObj);

        /** mvObj 이동하여 표시하기 **/
        /* X축 이동하기*/
        if(lastPosX - mvObj.adjustX >= 1
            && lastPosX - mvObj.adjustX + mvObj.offsetWidth <= cam.w) {
            mvObj.style.left = (lastPosX - mvObj.adjustX) + 'px';
        }else{
            /* X축 이동 제한*/
            if(lastPosX - mvObj.adjustX < 1) mvObj.style.left = 0 + 'px';
            if(lastPosX - mvObj.adjustX + mvObj.offsetWidth > cam.w)
                mvObj.style.left = (cam.w - mvObj.offsetWidth) + 'px';
        }
        /* Y축 이동하기 */
        if(lastPosY - mvObj.adjustY >= 1
            && lastPosY - mvObj.adjustY + mvObj.offsetHeight <= cam.h){
            mvObj.style.top = (lastPosY - mvObj.adjustY)  + 'px';
        }else{
            /* Y축 이동 제한 */
            if(lastPosY - mvObj.adjustY < 1) mvObj.style.top = 0 + 'px';
            if(lastPosY - mvObj.adjustY + mvObj.offsetHeight > cam.h){
                mvObj.style.top = (cam.h - mvObj.offsetHeight) + 'px';
            }
        }

        /** mvObj 이동중인 상태를 적용 **/
        mvObj.style.position = 'absolute';
        mvObj.style.float = '';
        getEl(mvObj).clas.add('sj-obj-is-on-moving');
        document.body.appendChild(mvObj);
        /* 이동시 크기변이 또는 해당Layout의 scroll계산의 까다로움으로 인하여 mvObj의 영역에 마우스가 위치하지 않는 경우 마우스를 0점 위치로 */
        if (!meta.isOnMoving) {
            if (mvObj.adjustX > mvObj.offsetWidth || mvObj.adjustX < 0) mvObj.adjustX = mvObj.offsetWidth;
            if (mvObj.adjustY > mvObj.offsetHeight || mvObj.adjustY < 0) mvObj.adjustY = mvObj.offsetHeight;
        }

        /* 이동중 확정 */
        meta.isOnMoving = true;
    }

};
BoxMan.prototype.whenMouseUp = function (event){
    // var getEl = this.getEl;
    var meta = this.metaObj;    
    var mvObjBeforeBox = meta.mvObjBeforeBox;
    var mvObjBeforeNextSibling = meta.mvObjBeforeNextSibling;
    var mvObjBeforePosition = meta.mvObjBeforePosition;
    var mvObjStartBodyOffset = meta.mvObjStartBodyOffset;
    var mvObj = meta.mvObj;
    /* 객체이동 준비 취소 */
    this.removeTimer();
    /* 페인팅 취소 */
    // if (isOnPaintDown) {
    //     clearInterval(paintTimer);
    //     isOnPaintDown = false;
    // }
    /* 이동객체 상태 취소 */
    if (meta.isOnDown) {
        getEl(mvObj).clas.remove('sj-obj-is-on-moving');
        meta.isOnDown = false;
    }

    /*** 객체 갈 곳 미리보기 지우기 ***/
  	this.deletePreviewer();


    /* 아래는 이동중이던 객체에게 적용 */
    if (meta.isOnMoving){
        /** mvObj가 이동할 박스객체 하나 선정 **/
        var decidedBox = this.getDecidedBox(mvObj, this.boxObjs, meta.lastPosX, meta.lastPosY);

        /** 결정된 박스에 mvObj넣기  **/
        if (decidedBox != undefined){
            var canEnterWithoutNoLimit = (decidedBox.getAttribute("data-box") == '');
            var canEnter = (decidedBox.getAttribute("data-box") > this.getMovableObjCount(decidedBox));
            var isTreeDataBox = ( decidedBox.getAttribute("data-tree-type") != undefined );

            // 다시 같은 상자면 원위치, 이동을 허가하지 않은 상자면 원위치
            if ( decidedBox==mvObjBeforeBox || (!canEnterWithoutNoLimit && !canEnter) ){
                mvObjBeforeBox.insertBefore(mvObj, mvObjBeforeNextSibling);
                mvObj.style.position = (mvObjBeforePosition=='absolute') ? 'absolute':'';
                if (mvObjBeforePosition=='absolute'){
                    mvObj.style.left = mvObjStartBodyOffset.x +'px';
                    mvObj.style.top = mvObjStartBodyOffset.y +'px';
                    mvObj.style.float = ''; //??왜 플롯을??
                }

            // Tree의 data-box기능이면
            }else if (isTreeDataBox){
                getEl(decidedBox).clas.remove('sj-tree-box-to-go');
                if (decidedBox.executeEventDrop){
                    // 해당 tree에 정보 저장
                    targetTree = sj.treeMan.get(decidedBox.sjid);
                    targetTree.repository[mvObj.sjid] = sj.objMan.get(mvObj.sjid);
                    // 이동의 경우
                    mvObj.parentNode.removeChild(mvObj);
                    // 복사의 경우
                    // 제공할 데이터
                    var data = {
                        mvObj:mvObj,
                        obj:sj.objMan.get(mvObj.sjid),
                        decidedBox:decidedBox,
                        treeObj:targetTree,
                        mvObjBeforeBox:mvObjBeforeBox,
                        path:sj.treeMan.getPath(decidedBox.sjid)
                    };
                    // 이벤트 실행
                    decidedBox.executeEventDrop(event, data);
                }

            // 다른 상자면 진행
            }else{
                // false면 원위치
                if (decidedBox.executeEventBeforeboxin && !decidedBox.executeEventBeforeboxin(decidedBox, mvObj, this.getMovableObjCount(mvObjBeforeBox))){
                    mvObjBeforeBox.insertBefore(mvObj, mvObjBeforeNextSibling);
                    mvObj.style.position = (mvObjBeforePosition=='absolute') ? 'absolute':'';
                    if (mvObjBeforePosition=='absolute'){
                        mvObj.style.left = mvObjStartBodyOffset.x +'px';
                        mvObj.style.top = mvObjStartBodyOffset.y +'px';
                        mvObj.style.float = ''; //??왜 플롯을??
                    }

                // 이동전 수행 펑션 true면 통과
                }else{
                    if (meta.isOverwrite){
                    	decidedBox.innerHTML = '';
                    }
                    if (meta.isCopy){
                    	// 카피
                    	var copyObj = mvObj.cloneNode(true);                    	
                    	decidedBox.appendChild(copyObj);
                    	this.setObj('', copyObj);
                    	copyObj.style.position = '';
                    	// 원위치
                    	mvObjBeforeBox.insertBefore(mvObj, mvObjBeforeNextSibling);
		                mvObj.style.position = (mvObjBeforePosition=='absolute') ? 'absolute':'';
		                if (mvObjBeforePosition=='absolute'){
		                    mvObj.style.left = mvObjStartBodyOffset.x +'px';
		                    mvObj.style.top = mvObjStartBodyOffset.y +'px';
		                    mvObj.style.float = ''; //??왜 플롯을??
		                }
                    }else{
                    	decidedBox.appendChild(mvObj);
                    	mvObj.style.position = '';
                    }
                    // 이벤트 실행(박스객체, 이동객체, 박스안 이동객체 수)
                    var boxCnt = this.getMovableObjCount(decidedBox);
                    var bBoxCnt = this.getMovableObjCount(mvObjBeforeBox);
                    if (mvObjBeforeBox.executeEventMustDo) mvObjBeforeBox.executeEventMustDo();
                    if (mvObjBeforeBox.executeEventBoxinout) mvObjBeforeBox.executeEventBoxinout(mvObjBeforeBox, mvObj, bBoxCnt);
                    if (mvObjBeforeBox.executeEventBoxout) mvObjBeforeBox.executeEventBoxout(mvObjBeforeBox, mvObj, bBoxCnt);
                    if (decidedBox.executeEventMustDo) decidedBox.executeEventMustDo();
                    if (decidedBox.executeEventBoxinout) decidedBox.executeEventBoxinout(decidedBox, mvObj, boxCnt, mvObjBeforeBox);
                    if (decidedBox.executeEventBoxin) decidedBox.executeEventBoxin(decidedBox, mvObj, boxCnt, mvObjBeforeBox);
                }
            }

            /* 초기화 */
            mvObj = null;
            return;
        }

        /** 결정된 박스에 mvObj넣기 (밖 허가 안되면 위치 원상 복구, 허가면 이전 박스의 박스아웃 이벤트 발생)  **/
        var bBoxCnt = this.getMovableObjCount(mvObjBeforeBox);
        if (mvObjBeforeBox.executeEventMustDo) mvObjBeforeBox.executeEventMustDo();
        if (mvObjBeforeBox.executeEventBoxinout) mvObjBeforeBox.executeEventBoxinout(mvObjBeforeBox, mvObj, bBoxCnt);
        if (mvObjBeforeBox.executeEventBoxout) mvObjBeforeBox.executeEventBoxout(mvObjBeforeBox, mvObj, bBoxCnt);

        /** confirm mvObj is out of the Box **/
        /* 초기화 */
        mvObj = null;
        return;
    }
};
BoxMan.prototype.getDecidedBox = function(mvObj, boxObjs, lastPosX, lastPosY){
    var mvObjOnThisBoxObjs = [];
    var decidedBox;
    var decidedBoxLevel = 0;
    var decidedFixedBox;
    var decidedFixedBoxLevel = 0;

    /** 현재 마우스 위치의 박스객체 모으기 **/
    for (var i=0; i<boxObjs.length; i++){
        if(this.isInBox(boxObjs[i], lastPosX, lastPosY) && mvObj != boxObjs[i]){
            mvObjOnThisBoxObjs.push(boxObjs[i]);
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
            var isMovableObj = box.children[j].getAttribute('data-movable');
            if (isMovableObj != null && isMovableObj != undefined && isMovableObj != 'false'){
                boxSize++;
            }
        }
    }
    return boxSize;
};





BoxMan.prototype.createPreviewer = function(mvObj){
	// var getEl = this.getEl;
	var meta = this.metaObj;
	var mvObjPreviewClone = mvObj.cloneNode(true);
    mvObjPreviewClone.setAttribute('data-movable', 'false'); //undefined, null, true, false를 지정하면 조건식에서 정상적으로 작동을 안함. 스트링으로
    getEl(mvObjPreviewClone).clas.add('sj-preview-going-to-be-in-box');
    mvObjPreviewClone.style.position = "";
    /* ie브라우저를 벗어나서 mouseup이벤트가 발생하지 않는 것 때문에 클론이 지워지지 않는 것 방지 */
    meta.mvObjPreviewClone = mvObjPreviewClone;
    meta.mvObjCloneList.push(mvObjPreviewClone);
};
BoxMan.prototype.setPreviewer = function(mvObj){	
    // var getEl = this.getEl;
    var meta = this.metaObj;    
    var lastGoingToBeInThisBox = meta.lastGoingToBeInThisBox;
    var mvObjPreviewClone = meta.mvObjPreviewClone;
    var mvObjBeforeBox = meta.mvObjBeforeBox;
    var mvObjBeforeNextSibling = meta.mvObjBeforeNextSibling;
    var mvObjBeforePosition = meta.mvObjBeforePosition;    
    /** 가는 위치 미리 보여주기 **/
    var goingToBeInThisBox = this.getDecidedBox(mvObj, this.boxObjs, meta.lastPosX, meta.lastPosY);
    var canEnterWithoutNoLimit;
    var canEnter;
    var isTreeDataBox;
    if (goingToBeInThisBox != undefined){
        canEnterWithoutNoLimit = ( goingToBeInThisBox.getAttribute("data-box") == '' );
        canEnter = ( goingToBeInThisBox.getAttribute("data-box") > this.getMovableObjCount(goingToBeInThisBox) );
        isTreeDataBox = ( goingToBeInThisBox.getAttribute("data-tree-type") != undefined );
    }
    // 박스 밖으로 갈 예정
    if (goingToBeInThisBox == undefined){
        if (lastGoingToBeInThisBox) getEl(lastGoingToBeInThisBox).clas.remove('sj-tree-box-to-go');
        if (mvObjPreviewClone.parentNode) mvObjPreviewClone.parentNode.removeChild(mvObjPreviewClone);
    // 갈 곳 미리보기 효과
    }else{
        // Tree의 data-box기능이면 CSS효과만
        if (isTreeDataBox){
            if (lastGoingToBeInThisBox) getEl(lastGoingToBeInThisBox).clas.remove('sj-tree-box-to-go');
            getEl(goingToBeInThisBox).clas.add('sj-tree-box-to-go');
            meta.lastGoingToBeInThisBox = goingToBeInThisBox;

		// 클론효과
        }else{
            // 원위치로 지정
            if (goingToBeInThisBox==mvObjBeforeBox || (!canEnterWithoutNoLimit && !canEnter)){
                mvObjBeforeBox.insertBefore(mvObjPreviewClone, mvObjBeforeNextSibling);
                mvObjPreviewClone.style.position = mvObjBeforePosition;
                meta.lastGoingToBeInThisBox = goingToBeInThisBox;

			// 갈 예정인 박스안 지정
            }else{
                goingToBeInThisBox.appendChild(mvObjPreviewClone);
                mvObjPreviewClone.style.position = "";
                meta.lastGoingToBeInThisBox = goingToBeInThisBox;
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






BoxMan.prototype.detect = function(){
    function querySelectorAll(selector){
        if(document.querySelectorAll){
            return document.querySelectorAll(selector);
        }else if(document.getElementsByTagName){
            /* Attribute */         
            var startIdx = selector.indexOf('[');
            var endIdx = selector.indexOf(']');
            var attr;
            var selectedList = [];
            if (startIdx != -1 && endIdx != -1){
                attr = selector.substring(startIdx +1, endIdx);
                /* 유효성검사에 맞는 Form 태그 들만 */
                var nodeNames = ['div', 'span', 'form', 'input', 'select', 'textarea'];
                for (var searchI=0; searchI< nodeNames.length; searchI++){
                    var elements = document.getElementsByTagName(nodeNames[searchI]);                   
                    for (var searchJ=0; searchJ<elements.length; searchJ++){                        
                        if (elements[searchJ].getAttribute(attr) != undefined){
                            selectedList.push(elements[searchJ]);
                        }
                    }
                }
            }
            return selectedList;        
        }
    }
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
    /** 객체마다 적용(담는 상자) **/
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
    var setedObjs = querySelectorAll('[data-box]');  
    for (var j=0; j<setedObjs.length; j++){
        var obj = setedObjs[j];
        if (obj.isAdaptedBox) continue;
        obj.isAdaptedBox = true;
        this.add(obj);
    }
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
    /** 객체마다 적용(상자 끌기) **/
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
    var setedObjs = querySelectorAll('[data-movable]');  
    for (var j=0; j<setedObjs.length; j++){
        var obj = setedObjs[j];
        if (obj.isAdaptedMovable) continue;
        obj.isAdaptedMovable = true;
        this.setObj('', obj);
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
BoxMan.prototype.add = function(obj){
    // var getEl = this.getEl;
    getEl(obj).clas.add('sj-obj-box');
    /* 담는 상자 pool에 등록*/
    this.boxObjs.push(obj);
    obj.isAdaptedBox = true;

    if (obj.getAttribute('data-box') == null && obj.getAttribute('data-box') == undefined) obj.setAttribute('data-box', '');

    /* DOM에서 이벤트 등록 */
    var eventFn = obj.getAttribute('data-event-beforeboxin');
    if (eventFn != null && eventFn != undefined){
        obj.executeEventBeforeboxin = new Function('box', 'obj', 'boxsize', eventFn);
    }
    /**/
    var eventFn = obj.getAttribute('data-event-boxinout');
    if (eventFn != null && eventFn != undefined){
        obj.executeEventBoxinout = new Function('box','obj','boxSize', 'boxBefore', eventFn);
    }
    /**/
    var eventFn = obj.getAttribute('data-event-start');
    if (eventFn != null && eventFn != undefined){
        obj.executeEventStart = new Function('box','obj','boxSize', eventFn);
        obj.executeEventStart(obj, undefined, this.getMovableObjCount(obj));
    }
    /**/
    var eventFn = obj.getAttribute('data-event-boxin');
    if (eventFn != null && eventFn != undefined){
        obj.executeEventBoxin = new Function('box','obj','boxSize', 'boxBefore', eventFn);
    }
    /**/
    var eventFn = obj.getAttribute('data-event-boxout');
    if (eventFn != null && eventFn != undefined){
        obj.executeEventBoxout = new Function('box','obj','boxSize', eventFn);
    }
};












BoxMan.prototype.newObj = function(name, content, type){
    var that = this;
	// var getEl = this.getEl;
    var getNewEl = this.getNewEl;
    //객체 생성
    var newEl = getNewEl('div', '', '', {'data-movable':'true'}, '');
    var sjid = getEl(sj.objMan.objs).getNewSeqId('doc');
    newEl.style.background = 'url("'+ imgURL +'")';
    newEl.style.backgroundSize = w+' '+h;
    newEl.style.width = w;
    newEl.style.height = h;
    newEl.sjid = sjid;

    getEl('docBox').add(newEl);
    // SJMouseGetPowerAfterLoad();
    
    return sjid;
};
BoxMan.prototype.setObj = function(id, el, obj){
    // var getEl = this.getEl;
    var that = this;
    var objs = this.objs;
    
    id = (id) ? id : getEl(objs).getNewSeqId('tmp');    
    this.objs[id] = obj;

    // 움직이는 객체 적용
    el.isAdaptedMovable = true;
    getEl(el).clas.add('sj-obj-movable');
    if (this.isMobile()){
        getEl(el).addEventListener('touchstart', function(event){ that.objStartMove(event, el); });
    }else{
        getEl(el).addEventListener('mousedown', function(event){ that.objStartMove(event, el); });
    }

    getEl(el).addEventListener('click', function(){});
    el.style.left = el.offsetLeft + 'px';
    el.style.top = el.offsetTop + 'px';
    
};
BoxMan.prototype.getObj = function(id){
    return this.objs[id];
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








var disableSelection = function (el){
    if (typeof el.ondragstart != 'undefined') el.ondragstart = function(){return false;};
    if (typeof el.onselectstart != 'undefined') el.onselectstart = function(){return false;};
    if (typeof el.oncontextmenu != 'undefined') el.oncontextmenu = function(){return false;};
    /* 파이어폭스에서 드래그 선택 금지 */
    if (typeof el.style.MozUserSelect != 'undefined') document.body.style.MozUserSelect = 'none';
};






/*************************
 * getEl
 * do cross browsing
 *************************/
BoxMan.prototype.getNewEl = function(elNm, id, classNm, attrs, inner, eventNm, eventFunc){	
	var newEl = document.createElement(elNm);	// HTML객체 생성
	if (id) newEl.id = id;								// 아이디	
	if (classNm) newEl.setAttribute('class', classNm);		// 클래스 
	for (var attrNm in attrs){ newEl.setAttribute(attrNm, attrs[attrNm]); }	// 속성	
	if (inner) newEl.innerHTML = inner;			// 안 값	
	if (eventNm) getEl(newEl).addEventListener(eventNm, function(event){ eventFunc(event); });	// 이벤트
	return newEl;								// 반환 
};

BoxMan.prototype.getEl = function(id){

    var querySelectorAll = function(selector){
        if (document.querySelectorAll){
            // return document.querySelectorAll(selector);
            return document.getElementById(selector);
        }else if (document.getElementsByTagName){
            /* Attribute */         
            var startIdx = selector.indexOf('[');
            var endIdx = selector.indexOf(']');
            var attr;
            var selectedList = [];
            if (startIdx != -1 && endIdx != -1){
                attr = selector.substring(startIdx +1, endIdx);
                /* 유효성검사에 맞는 Form 태그 들만 */
                var nodeNames = ['div', 'span', 'form', 'input', 'select', 'textarea'];
                for (var searchI=0; searchI< nodeNames.length; searchI++){
                    var elements = document.getElementsByTagName(nodeNames[searchI]);                   
                    for (var searchJ=0; searchJ<elements.length; searchJ++){                        
                        if (elements[searchJ].getAttribute(attr) != undefined){
                            selectedList.push(elements[searchJ]);
                        }
                    }
                }
            }
            return selectedList;        
        }
    };  
    
    
    var el = (typeof id == 'object') ? id : document.getElementById(id);    
    // var el = (typeof id == 'object') ? id : querySelectorAll(id);    
    this.obj = el;  

    this.attr = function(key, val){ 
        if (val){
            el.setAttribute(key, val); 
            return this;
        }else{
            return el.getAttribute(key);
        }       
    };
    this.clas = (function(){
        var classFuncs = {
            has: function(classNm){
                return (el.className.indexOf(classNm) != -1);                   
            },
            add: function(classNm){
                if (el.classList){
                    el.classList.add(classNm);
                }else{
                    el.className += ' ' +classNm+ ' ';
                }
                return classFuncs;
            },
            remove: function(classNm){
                if (el.classList){
                    el.classList.remove(classNm);
                }else{                  
                    var classList = el.className.split(' ');                    
                    while (classList.indexOf(classNm) != -1){
                        classList.splice(classList.indexOf(classNm), 1);                        
                    }
                    el.className = classList.join(' ');
                }
                return classFuncs;
            }
        };
        return classFuncs;
    }());
    this.findEl = function(attr, val){
        var subEls = el.children;
        for (var i=0; i<subEls.length; i++){
            if (subEls[i].getAttribute(attr) == val) return subEls[i];          
        }                   
    };
    this.findParentEl = function(attr, val){
        var foundEl;
        var parentEl = el;      
        while(parentEl){
            if (parentEl != document.body.parentNode){
                if (parentEl.getAttribute(attr) == val){
                    foundEl = parentEl;
                    break;              
                }
            }else{
                foundEl = null;
                break;
            }
            parentEl = parentEl.parentNode;
        }       
        return foundEl;
    };
    this.add = function(appender){
        if (typeof appender == 'object') 
            el.appendChild(appender);
        else 
            el.innerHTML += appender;
        return this;
    };
    this.addln = function(appender){        
        if (typeof appender == 'object')
            el.appendChild(appender);
        else
            el.innerHTML += (appender) ? appender : '';     
        el.appendChild(document.createElement('br'));
        return this;
    };
    this.hasEventListener = function(eventNm){
        return el.hasEventListener(eventNm);
    };
    this.removeEventListener = function(eventNm, fn){
        el.removeEventListener(eventNm, fn);
        return this;
    };
    this.addEventListener = function(eventNm, fn){      
        /* FireFox는 이 작업을 선행하게 하여 window.event객체를 전역으로 돌려야한다.*/
        if (navigator.userAgent.indexOf('Firefox') != -1){  
            el.addEventListener(eventNm, function(e){window.event=e;}, true);
        }       
        /* 일반 */
        if (el.addEventListener){           
            el.addEventListener(eventNm, function(event){
                fn(event);
                // fn(event, getEventTarget(event)); 
            });     
        /* 옛 IE */
        }else{                      
            el.attachEvent('on'+eventNm, function(event){               
                if (!event.target && event.srcElement) event.target = event.srcElement;
                fn(event);
                // fn(event, getEventTarget(event)); 
            });         
        }
        return;
    };  
    this.del = function(removeElObj){
        el.removeChild(removeElObj);
        return this;
    };
    this.html = function(innerHTML){
        el.innerHTML = innerHTML;
        return this;
    };  
    this.clear = function(){
        el.innerHTML = '';
        return this;
    };
    this.scrollDown = function(){
        el.scrollTop = el.scrollHeight;
        return this;
    };
    this.hideDiv = function(){          
        el.style.display = 'block';
        el.style.position = 'absolute';
        el.style.left = '-5555px';
        el.style.top = '-5555px';
        return this;
    };
    this.showDiv = function(){      
        el.style.display = 'block';
        el.style.position = 'absolute';
        el.style.left = '0px';
        el.style.top = '0px';       
        return this;        
    };
    this.getNewSeqId = function (idStr){        
        for (var seq=1; seq < 50000; seq++){
            var searchEmptyId = idStr + seq
            if (!(searchEmptyId in el)) return searchEmptyId;
        }       
        return null;
    };

    return this;
}