# Condition
`조건에 따라 옵션`을 다르게 설정 할 수 있습니다. 
   
#### ※ 자동적용
- 편의를 위해서 예제에서는 다음 코드가 생략되어 있습니다.
    ```html
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sj-js/boxman/dist/css/boxman.css">
    <script src="https://cdn.jsdelivr.net/npm/sj-js/crossman/dist/js/crossman.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sj-js/boxman/dist/js/boxman.js"></script>
    <script>
        var boxman = new BoxMan().setTheme('test-1');
    </script>
    ```
    
    *@* *+prefix* *x* *@* 
    ```html
    <link rel="stylesheet" href="../boxman/boxman.css">
    <script src="../crossman/crossman.js"></script>
    <script src="../boxman/boxman.js"></script>
    <script> 
        var boxman = new BoxMan().setTheme('test-1');
    </script>
    ```
    
   

## addConditionWithBox(fromBox, toBox, options) 
- 특정 BOX에 특정`BOX`간의 조건을 설정할 수 있습니다.
    *@* *!* *@*
    ```html
    <script>
        boxman.detect(function(boxman){
            boxman.addConditionWithBox('item-bag', ['item-opt-*', 'item-bag'], {appendType:BoxMan.APPEND_TYPE_LAST});
            boxman.addConditionWithBox('item-opt-*', '*', {appendType:BoxMan.APPEND_TYPE_SWAP});          
            boxman.addConditionWithBox('clone-machine', '*', {modeCopy:true});
            boxman.addConditionWithBox('trash-bin', '*', {appendType:BoxMan.APPEND_TYPE_INVISIBLE});
            boxman.addEventListener('trash-bin', 'beforeboxin', function(event){
                if (confirm('Do you want to delete?')){
                    boxman.delObj(event.obj);
                    return true;
                }else{
                    return false; 
                }
            });              
        }); 
    </script>

    <style>
        div[data-box] { width:50px; height:50px; display:inline-block; vertical-align:top; }
        div[data-obj] { width:40px; height:40px; display:inline-block; vertical-align:top; }
    </style>
    
    <body>
        <div id="item-opt-1" data-box data-limit="1"></div>
        <div id="item-opt-2" data-box></div>
        <div id="item-opt-3" data-box></div>
        <div id="item-opt-4" data-box></div>
        <div id="item-opt-5" data-box></div>
        <div id="clone-machine" data-box data-limit="1" style="background:#99ffaa;"></div>
        <div id="trash-bin" data-box style="background:#ff99aa;"></div>
        <br/>
        
        <div id="item-bag" data-box style="width:300px; min-height:100px;">
            <div data-obj>A</div>
            <div data-obj>B</div>
            <div data-obj>C</div>
            <div data-obj>D</div>
            <div data-obj>E</div>
            <div data-obj>F</div>
        </div>
        
        <button onclick="boxman.newObj({parent:'item-bag'})">NEW</button>
    </body>
    ```



## addConditionWithObj(fromBox, toBox, options)
- 특정 BOX에 특정`OBJ`와의 조건을 설정할 수 있습니다.
    *@* *!* *@*
    ```html
  <script>
      boxman.detect(function(boxman){              
          boxman.addConditionWithObj('*ox*', 'item-b', {appendType:BoxMan.APPEND_TYPE_SWAP});            
          boxman.addConditionWithObj('b*', 'item-c', {modeCopy:true});
          boxman.addConditionWithObj('bo*', 'item-d', {appendType:BoxMan.APPEND_TYPE_OVERWRITE});
      });     
  </script>
  
  <style>
    div[data-box] { display:inline-block; vertical-align:top; min-height:150px; } 
  </style>

  <body>
      <div id="box-a" data-box data-limit="1"></div>
      <div id="box-b" data-box data-limit="2"></div>
      <div id="box-c" data-box>
          <div id="item-a" data-obj>NORMAL</div>
          <div id="item-b" data-obj>SWAPER</div>
          <div id="item-c" data-obj>COPIER</div>  
          <div id="item-d" data-obj>OVERWRITER</div>            
      </div>        
      <button onclick="boxman.newObj({parent:'box-c'})">NEW</button>
  </body>
    ```
    
    
    
## setBoxMode(box, mode)
- 특정 BOX에게만 `특정설정`을 할 수 있습니다. 
    *@* *!* *@*
    ```html
    <script>
        boxman.detect(function(boxman){
            boxman.setBoxMode('box-a', {modeCopy: true});
            boxman.setBoxMode('box-b', {modeRemoveOutOfBox: true});
            boxman.setBoxMode('box-c', {appendType: BoxMan.APPEND_TYPE_BETWEEN});
        });     
    </script>
        
    <body>
        <div id="box-a" data-box></div>
        <div id="box-b" data-box></div>
        <div id="box-c" data-box>
            <div id="item-a" data-obj>A</div>
            <div id="item-b" data-obj>B</div>
            <div id="item-c" data-obj>C</div>  
            <div id="item-d" data-obj>D</div>            
        </div>        
        <button onclick="boxman.newObj({parent:'box-c'})">NEW</button>
    </body>
    ```