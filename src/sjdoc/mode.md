# Mode
Mode 속성으로 `특정효과`를 설정할 수 있습니다.

#### ※ 표
종류 | 기본값 | 특징
-----|--------|-----
modeTest | false | Box와 Obj 노드에 Border Style을 적용하여 육안으로 노드의 크기를 확인 가능하도록 합니다.  
modeCopy | false | Obj 노드가 이동되지 않고 복사됩니다.
modeOnlyBoxToBox | true | Box와 Box간의 이동만 허용합니다.
modeRemoveOutOfBox | false | Box 밖으로 이동할 시에는 Obj 노드는 삭제합니다.

#### ※ 자동적용
- 편의를 위해서 예제에서는 다음 코드가 생략되어 있습니다.
    ```html
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@sj-js/boxman/dist/css/boxman.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@sj-js/crossman/dist/js/crossman.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@sj-js/boxman/dist/js/boxman.min.js"></script>
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



## modeTest
- 테스트시, 눈에 띄는 스타일로 표시할 수 있습니다. 
    *@* *!* *@*
    ```html
    <script>
        boxman.setup({modeTest: true}).detect();     
    </script>
    
    <body>
        <div data-box>BOX A</div>
        <div data-box>
            BOX B
            <div data-obj>OBJ A</div>
        </div>
    </body>
    ```
  
  추가 속성 
- testBoxClass: 테스트모드시, Box에 부여할 class
- testBoxBorderWidth: 테스트모드시, Box의 테두리 크기
- testBoxBorderColor: 테스트모드시, Box의 테두리 색
- testObjClass: 테스트모드시, Obj에 부여할class
- testObjBorderWidth: 테스트모드시, Obj의 테두리 크기
- testObjBorderColor: 테스트모드시, Obj의 테두리 색
        
  
  
## modeCopy
- OBJ를 다른 BOX로 옴길 때마다 복사됩니다.
    *@* *!* *@*
    ```html
    <script>
        boxman.setup({modeCopy: true}).detect();     
    </script>
    
    <body>
        <div data-box id="box">BOX A</div>
        <div data-box>
            BOX B
            <div data-obj>OBJ A</div>
        </div>
    </body>
    ```


## modeOnlyBoxToBox
- OBJ는 BOX 이외에는 이동할 수 없도록 합니다.
    *@* *!* *@*
    ```html
    <script>
        boxman.setup({modeOnlyBoxToBox: true}).detect();     
    </script>
    
    <body>
        <div data-box id="box">BOX A</div>
        <div data-box>BOX B</div>
        <div data-box>
            BOX C
            <div data-obj>OBJ A</div>
        </div>
    </body>
    ```

    *@* *!* *@*
    ```html
    <script>
        boxman.setup({modeOnlyBoxToBox: false, defaultBox: document.body, modeDefaultAbsolute:true}).detect();     
    </script>
    
    <body>
        <div data-box id="box">BOX A</div>
        <div data-box>BOX B</div>
        <div data-box>
            BOX C
            <div data-obj>OBJ A</div>
        </div>
    </body>
    ```
    
    - `defaultBox`: modeOnlyBoxToBox가 false일 때, 이 옵션값에 따라 원하는 Element로 설정할 수 있다. (Default: `document.body`)
    - `modeDefaultAbsolute`: Style속성인 position의 값을 absolute로 할 것인지를 설정한다.  (Default: `true`)

## modeRemoveOutOfBox
- OBJ를 박스 밖으로 보내면 삭제됩니다.
    *@* *!* *@*
    ```html
    <script>
        boxman.setup({modeRemoveOutOfBox: true}).detect();     
    </script>
    
    <body>
        <div data-box id="box">BOX A</div>
        <div data-box>
            BOX B
            <div data-obj>OBJ A</div>
        </div>    
    </body>
    ```
