# BoxMan
## 📦
[![Build Status](https://travis-ci.org/sj-js/boxman.svg?branch=master)](https://travis-ci.org/sj-js/boxman)
[![All Download](https://img.shields.io/github/downloads/sj-js/boxman/total.svg)](https://github.com/sj-js/boxman/releases)
[![Release](https://img.shields.io/github/release/sj-js/boxman.svg)](https://github.com/sj-js/boxman/releases)
[![License](https://img.shields.io/github/license/sj-js/boxman.svg)](https://github.com/sj-js/boxman/releases)

- HTML DOM객체를 자유롭게 이동시키거나 특정 영역(Box)으로 옮길 수 있습니다.
- Source: https://github.com/sj-js/boxman
- Document: https://sj-js.github.io/sj-js/boxman
    
      
        
## Index
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

### 1-1. How to use?

1. 라이브러리 불러오기
    - Browser
        ```html
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sj-js/boxman/dist/css/boxman.css">
        <script src="https://cdn.jsdelivr.net/gh/sj-js/crossman/dist/js/crossman.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/sj-js/boxman/dist/js/boxman.js"></script>
        <script>
             var boxman = new BoxMan();
        </script>
        ```  
    - ES6+
        ```bash
        npm i @sj-js/boxman
        ```
        ```js
        const BoxMan = require('@sj-js/boxman');
        const boxman = new BoxMan();
        ```




### 1-2. Simple Example
- For convenience, the following code, which loads and creates a Library in the example, is omitted.
    ```html
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sj-js/boxman/dist/css/boxman.css">
    <script src="https://cdn.jsdelivr.net/gh/sj-js/crossman/dist/js/crossman.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/sj-js/boxman/dist/js/boxman.js"></script>
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


##### Example with script          
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


##### Example with template
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
  