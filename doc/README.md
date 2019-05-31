# BoxMan
- BoxMan을 사용하면 HTML DOM객체를 자유롭게 이동시키거나 특정 영역(Box)에 옮길 수 있습니다.

    [![Build Status](https://travis-ci.org/sj-js/boxman.svg?branch=master)](https://travis-ci.org/sj-js/boxman)
    [![All Download](https://img.shields.io/github/downloads/sj-js/boxman/total.svg)](https://github.com/sj-js/boxman/releases)
    [![Release](https://img.shields.io/github/release/sj-js/boxman.svg)](https://github.com/sj-js/boxman/releases)
    [![License](https://img.shields.io/github/license/sj-js/boxman.svg)](https://github.com/sj-js/boxman/releases)

    https://github.com/sj-js/boxman
    
      
        
## 0. Index
*@* **order** *@*
```
- BoxMan
- Mode
- Append Type
- Limit, Accept, Reject
- Condition
- Event
- Functions
- Theme
- Example
```


## 1. Getting Started

### 1-1. Load Script

1. 스크립트 불러오기
    ```html
    <link rel="stylesheet" href="https://rawgit.com/sj-js/boxman/master/dist/css/boxman.css">
    <script src="https://rawgit.com/sj-js/crossman/master/dist/js/crossman.js"></script>
    <script src="https://rawgit.com/sj-js/boxman/master/dist/js/boxman.js"></script>
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



### 1-2. Script

1. Box 생성
    ```js
    boxman.newBox({content:'BOX', width:'100px', minHeight:'35px'});
    ```

2. Obj 생성
    ```js
    boxman.newObj({content:'OBJ', width:'50px', height:'30px'});
    ```

3. Test
    *@* *!* *@*
    ```html
    <body>
        Hello Boxman
    </body>
    <script>        
        boxman.newBox({content:'BOX A', width:'200px', minHeight:'30px'});
        boxman.newBox({content:'BOX B', width:'200px', minHeight:'30px'});
        boxman.newObj({content:'OBJ A', width:'50px', height:'30px'});
        boxman.newObj({content:'OBJ B', width:'50px', height:'30px'});
        boxman.newObj({content:'OBJ C', width:'50px', height:'30px'});
        boxman.newObj({content:'OBJ D', width:'50px', height:'30px'});
        boxman.newObj({content:'OBJ E', width:'50px', height:'30px'});
        boxman.newObj({content:'OBJ F', width:'50px', height:'30px'});
        boxman.newObj({content:'OBJ G', width:'50px', height:'30px'});
    </script>
    ```



### 1-3. Template          
detect 기능을 이용하여 미리 작성한 HTML에 적용할 수 있습니다.

1. Element에 다음 속성을 명시합니다.
    - `data-box`
    - `data-obj` 

2. `detect()`를 사용합니다.
    ```js
    boxman.detect();
    ```

2. Test
    *@* *!* *@*
    ```html
    <script>
         boxman.detect();     
    </script>
    <body>
        <div data-box style="width:200px; min-height:30px;">BOX A</div>
        <div data-box style="width:200px; min-height:30px;">BOX B</div>
        <div data-obj style="width:50px; height:30px;">OBJ A</div>    
    </body>
    ```
  