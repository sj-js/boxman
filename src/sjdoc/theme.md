# Theme
각종 CSS 테마  
        
#### ※ 표
코드 | 특징
-----|--------|-----
default | 기본 테마
test-1 | 테스트 테마1
test-1 | 테스트 테마2

#### ※ 자동적용
- 편의를 위해서 예제에서는 다음 코드가 생략되어 있습니다.
    ```html
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@sj-js/boxman/dist/css/boxman.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@sj-js/crossman/dist/js/crossman.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@sj-js/boxman/dist/js/boxman.min.js"></script>
    <script>
        var boxman = new BoxMan();
    </script>
    ```
    
    *@* *+prefix* *x* *@* 
    ```html
    <link rel="stylesheet" href="../boxman/boxman.css">
    <script src="../crossman/crossman.js"></script>
    <script src="../boxman/boxman.js"></script>
    <script> 
        var boxman = new BoxMan();
    </script>
    ```
  
  

## .setTheme('THEME_NAME')
- Theme
    *@* *!* *@*
    ```html
    <script>
        boxman.setTheme('default').detect();     
    </script>
    
    <body>
        <div data-box>Box A</div>
        <div data-box>Box B</div>
        <div data-obj>A</div>
        <div data-obj>B</div>
        <div data-obj>C</div>
        <div data-obj>D</div>
        <div data-obj>E</div>
    </body>
    ```
  
## Custom theme
제공하는 테마를 사용하기 보다는 상황에 맞는 테마를 직접 만들거나 Style을 만든는 것을 권합니다.  
- make your theme
    *@* *!* *@*
    ```html
    <style>
        div[data-box][data-theme=custom-1] { display:inline-block; background:#77ccee; border:2px solid #AAAAAA; border-radius:15px; width:150px; min-height:80px; vertical-align:top; }
        div[data-obj][data-theme=custom-1] { display:inline-block; background:#aa99bb; border:2px solid #EEEEEE; border-radius:15px; width:30px; height:30px; vertical-align:top; }
            
        div[data-box][data-theme=custom-2] { display:inline-block; background:#FFFFFF; border:2px solid #3F7F5F; border-radius:5px; width:150px; min-height:80px; vertical-align:top; }
        div[data-obj][data-theme=custom-2] { display:inline-block; background:#FFFFFF; border:2px solid #665856; border-radius:5px; width:30px; height:30px; vertical-align:top; }
    </style>
    <script>
        boxman.setTheme('custom-1').setup({appendType:BoxMan.APPEND_TYPE_BETWEEN}).detect();
    </script>
    
    <body>
        <div data-box>Box A</div>
        <div data-box>Box B</div>        
        <div data-obj>A</div>
        <div data-obj>B</div>
        <div data-obj>C</div>
        <div data-obj>D</div>
        <div data-obj>E</div>
    </body>
    ```  