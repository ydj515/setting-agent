::.bat 기본 세팅 값
	::모든 명령줄 끄기
	@echo off
	::UTF8로 설정
	@chcp 65001

	:: 인자로 전달된 변수 받기
	set "variableName=%1"
	set "variableValue=%2"
	
	set "variableValue=%variableValue:"=\"%"

cls
goto :CheckUAC

::관리자 권한 취득
	:CheckUAC
		::관리자 권한 체크
		>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
		if '%errorlevel%' NEQ '0' (
			goto :UACAccess
		) else ( 
			goto :Done 
		)
	:UACAccess
		cls
		echo.
		echo --- 관리자 권한이 없습니다. ---
		echo "ENTER"키(또는 "예" 버튼)를 눌러 관리자 권한을 취득 합니다...
		echo [참고 : 관리자 권한이 없기때문에 한번더 실행됩니다.]
		timeout 5 >nul
		::pause >nul
		
		::관리자 권한 주기위해 VBS파일 생성
		echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
		echo UAC.ShellExecute "cmd", "/c """"%~f0"" %variableName% %variableValue%""", "%CD%", "runas", 1 >> "%temp%\getadmin.vbs"

		"%temp%\getadmin.vbs" "%file%"

		::관리자 권한 완료후 VBS파일 삭제
		del "%temp%\getadmin.vbs"
		exit /b
	:Done
		cls
		echo --- 관리자 권한을 취득하였습니다. ---

		::여기서부터 권리자 권한 필요한 명령어 입력
        setx %variableName% "%variableValue%" /M
		echo Environment variable %variableName% set to %variableValue%
		
        pause
		exit