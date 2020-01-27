# BoxMan
## 📦
[![Build Status](https://travis-ci.org/sj-js/boxman.svg?branch=master)](https://travis-ci.org/sj-js/boxman)
[![All Download](https://img.shields.io/github/downloads/sj-js/boxman/total.svg)](https://github.com/sj-js/boxman/releases)
[![Release](https://img.shields.io/github/release/sj-js/boxman.svg)](https://github.com/sj-js/boxman/releases)
[![License](https://img.shields.io/github/license/sj-js/boxman.svg)](https://github.com/sj-js/boxman/releases)

- HTML DOM객체를 자유롭게 이동시키거나 특정 영역(Box)으로 옮길 수 있습니다.
- Drag & Drop할 수 있는 `OBJ` **Element**와 이를 담을 수 있는 `BOX` **Element**로 나뉩니다.
- ✨ Source: https://github.com/sj-js/boxman
- ✨ Document: https://sj-js.github.io/sj-js/boxman



## Getting Started
0. Load
    - Browser 
        ```html
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@sj-js/boxman/dist/css/boxman.min.css">
        <script src="https://cdn.jsdelivr.net/npm/@sj-js/crossman/dist/js/crossman.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/@sj-js/boxman/dist/js/boxman.min.js"></script>
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
        
1. Make BOX 
    ```js
    boxman.newBox({content:'BOX', width:'100px', minHeight:'35px'});
    ```

2. Make OBJ
    ```js
    boxman.newObj({content:'OBJ', width:'50px', height:'30px'});
    ```
    
3. Simple Example
    ```html
    <!DOCTYPE html>
    <HTML>
        <head>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@sj-js/boxman/dist/css/boxman.min.css">
            <script src="https://cdn.jsdelivr.net/npm/@sj-js/crossman/dist/js/crossman.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/@sj-js/boxman/dist/js/boxman.min.js"></script>
            <script>
                var boxman = new BoxMan();
            </script>
            <style>
                div[data-box] { display:block; width:200px; min-height:30px;}
                div[data-obj] { display:inline-block; min-width:50px; min-height:30px;}
                div[data-box].test-a { background:pink; border:1px solid black; }
                div[data-obj].test-a { background:deeppink; border:1px solid black; }
            </style>
        </head>
        <body>
            Hello Boxman<br/>
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
    </HTML>
    ```
