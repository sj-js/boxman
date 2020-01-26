# BoxMan

[![Build Status](https://travis-ci.org/sj-js/boxman.svg?branch=master)](https://travis-ci.org/sj-js/boxman)
[![All Download](https://img.shields.io/github/downloads/sj-js/boxman/total.svg)](https://github.com/sj-js/boxman/releases)
[![Release](https://img.shields.io/github/release/sj-js/boxman.svg)](https://github.com/sj-js/boxman/releases)
[![License](https://img.shields.io/github/license/sj-js/boxman.svg)](https://github.com/sj-js/boxman/releases)
(Detail: https://sj-js.github.io/sj-js/boxman)



## Getting Started

1. Script
    ```html
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sj-js/boxman/dist/css/boxman.css">
    <script src="https://cdn.jsdelivr.net/gh/sj-js/crossman/dist/js/crossman.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/sj-js/boxman/dist/js/boxman.js"></script>
    <script>
         var boxman = new BoxMan();
    </script>
    ```  

2. Make BOX 
    ```js
    boxman.newBox({content:'BOX', width:'100px', minHeight:'35px'});
    ```

3. Make OBJ
    ```js
    boxman.newObj({content:'OBJ', width:'50px', height:'30px'});
    ```
    
4. Simple Example
    ```html
    <!DOCTYPE html>
    <HTML>
        <head>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sj-js/boxman/dist/css/boxman.css">
            <script src="https://cdn.jsdelivr.net/gh/sj-js/crossman/dist/js/crossman.js"></script>
            <script src="https://cdn.jsdelivr.net/gh/sj-js/boxman/dist/js/boxman.js"></script>
            <script>
                var boxman = new BoxMan();
            </script>
            <style>
                div[data-obj] { display:inline-block; }
                div[data-box].test-a { background:pink; border:1px solid black; min-width:200px; min-height:30px;}
                div[data-obj].test-a { background:deeppink; border:1px solid black; min-width:50px; min-height:30px;}
            </style>
        </head>
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
    </HTML>
    ```
