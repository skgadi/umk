rmdir /s/q ..\docs
xcopy .\docs-dev\dependencies .\docs\dependencies /y/s/q/i
xcopy .\docs-dev\css\fonts .\docs\css\fonts /y/s/q/i
copy /y .\docs-dev\css\style.min.css .\docs\css\style.min.css
copy /y .\docs-dev\script.min.js .\docs\script.min.js
copy /y .\docs-dev\pre-scripts.min.js .\docs\pre-scripts.min.js

git add .
git commit -am "Generating and pushing into server. Also deploys functions"
git push

pause