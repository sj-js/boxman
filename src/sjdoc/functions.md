# Functions
`여러 기능`들을 소개해드립니다.

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



## clearBox(box)
-  BOX안의 모든 Node를 지웁니다. (OBJ가 소멸되지는 않습니다.)
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
  
## ready

## delObj(obj)
## delBox(box)

## getBox(box)
## getObj(obj)
## getExBox(exbox)
## getObjListByBox(box)
## getObjsByBox(box)

## sortObjInBox(box, orderList)