rmdir /s/q ..\docs-dev\dependencies
xcopy .\node_modules\mathjs\dist ..\docs-dev\dependencies\mathjs /y/s/q/i
xcopy .\node_modules\js-polyfills ..\docs-dev\dependencies\js-polyfills /y/s/q/i
xcopy .\node_modules\mathjax\es5 ..\docs-dev\dependencies\mathjax /y/s/q/i
xcopy .\node_modules\noty\lib ..\docs-dev\dependencies\noty /y/s/q/i
xcopy .\node_modules\vue\dist ..\docs-dev\dependencies\vue /y/s/q/i
xcopy .\node_modules\@fortawesome\fontawesome-free\webfonts ..\docs-dev\dependencies\fa\webfonts /y/s/q/i
md ..\docs-dev\dependencies\fa\css
copy .\node_modules\@fortawesome\fontawesome-free\css\all.min.css ..\docs-dev\dependencies\fa\css\all.min.css
rem xcopy .\node_modules\dexie\dist ..\docs-dev\dependencies\dexie /y/s/q/i
xcopy .\node_modules\apexcharts\dist ..\docs-dev\dependencies\apexcharts /y/s/q/i



rem install @amcharts\amcharts4 to the website
md ..\docs-dev\dependencies\amcharts4
copy .\special\amcharts4\core.js ..\docs-dev\dependencies\amcharts4\core.js
copy .\special\amcharts4\charts.js ..\docs-dev\dependencies\amcharts4\charts.js
xcopy .\special\amcharts4\lang ..\docs-dev\dependencies\amcharts4\lang /y/s/q/i
xcopy .\special\amcharts4\themes ..\docs-dev\dependencies\amcharts4\themes /y/s/q/i
rem xcopy .\special\amcharts_fonts_4.0.1\fonts ..\docs-dev\dependencies\amcharts4\fonts /y/s/q/i


rem three.js
xcopy .\node_modules\three\build ..\docs-dev\dependencies\three\build /y/s/q/i
xcopy .\node_modules\three\examples ..\docs-dev\dependencies\three\examples /y/s/q/i




xcopy .\github\mxgraph\javascript\src ..\docs-dev\dependencies\mxgraph /y/s/q/i
xcopy .\github\pako\dist ..\docs-dev\dependencies\pako /y/s/q/i
rem xcopy .\github\drawio\src\main\webapp ..\docs-dev\dependencies\drawio /y/s/q/i


xcopy .\no-auto-ver ..\docs-dev\dependencies /y/s/q/i


pause



















