rem generate the flasher files and place them in the dev-docs folder
call .\build-uyamak-flasher.cmd

rem copy the files from the dev-docs folder to the internet folder
rmdir /s/q .\internet\static\app\latest
xcopy .\docs-dev\dependencies .\internet\static\app\latest\dependencies /y/s/q/i
xcopy .\docs-dev\css\fonts .\internet\static\app\latest\css\fonts /y/s/q/i
copy /y .\docs-dev\css\style.min.css .\internet\static\app\latest\css\style.min.css
copy /y .\docs-dev\css\themes.min.css .\internet\static\app\latest\css\themes.min.css
copy /y .\docs-dev\script.min.js .\internet\static\app\latest\script.min.js
copy /y .\docs-dev\pre-scripts.min.js .\internet\static\app\latest\pre-scripts.min.js
copy /y .\docs-dev\simulator.min.js .\internet\static\app\latest\simulator.min.js
copy /y .\docs-dev\lib.min.js .\internet\static\app\latest\lib.min.js
copy /y .\docs-dev\app1.min.html .\internet\static\app\latest\index.html
copy /y .\docs-dev\favicon.png .\internet\static\app\latest\favicon.png

rem chart window stuff
rem copy /y .\docs-dev\chart.min.html .\internet\static\app\latest\chart.html
rem copy /y .\docs-dev\css\chart.min.css .\internet\static\app\latest\css\chart.min.css
rem copy /y .\docs-dev\chart.min.js .\internet\static\app\latest\chart.min.js


rem Add all the sinks
mkdir .\internet\static\app\latest\sinks\css
copy /y .\docs-dev\sinks\*.min.* .\internet\static\app\latest\sinks
copy /y .\docs-dev\sinks\css\*.min.css .\internet\static\app\latest\sinks\css

rem Add flasher files
mkdir .\internet\static\app\latest\flasher
xcopy .\docs-dev\flasher .\internet\static\app\latest\flasher /y/s/q/i

rem generate the hugo files (static website)
echo Generating the hugo files... Please wait. This may take a while.
cd .\internet
hugo --destination "../docs/" --cleanDestinationDir --minify --quiet 
cd ..

rem create .nojekyll file to prevent github pages from ignoring files starting with underscore
copy NUL .\docs\.nojekyll

rem Make the elements in docs folder as PWA
rem python .\make-docs-pwa.py


rem Add, commit and push the changes to the server

git add .
git commit -am "Generating and pushing into server."
git push



pause