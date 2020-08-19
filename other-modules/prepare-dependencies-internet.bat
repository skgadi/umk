rmdir /s/q ..\internet\themes\site-n-docs\static\dependencies

rem install w3css to the website
md ..\internet\themes\site-n-docs\static\dependencies\w3css
xcopy .\special\w3css ..\internet\themes\site-n-docs\static\dependencies\w3css /y/s/q/i

rem install jquery
xcopy .\node_modules\jquery\dist ..\internet\themes\site-n-docs\static\dependencies\jquery /y/s/q/i

rem install fontawesome
xcopy .\node_modules\@fortawesome\fontawesome-free\webfonts ..\internet\themes\site-n-docs\static\dependencies\fa\webfonts /y/s/q/i
md ..\internet\themes\site-n-docs\static\dependencies\fa\css
copy .\node_modules\@fortawesome\fontawesome-free\css\all.min.css ..\internet\themes\site-n-docs\static\dependencies\fa\css\all.min.css


pause



















