set SOURCE_DIR=%~dp0


robocopy %SOURCE_DIR% %SOURCE_DIR%\windows\warman apps.json
robocopy %SOURCE_DIR% %SOURCE_DIR%\windows\warman config.json


call %SOURCE_DIR%/windows/install.bat
