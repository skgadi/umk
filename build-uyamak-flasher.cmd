rem generate the flasher files

cd dev-flasher
@echo off
call yarn install
call yarn build
cd ..


rem copy the flasher files to the dev-docs folder

rem remove the old flasher files
rmdir /s/q .\docs-dev\flasher
mkdir .\docs-dev\flasher
xcopy .\dev-flasher\dist\spa .\docs-dev\flasher /y/s/q/i