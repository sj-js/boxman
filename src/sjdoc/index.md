# BoxMan
## 📦
[![Build Status](https://travis-ci.org/sj-js/boxman.svg?branch=master)](https://travis-ci.org/sj-js/boxman)
[![All Download](https://img.shields.io/github/downloads/sj-js/boxman/total.svg)](https://github.com/sj-js/boxman/releases)
[![Release](https://img.shields.io/github/release/sj-js/boxman.svg)](https://github.com/sj-js/boxman/releases)
[![License](https://img.shields.io/github/license/sj-js/boxman.svg)](https://github.com/sj-js/boxman/releases)

- HTML DOM객체를 자유롭게 이동시키거나 특정 영역(Box)으로 옮길 수 있습니다.
- Drag & Drop할 수 있는 `OBJ` **Element**와 이를 담을 수 있는 `BOX` **Element**로 나뉩니다.
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

### 1-1. How to load?
- Browser
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
- ES6+
    ```bash
    npm i @sj-js/boxman
    ```
    ```js
    require('@sj-js/boxman/dist/css/boxman.css');
    const BoxMan = require('@sj-js/boxman');
    const boxman = new BoxMan();
    ```




### 1-2. Simple Example
For convenience, 1-1 code, which loads and creates a Library in the example, is omitted.  

##### Example - with script
1. BOX 생성
    ```js
    boxman.newBox({content:'BOX', width:'100px', minHeight:'35px'});
    ```
2. OBJ 생성
    ```js
    boxman.newObj({content:'OBJ', width:'50px', height:'30px'});
    ```
3. 👨‍💻
    *@* *!* *@*
    ```html
    <style>
        div[data-obj] { display:inline-block; }
        div[data-box].test-a { background:pink; border:1px solid black; min-width:200px; min-height:30px;}
        div[data-obj].test-a { background:deeppink; border:1px solid black; min-width:50px; min-height:30px;}
    </style>
    <body>
        Hello Boxman
    </body>
    <script>        
        boxman.setTheme('default');
        boxman.newBox({content:'BOX A', class:'test-a'});
        boxman.newBox({content:'BOX B'});
        boxman.newObj({content:'A'});
        boxman.newObj({content:'B'});
        boxman.newObj({content:'C', class:'test-a'});
        boxman.newObj({content:'G', class:'test-a'});
    </script>
    ```

##### Example - with template
1. BOX Element에 `data-box`를 명시
    ```html
    <div data-box>BOX A</div>
    ```
2. OBJ Element에 `data-obj`를 명시
    ```html
    <div data-obj>OBJ A</div>
    ``` 
3. Script에서 `detect()`를 사용합니다.
    ```js
    boxman.detect();
    ```
4. 👨‍💻
    *@* *!* *@*
    ```html
    <style>
        div[data-box].test-a { background:pink; border:1px solid black; }
        div[data-obj].test-a { background:deeppink; border:1px solid black; }
    </style>
    <script>
        boxman.detect();     
    </script>
    <body>
        Hello BoxMan! (Template)
        <div data-box data-theme="default" style="width:200px; min-height:30px;">BOX A</div>
        <div data-box class="test-a" style="width:200px; min-height:30px;">BOX B</div>
        <div data-obj class="test-a" style="width:50px; height:30px;">A</div>  
        <div data-obj class="test-a" style="width:50px; height:30px;">B</div>  
        <div data-obj class="test-a" style="width:50px; height:30px;">C</div>    
    </body>
    ```
  