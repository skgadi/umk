rmdir /s/q .\docs
xcopy .\docs-dev\dependencies .\docs\dependencies /y/s/q/i
xcopy .\docs-dev\css\fonts .\docs\css\fonts /y/s/q/i
copy /y .\docs-dev\css\style.min.css .\docs\css\style.min.css
copy /y .\docs-dev\css\themes.min.css .\docs\css\themes.min.css
copy /y .\docs-dev\script.min.js .\docs\script.min.js
copy /y .\docs-dev\pre-scripts.min.js .\docs\pre-scripts.min.js
copy /y .\docs-dev\simulator.min.js .\docs\simulator.min.js
copy /y .\docs-dev\lib.min.js .\docs\lib.min.js
copy /y .\docs-dev\app1.min.html .\docs\index.html
copy /y .\docs-dev\favicon.ico .\docs\favicon.ico

rem chart window stuff
rem copy /y .\docs-dev\chart.min.html .\docs\chart.html
rem copy /y .\docs-dev\css\chart.min.css .\docs\css\chart.min.css
rem copy /y .\docs-dev\chart.min.js .\docs\chart.min.js


rem Add all the sinks
mkdir .\docs\sinks\css
copy /y .\docs-dev\sinks\*.min.* .\docs\sinks
copy /y .\docs-dev\sinks\css\*.min.css .\docs\sinks\css
copy 1471afd8580a3e1d86929ccfebff4273.html .\docs

git add .
git commit -am "Generating and pushing into server. Also deploys functions"
git push

pause