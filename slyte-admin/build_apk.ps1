$ErrorActionPreference = 'Stop'

$sdkDir = "E:\slyte_app\android-sdk"
$javaDir = "E:\slyte_app\jdk17\jdk-17.0.15+6"
$adminDir = "E:\slyte_frontend\slyte-admin"
$templateDir = "E:\slyte_app\apk\android"

Write-Host "[Slyte Admin APK] Preparing environment..."
$env:ANDROID_HOME = $sdkDir
$env:JAVA_HOME = $javaDir
$env:PATH = "$javaDir\bin;$env:PATH"

# Ensure android template project exists in slyte-admin
$androidTargetDir = "$adminDir\android"
if (-not (Test-Path $androidTargetDir)) {
    Write-Host "[Slyte Admin APK] Copying Android project structure to slyte-admin..."
    Copy-Item -Path $templateDir -Destination $androidTargetDir -Recurse -Force
}

# Update assets in android app
$assetsTarget = "$androidTargetDir\app\src\main\assets\public"
if (-not (Test-Path $assetsTarget)) {
    New-Item -ItemType Directory -Force -Path $assetsTarget | Out-Null
}

Write-Host "[Slyte Admin APK] Syncing www assets to Android project..."
Copy-Item -Path "$adminDir\www\*" -Destination $assetsTarget -Recurse -Force

# Copy capacitor config to assets
Copy-Item -Path "$adminDir\capacitor.config.json" -Destination "$androidTargetDir\app\src\main\assets\capacitor.config.json" -Force

# Set local.properties
$localProps = "sdk.dir=E\:\\slyte_app\\android-sdk"
Set-Content -Path "$androidTargetDir\local.properties" -Value $localProps

Write-Host "[Slyte Admin APK] Building Android APK with Gradle..."
Set-Location $androidTargetDir
cmd.exe /c "gradlew.bat assembleDebug"

# Copy generated APK to output location
$apkSource = "$androidTargetDir\app\build\outputs\apk\debug\app-debug.apk"
$apkOutputDir = "$adminDir\apk"
if (-not (Test-Path $apkOutputDir)) {
    New-Item -ItemType Directory -Force -Path $apkOutputDir | Out-Null
}

$apkDestination = "$apkOutputDir\SlyteAdmin.apk"
if (Test-Path $apkSource) {
    Copy-Item -Path $apkSource -Destination $apkDestination -Force
    Write-Host "=========================================="
    Write-Host "SUCCESS: SLYTE ADMIN APK BUILT SUCCESSFULLY!"
    Write-Host "Location: $apkDestination"
    Write-Host "=========================================="
} else {
    Write-Error "APK build failed: output file not found at $apkSource"
}
