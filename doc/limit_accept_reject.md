# Limit, Accept, Reject
이동을 `제한`합니다.

#### ※ 표
종류 | 특징 
-----|------
limit | 박스에 들어올 수 있는 Obj의 수를 제한합니다.
acceptbox | 특정 박스로부터 옴겨온 Obj만 이동을 허용하도록 지정합니다.
rejectbox | 특정 박스로부터 옴겨온 Obj를 이동을 거부하도록 지정합니다.
acceptobj | 특정 Obj만 이동을 허용하도록 지정합니다.
rejectobj | 특정 Obj를 이동을 거부하도록 지정합니다.

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


## limit
- 박스에 들어갈 수 있는 객체의 수를 제한 할 수 있습니다.
    *@* *!* *@*
    ```html
    <script>
        var boxman = new BoxMan().detect();     
    </script>
    <body>
        <div data-box data-limit="1">Box A</div>
        <div data-box data-limit="2">Box B</div>
        <div data-box>Box C</div>
        
        <div data-obj>Obj A</div>
        <div data-obj>Obj B</div>
        <div data-obj>Obj C</div>
    </body>
    ```



## acceptbox
- 특정 BOX로부터의 OBJ만 받아들입니다.
    *@* *!* *@*
    ```html
    <script>
        var boxman = new BoxMan().detect();     
    </script>
    <body>
        <div data-box id="boxA" data-accept-box="boxB boxC">Box A</div>
        <div data-box id="boxB" data-accept-box="boxC">Box B</div>
        <div data-box id="boxC" data-accept-box="boxD">Box C</div>
        <div data-box id="boxD" >Box D</div>
        
        <div data-obj>Obj A</div>
        <div data-obj>Obj B</div>
        <div data-obj>Obj C</div>
    </body>
    ```
  
  
  
## acceptobj
- 특정 OBJ만 받아들입니다.
    *@* *!* *@*
    ```html
    <script>
        var boxman = new BoxMan().detect();     
    </script>
    <body>
        <div data-box id="boxA" data-accept-obj="objA objB">Box A</div>
        <div data-box id="boxB" data-accept-obj="objC">Box B</div>
        <div data-box id="boxC" data-accept-obj="objD">Box C</div>
        <div data-box id="boxD" >Box D</div>
        
        <div data-obj id="objA">Obj A</div>
        <div data-obj id="objB">Obj B</div>
        <div data-obj id="objC">Obj C</div>
        <div data-obj id="objD">Obj D</div>
    </body>
    ```
  


## rejectbox
- 특정 BOX로부터 들어오려는 OBJ를 거부합니다.
    *@* *!* *@*
    ```html
    <script>
        var boxman = new BoxMan().detect();     
    </script>
    <body>
        <div data-box id="boxA" data-reject-box="boxB boxC">Box A</div>
        <div data-box id="boxB" data-reject-box="boxC">Box B</div>
        <div data-box id="boxC" data-reject-box="boxD">Box C</div>
        <div data-box id="boxD" >Box D</div>
        
        <div data-obj>Obj A</div>
        <div data-obj>Obj B</div>
        <div data-obj>Obj C</div>
    </body>
    ```


## rejectobj
- 특정 OBJ를 거부합니다.
    *@* *!* *@*
    ```html
    <script>
        var boxman = new BoxMan().detect();     
    </script>
    <body>
        <div data-box id="boxA" data-reject-obj="objA objB">Box A</div>
        <div data-box id="boxB" data-reject-obj="objC">Box B</div>
        <div data-box id="boxC" data-reject-obj="objD">Box C</div>
        <div data-box id="boxD" >Box D</div>
        
        <div data-obj id="objA">Obj A</div>
        <div data-obj id="objB">Obj B</div>
        <div data-obj id="objC">Obj C</div>
        <div data-obj id="objD">Obj D</div>
    </body>
    ```

