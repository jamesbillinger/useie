:: Change HKCU to HKLM if you want to install globally.
:: %~dp0 is the directory containing this bat script and ends with a backslash.
REG ADD "HKLM\Software\Google\Chrome\NativeMessagingHosts\com.jamesbillinger.useie" /ve /t REG_SZ /d "%~dp0com.jamesbillinger.useie-win.json" /f
