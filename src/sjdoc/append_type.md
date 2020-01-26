# Append Type
OBJ의 `이동방식`을 설정합니다.

#### ※ 표
종류 | 특징 
-----|------
**BoxMan.APPEND_TYPE_LAST** | (기본 설정) 가장 마지막 노드로 위치합니다. 
BoxMan.APPEND_TYPE_FIRST | 가장 첫번째 노드로 위치합니다.
BoxMan.APPEND_TYPE_BETWEEN | 노드와 노드 사이에 위차합니다. 
BoxMan.APPEND_TYPE_OVERWRITE | 박스안에 있는 기존의 노드들을 전부 제거하고
BoxMan.APPEND_TYPE_SWAP | 이전 박스와 노드를 교환합니다.
BoxMan.APPEND_TYPE_INVISIBLE | 옴겨지지 않고 노드를 바로 제거합니다.
 
#### ※ 자동적용
- 편의를 위해서 예제에서는 다음 코드가 생략되어 있습니다.
    ```html
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@sj-js/boxman/dist/css/boxman.css">
    <script src="https://cdn.jsdelivr.net/npm/@sj-js/crossman/dist/js/crossman.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@sj-js/boxman/dist/js/boxman.js"></script>
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



## BoxMan.APPEND_TYPE_LAST
- BOX안 OBJ중 가장 뒤쪽에 이동시킵니다.
    *@* *!* *@*
    ```html
    <script>
        boxman.setup({appendType:BoxMan.APPEND_TYPE_LAST}).detect();     
    </script>
    
    <body>
        <div data-box>Box A</div>
        <div data-box>Box B</div>
        <div data-box>Box C</div>
        
        <div data-obj style="width:50px; height:30px;">Obj A</div>
        <div data-obj style="width:50px; height:30px;">Obj B</div>
        <div data-obj style="width:50px; height:30px;">Obj C</div>
    </body>
    ```
  
## BoxMan.APPEND_TYPE_FIRST
- BOX안 OBJ중 가장 앞으로 이동시킵니다.
    *@* *!* *@*
    ```html
    <script>
        boxman.setup({appendType:BoxMan.APPEND_TYPE_FIRST}).detect();     
    </script>
    
    <body>
        <div data-box>Box A</div>
        <div data-box>Box B</div>
        <div data-box>Box C</div>
        
        <div data-obj>Obj A</div>
        <div data-obj>Obj B</div>
        <div data-obj>Obj C</div>
    </body>
    ```

## BoxMan.APPEND_TYPE_BETWEEN
- 현재 마우스포인터가 위치한 OBJ의 위치에 끼어듭니다.
    *@* *!* *@*
    ```html
    <script>
        boxman.setup({appendType:BoxMan.APPEND_TYPE_BETWEEN}).detect();     
    </script>
    
    <body>
        <div data-box>Box A</div>
        <div data-box>Box B</div>
        <div data-box>Box C</div>
        
        <div data-obj>Obj A</div>
        <div data-obj>Obj B</div>
        <div data-obj>Obj C</div>
    </body>
    ```

## BoxMan.APPEND_TYPE_OVERWRITE
- BOX안 기존 OBJ를 지우고 이동시킵니다.
    *@* *!* *@*
    ```html
    <script>
        boxman.setup({appendType:BoxMan.APPEND_TYPE_OVERWRITE}).detect();     
    </script>
    
    <body>
        <div data-box>Box A</div>
        <div data-box>Box B</div>
        <div data-box>Box C</div>
        
        <div data-obj>Obj A</div>
        <div data-obj>Obj B</div>
        <div data-obj>Obj C</div>
    </body>
    ```


## BoxMan.APPEND_TYPE_SWAP
- 현재 OBJ가 들어가있는 BOX와 이동할 BOX의 OBJ를 맞바꿉니다. 
    *@* *!* *@*
    ```html
    <script>
        boxman.setup({appendType:BoxMan.APPEND_TYPE_SWAP}).detect();     
    </script>
    
    <body>
        <div data-box>Box A</div>
        <div data-box>Box B</div>
        <div data-box>Box C</div>
        
        <div data-obj>Obj A</div>
        <div data-obj>Obj B</div>
        <div data-obj>Obj C</div>
    </body>
    ```


## BoxMan.APPEND_TYPE_INVISIBLE 
- OBJ이동시 미리보기를 하지 않습니다.
    *@* *!* *@*
    ```html
    <script>
        boxman.setup({appendType:BoxMan.APPEND_TYPE_INVISIBLE}).detect();     
    </script>
    
    <body>
        <div data-box>Box A</div>
        <div data-box>Box B</div>
        <div data-box>Box C</div>
        
        <div data-obj>Obj A</div>
        <div data-obj>Obj B</div>
        <div data-obj>Obj C</div>
    </body>
    ```