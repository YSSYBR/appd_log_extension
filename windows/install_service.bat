C:\src\install\nssm-2.24\win64\nssm.exe install warman "C:\src\install\run.bat"
C:\src\install\nssm-2.24\win64\nssm.exe set warman Application "C:\src\install\run.bat"
C:\src\install\nssm-2.24\win64\nssm.exe set warman AppParameters "C:\src\install\run.bat"
C:\src\install\nssm-2.24\win64\nssm.exe set warman AppDirectory "C:\src\install"
C:\src\install\nssm-2.24\win64\nssm.exe set warman DisplayName Warman
C:\src\install\nssm-2.24\win64\nssm.exe set warman Description Script de inicializacao da solucao Lab Warman
C:\src\install\nssm-2.24\win64\nssm.exe set warman Start SERVICE_AUTO_START

mkdir "C:\src\install\logs\"

C:\src\install\nssm-2.24\win64\nssm.exe set warman AppStdout "C:\src\install\logs\stdout.log"
C:\src\install\nssm-2.24\win64\nssm.exe set warman AppStderr "C:\src\install\logs\stderr.log"

net start warman

echo Servico configurado com sucesso