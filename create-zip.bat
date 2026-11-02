@echo off
title Ice-Cream Project ZIP Packager (< 50MB)
color 0A

echo ======================================================================
echo           ICE-CREAM PROJECT ZIP PACKAGER (Under 50MB)
echo ======================================================================
echo.
echo Packaging clean repository without node_modules/dist...

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$zipPath = 'd:\Ice-Cream.zip';" ^
  "$tempDir = 'd:\temp_ice_zip';" ^
  "if (Test-Path $tempDir) { Remove-Item -Recurse -Force $tempDir };" ^
  "New-Item -ItemType Directory -Path $tempDir -Force | Out-Null;" ^
  "robocopy 'd:\Ice-Cream' \"$tempDir\Ice-Cream\" /E /XD node_modules dist scratch /XF '*.zip' | Out-Null;" ^
  "if (Test-Path $zipPath) { Remove-Item -Force $zipPath };" ^
  "Compress-Archive -Path \"$tempDir\Ice-Cream\" -DestinationPath $zipPath -CompressionLevel Optimal;" ^
  "Remove-Item -Recurse -Force $tempDir;" ^
  "$sizeMB = [math]::Round((Get-Item $zipPath).Length / 1MB, 2);" ^
  "Write-Host \"`n[SUCCESS] Created $zipPath (Size: $sizeMB MB)\" -ForegroundColor Green;"

echo.
echo ======================================================================
pause
