# Condition
`조건에 따라 옵션`을 다르게 설정 할 수 있습니다.
   
#### ※ 자동적용
- 편의를 위해서 예제에서는 다음 코드가 생략되어 있습니다.
    ```html
    <style>
        div[data-box] {width:200px; min-height:30px;}
        div[data-obj] {width:50px; height:30px;}
    </style>
    ```
    
    *@* *+prefix* *x* *@* 
    ```html
    <link rel="stylesheet" href="/boxman/boxman.css">
    <script src="../crossman/crossman.js"></script>
    <script src="../boxman/boxman.js"></script>
    <script>
        var boxman = new BoxMan();
    </script>
  
    <style>
        div[data-box] {width:200px; min-height:30px;}
        div[data-obj] {width:50px; height:30px;}
    </style>
    ```
    
   

## addConditionWithBox(fromBox, toBox, options) 
- 특정BOX에 특정`BOX`간의 조건을 설정할 수 있습니다.
    *@* *!* *@*
    ```html
    <script>
        var boxman = new BoxMan().detect(function(boxman){
            boxman.addConditionWithBox('boxToHome', ['result-dev-search-all', 'boxToShortcut*'], {appendType:BoxMan.APPEND_TYPE_OVERWRITE});
            boxman.addConditionWithBox('boxToShortcut*', ['result-dev-search-all', 'boxToHome'], {appendType:BoxMan.APPEND_TYPE_OVERWRITE});
            boxman.addConditionWithBox('boxToShortcut*', 'boxToShortcut*', {appendType:BoxMan.APPEND_TYPE_SWAP});
            boxman.addConditionWithBox('div-quiz-answer', 'div-quiz-selector', {appendType:BoxMan.APPEND_TYPE_OVERWRITE});
        });     
    </script>
        
    <body>
        <div data-box data-limit="1">Box A</div>
        <div data-box data-limit="2">Box B</div>
        <div data-box>Box C</div>
        <div data-obj style="width:50px; height:30px;">Obj A</div>
        <div data-obj style="width:50px; height:30px;">Obj B</div>
        <div data-obj style="width:50px; height:30px;">Obj C</div>
    </body>
    ```



## addConditionWithObj(fromBox, toBox, options)
- 특정BOX에 특정`OBJ`와의 조건을 설정할 수 있습니다.
    *@* *!* *@*
    ```html
    <script>
        var boxman = new BoxMan().detect(function(boxman){
            boxman.addConditionWithBox('boxToHome', ['result-dev-search-all', 'boxToShortcut*'], {appendType:BoxMan.APPEND_TYPE_OVERWRITE});
            boxman.addConditionWithBox('boxToShortcut*', ['result-dev-search-all', 'boxToHome'], {appendType:BoxMan.APPEND_TYPE_OVERWRITE});
            boxman.addConditionWithBox('boxToShortcut*', 'boxToShortcut*', {appendType:BoxMan.APPEND_TYPE_SWAP});
            boxman.addConditionWithBox('div-quiz-answer', 'div-quiz-selector', {appendType:BoxMan.APPEND_TYPE_OVERWRITE});
        });     
    </script>
        
    <body>
        <div data-box data-limit="1">Box A</div>
        <div data-box data-limit="2">Box B</div>
        <div data-box>Box C</div>
        <div data-obj style="width:50px; height:30px;">Obj A</div>
        <div data-obj style="width:50px; height:30px;">Obj B</div>
        <div data-obj style="width:50px; height:30px;">Obj C</div>
    </body>
    ```
    
    
## setBoxMode(box, mode)
- 특정BOX에 특정`OBJ`와의 조건을 설정할 수 있습니다.
    *@* *!* *@*
    ```html
    <script>
        var boxman = new BoxMan().detect(function(boxman){
            boxman.setBoxMode('result-dev-search-*', {modeRemoveOutOfBox:false, modeCopy:true});
        });     
    </script>
        
    <body>
        <div data-box data-limit="1">Box A</div>
        <div data-box data-limit="2">Box B</div>
        <div data-box>Box C</div>
        <div data-obj style="width:50px; height:30px;">Obj A</div>
        <div data-obj style="width:50px; height:30px;">Obj B</div>
        <div data-obj style="width:50px; height:30px;">Obj C</div>
    </body>
    ```