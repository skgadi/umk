rmdir /s/q .\gen-editor
xcopy .\docs-dev\dependencies .\gen-editor\dependencies /y/s/q/i
xcopy .\docs-dev\css\fonts .\gen-editor\css\fonts /y/s/q/i
copy /y .\docs-dev\css\style.min.css .\gen-editor\css\style.min.css
copy /y .\docs-dev\css\themes.min.css .\gen-editor\css\themes.min.css
copy /y .\docs-dev\script.min.js .\gen-editor\script.min.js
copy /y .\docs-dev\pre-scripts.min.js .\gen-editor\pre-scripts.min.js
copy /y .\docs-dev\simulator.min.js .\gen-editor\simulator.min.js
copy /y .\docs-dev\lib.min.js .\gen-editor\lib.min.js
copy /y .\docs-dev\app1.min.html .\gen-editor\index.html
copy /y .\docs-dev\favicon.ico .\gen-editor\favicon.ico

rem chart window stuff
rem copy /y .\docs-dev\chart.min.html .\gen-editor\chart.html
rem copy /y .\docs-dev\css\chart.min.css .\gen-editor\css\chart.min.css
rem copy /y .\docs-dev\chart.min.js .\gen-editor\chart.min.js


rem Add all the sinks
mkdir .\gen-editor\sinks\css
copy /y .\docs-dev\sinks\*.min.* .\gen-editor\sinks
copy /y .\docs-dev\sinks\css\*.min.css .\gen-editor\sinks\css


pause