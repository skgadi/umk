del /q ".\docs\*"
FOR /D %%p IN (".\docs\*.*") DO rmdir "%%p" /s /q