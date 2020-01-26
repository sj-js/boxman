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



## limit
- 박스에 들어갈 수 있는 객체의 수를 제한 할 수 있습니다.
    *@* *!* *@*
    ```html
    <script>
        boxman.detect(function(boxman){
            boxman.newBox({id:'boxA', content:'Box A', limit:1});
            boxman.newBox({id:'boxB', content:'Box B', limit:2});
            boxman.newBox({id:'boxC', content:'Box C'});
            boxman.newBox({id:'boxD', content:'Box D'});
          
            boxman.newObj({id:'objA', content:'A'});
            boxman.newObj({id:'objB', content:'B'});
            boxman.newObj({id:'objC', content:'C'});
            boxman.newObj({id:'objD', content:'D'});
     
        });
    </script>
    <body>
    </body>
    ```

    *@* *!* *@*
    ```html
    <script>
        boxman.detect();     
    </script>
    <body>
        <div data-box data-limit="1">Box A</div>
        <div data-box data-limit="2">Box B</div>
        <div data-box>Box C</div>
        <div data-box>Box D</div>
        
        <div data-obj>A</div>
        <div data-obj>B</div>
        <div data-obj>C</div>
        <div data-obj>D</div>
    </body>
    ```
    
    

## acceptbox
- 특정 BOX로부터의 OBJ만 받아들입니다.
    *@* *!* *@*
    ```html
    <script>
        boxman.detect(function(boxman){
            boxman.newBox({id:'boxA', content:'Box A'});
            boxman.newBox({id:'boxB', content:'Box B'});
            boxman.newBox({id:'boxC', content:'Box C'});
            boxman.newBox({id:'boxD', content:'Box D'});
          
            boxman.newObj({id:'objA', content:'A'});
            boxman.newObj({id:'objB', content:'B'});
            boxman.newObj({id:'objC', content:'C'});
            boxman.newObj({id:'objD', content:'D'});
    
            boxman.addAcceptBox('boxA', ['boxB', 'boxC']);
            boxman.addAcceptBox('boxB', 'boxC');
            boxman.addAcceptBox('boxC', 'boxD');
        });
    </script>
    <body>
    </body>
    ```
  
    *@* *!* *@*
    ```html
    <script>
        boxman.detect();     
    </script>
    <body>
        <div id="boxA" data-box data-accept-box="boxB boxC">Box A</div>
        <div id="boxB" data-box data-accept-box="boxC">Box B</div>
        <div id="boxC" data-box data-accept-box="boxD">Box C</div>
        <div id="boxD" data-box >Box D</div>
        
        <div id="objA" data-obj>A</div>
        <div id="objB" data-obj>B</div>
        <div id="objC" data-obj>C</div>
        <div id="objD" data-obj>D</div>
    </body>
    ```  
    
    
  
## acceptobj
- 특정 OBJ만 받아들입니다.
    *@* *!* *@*
    ```html
    <script>
        boxman.detect(function(boxman){
            boxman.newBox({id:'boxA', content:'Box A'});
            boxman.newBox({id:'boxB', content:'Box B'});
            boxman.newBox({id:'boxC', content:'Box C'});
            boxman.newBox({id:'boxD', content:'Box D'});
          
            boxman.newObj({id:'objA', content:'A'});
            boxman.newObj({id:'objB', content:'B'});
            boxman.newObj({id:'objC', content:'C'});
            boxman.newObj({id:'objD', content:'D'});
      
            boxman.addAcceptObj('boxA', ['objA', 'objB']);
            boxman.addAcceptObj('boxB', 'objC');
            boxman.addAcceptObj('boxC', 'objD');
        });
    </script>
    <body>
    </body>
    ```
  
    *@* *!* *@*
    ```html
    <script>
        boxman.detect();     
    </script>
    <body>
        <div id="boxA" data-box data-accept-obj="objA objB">Box A</div>
        <div id="boxB" data-box data-accept-obj="objC">Box B</div>
        <div id="boxC" data-box data-accept-obj="objD">Box C</div>
        <div id="boxD" data-box>Box D</div>
        
        <div id="objA" data-obj>A</div>
        <div id="objB" data-obj>B</div>
        <div id="objC" data-obj>C</div>
        <div id="objD" data-obj>D</div>
    </body>
    ```
    
    

## rejectbox
- 특정 BOX로부터 들어오려는 OBJ를 거부합니다.
    *@* *!* *@*
    ```html
    <script>
        boxman.detect(function(boxman){
            boxman.newBox({id:'boxA', content:'Box A'});
            boxman.newBox({id:'boxB', content:'Box B'});
            boxman.newBox({id:'boxC', content:'Box C'});
            boxman.newBox({id:'boxD', content:'Box D'});
          
            boxman.newObj({id:'objA', content:'A'});
            boxman.newObj({id:'objB', content:'B'});
            boxman.newObj({id:'objC', content:'C'});
            boxman.newObj({id:'objD', content:'D'});
          
            boxman.addRejectBox('boxA', ['boxB', 'boxC']);
            boxman.addRejectBox('boxB', 'boxC');
            boxman.addRejectBox('boxC', 'boxD');
        });
    </script>
    <body>
    </body>
    ```

    *@* *!* *@*
    ```html
    <script>
        boxman.detect();     
    </script>
    <body>
        <div data-box id="boxA" data-reject-box="boxB boxC">Box A</div>
        <div data-box id="boxB" data-reject-box="boxC">Box B</div>
        <div data-box id="boxC" data-reject-box="boxD">Box C</div>
        <div data-box id="boxD">Box D</div>
        
        <div id="objA" data-obj>A</div>
        <div id="objB" data-obj>B</div>
        <div id="objC" data-obj>C</div>
        <div id="objD" data-obj>D</div>
    </body>
    ```
    
    

## rejectobj
- 특정 OBJ를 거부합니다.
    *@* *!* *@*
    ```html
    <script>
        boxman.detect(function(boxman){
            boxman.newBox({id:'boxA', content:'Box A'});
            boxman.newBox({id:'boxB', content:'Box B'});
            boxman.newBox({id:'boxC', content:'Box C'});
            boxman.newBox({id:'boxD', content:'Box D'});
          
            boxman.newObj({id:'objA', content:'A'});
            boxman.newObj({id:'objB', content:'B'});
            boxman.newObj({id:'objC', content:'C'});
            boxman.newObj({id:'objD', content:'D'});
          
            boxman.addRejectObj('boxA', ['objA', 'objB']);
            boxman.addRejectObj('boxB', 'objC');
            boxman.addRejectObj('boxC', 'objD');
        });
    </script>
    <body>
    </body>
    ```

    *@* *!* *@*
    ```html
    <script>
        boxman.detect();     
    </script>
    <body>
        <div data-box id="boxA" data-reject-obj="objA objB">Box A</div>
        <div data-box id="boxB" data-reject-obj="objC">Box B</div>
        <div data-box id="boxC" data-reject-obj="objD">Box C</div>
        <div data-box id="boxD">Box D</div>
        
        <div id="objA" data-obj>A</div>
        <div id="objB" data-obj>B</div>
        <div id="objC" data-obj>C</div>
        <div id="objD" data-obj>D</div>
    </body>
    ```
