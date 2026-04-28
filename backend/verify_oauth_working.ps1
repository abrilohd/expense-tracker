# OAuth Verification Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "OAuth Configuration Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if backend is running
Write-Host "Test 1: Checking if backend is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/" -UseBasicParsing
    Write-Host "✅ Backend is running!" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is NOT running!" -ForegroundColor Red
    Write-Host "   Start it with: cd backend && kill_and_restart.bat" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Check OAuth configuration
Write-Host "Test 2: Checking OAuth configuration..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/auth/oauth-status" -UseBasicParsing
    $config = $response.Content | ConvertFrom-Json
    
    if ($config.oauth_configured) {
        Write-Host "✅ OAuth is configured!" -ForegroundColor Green
        Write-Host "   Client ID: $($config.client_id_preview)" -ForegroundColor Green
        Write-Host "   Redirect URI: $($config.redirect_uri)" -ForegroundColor Green
    } else {
        Write-Host "❌ OAuth is NOT configured!" -ForegroundColor Red
        Write-Host "   The .env file is not being loaded!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Cannot check OAuth config!" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 3: Check OAuth URL generation
Write-Host "Test 3: Testing OAuth URL generation..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/auth/google/login" -MaximumRedirection 0 -ErrorAction SilentlyContinue
    $redirectUrl = $response.Headers.Location
    
    if ($redirectUrl -match "client_id=([^&]+)") {
        $clientId = $matches[1]
        Write-Host "✅ OAuth URL generated successfully!" -ForegroundColor Green
        Write-Host "   Client ID in URL: $clientId" -ForegroundColor Green
    } else {
        Write-Host "❌ OAuth URL is missing client_id!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Cannot generate OAuth URL!" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ ALL TESTS PASSED!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "OAuth is configured correctly!" -ForegroundColor Green
Write-Host "You can now test from the frontend:" -ForegroundColor Green
Write-Host "   http://localhost:5173/login" -ForegroundColor Cyan
Write-Host ""
