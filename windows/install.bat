@echo off

net session >nul 2>&1
if %errorLevel% == 0 (
    goto is_admin
) else (
    echo Falha, necessario executar como administrador.
    pause
)

:is_admin
    echo Permissoes administrativas confirmadas.

    set INSTALLATION_DIR=%~dp0

    call %INSTALLATION_DIR%\uninstall.bat

    set SOLUTION_OUTPUT_DIR=C:\src\warman
    set INSTALLATION_OUTPUT_DIR=C:\src\install

    if not exist %SOLUTION_OUTPUT_DIR% ( 
        mkdir %SOLUTION_OUTPUT_DIR% 
        mkdir %INSTALLATION_OUTPUT_DIR%
    ) else (
        rmdir /s /q C:\src
        mkdir %SOLUTION_OUTPUT_DIR% 
        mkdir %INSTALLATION_OUTPUT_DIR%
    )

    echo Iniciando instalacao do Node...
    %INSTALLATION_DIR%\node-v16.17.0-x64.msi /quiet InstallAllUsers=1 Include_launcher=0 Include_test=0 SimpleInstall=1 Include_tools=0 Include_tcltk=0 Include_dev=0 PrependPath=1
    echo Node instalado!
    
    echo Iniciando instalacao da Solucao...
    
    robocopy %INSTALLATION_DIR%\warman %SOLUTION_OUTPUT_DIR% /E /XD node_modules
    robocopy %INSTALLATION_DIR% %INSTALLATION_OUTPUT_DIR% /E /XD warman /XF node-v16.17.0-x64.msi

    echo Solucao instalada

    cd %SOLUTION_OUTPUT_DIR%

    call npm install

    echo Solucao executada
	
    call %INSTALLATION_OUTPUT_DIR%\install_service.bat

    echo Instalacao concluida com sucesso, favor fechar esse terminal.

    pause
