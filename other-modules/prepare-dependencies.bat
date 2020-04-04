rmdir /s/q ..\docs-dev\dependencies
xcopy .\node_modules\mathjs\dist ..\docs-dev\dependencies\mathjs /y/s/q/i
xcopy .\node_modules\js-polyfills ..\docs-dev\dependencies\js-polyfills /y/s/q/i
xcopy .\node_modules\mathjax\es5 ..\docs-dev\dependencies\mathjax /y/s/q/i
xcopy .\node_modules\noty\lib ..\docs-dev\dependencies\noty /y/s/q/i
xcopy .\node_modules\vue\dist ..\docs-dev\dependencies\vue /y/s/q/i
xcopy .\github\mxgraph\javascript\src ..\docs-dev\dependencies\mxgraph /y/s/q/i
xcopy .\no-auto-ver ..\docs-dev\dependencies /y/s/q/i
pause