$ErrorActionPreference = 'Continue'

# Test 1: Login
Write-Output "=== TEST: LOGIN ==="
try {
    $loginBody = '{"email":"industry@example.com","password":"password"}'
    $loginResp = Invoke-WebRequest -Uri "http://localhost:80/api/v1/auth/login" -Method POST -ContentType "application/json" -Body $loginBody -UseBasicParsing
    Write-Output "Status: $($loginResp.StatusCode)"
    Write-Output "Body: $($loginResp.Content)"
    $token = ($loginResp.Content | ConvertFrom-Json).access_token
    Write-Output "Token: $token"
} catch {
    $errResp = $_.Exception.Response
    if ($errResp) {
        $stream = $errResp.GetResponseStream()
        $reader = [System.IO.StreamReader]::new($stream)
        Write-Output "Status: $($errResp.StatusCode)"
        Write-Output "Error Body: $($reader.ReadToEnd())"
    } else {
        Write-Output "Error: $($_.Exception.Message)"
    }
}

# Test 2: Dashboard
Write-Output "`n=== TEST: INDUSTRY DASHBOARD ==="
try {
    $dashResp = Invoke-WebRequest -Uri "http://localhost:80/api/v1/dashboard/industry" -Method GET -UseBasicParsing
    Write-Output "Status: $($dashResp.StatusCode)"
    Write-Output "Body: $($dashResp.Content)"
} catch {
    $errResp = $_.Exception.Response
    if ($errResp) {
        $stream = $errResp.GetResponseStream()
        $reader = [System.IO.StreamReader]::new($stream)
        Write-Output "Status: $($errResp.StatusCode)"
        Write-Output "Error: $($reader.ReadToEnd())"
    } else {
        Write-Output "Error: $($_.Exception.Message)"
    }
}

# Test 3: Registration
Write-Output "`n=== TEST: ORGANIZATION REGISTRATION ==="
try {
    $regBody = '{"orgType":"MANUFACTURER","orgName":"New Test Pharma 2026","cinLlpin":"U12345MH2024PTC999999","panNumber":"ABCDE1234F","gstNumber":"27ABCDE1234F1Z5","city":"Mumbai","stateCode":"MH","contactPersonName":"Jane Doe","contactPersonDesignation":"MD","aadhaarToken":"123456789012","mobile":"9876543211","email":"newtest2026b@example.com","password":"Test@1234","confirmPassword":"Test@1234","captcha":"10","fullName":"Jane Doe","fatherSpouseName":"Father Name","dateOfBirth":"1990-01-01","nationality":"INDIAN","experienceYears":5,"qualification":"B.Pharm","declaration":true}'
    $regResp = Invoke-WebRequest -Uri "http://localhost:80/api/v1/organizations/register" -Method POST -ContentType "application/json" -Body $regBody -UseBasicParsing
    Write-Output "Status: $($regResp.StatusCode)"
    Write-Output "Body: $($regResp.Content)"
} catch {
    $errResp = $_.Exception.Response
    if ($errResp) {
        $stream = $errResp.GetResponseStream()
        $reader = [System.IO.StreamReader]::new($stream)
        Write-Output "Status: $($errResp.StatusCode)"
        Write-Output "Error: $($reader.ReadToEnd())"
    } else {
        Write-Output "Error: $($_.Exception.Message)"
    }
}

# Test 4: Applications list
Write-Output "`n=== TEST: APPLICATIONS LIST ==="
try {
    $appResp = Invoke-WebRequest -Uri "http://localhost:80/api/v1/applications?organizationId=00000000-0000-0000-0000-000000000001" -Method GET -UseBasicParsing
    Write-Output "Status: $($appResp.StatusCode)"
    Write-Output "Body: $($appResp.Content)"
} catch {
    $errResp = $_.Exception.Response
    if ($errResp) {
        $stream = $errResp.GetResponseStream()
        $reader = [System.IO.StreamReader]::new($stream)
        Write-Output "Status: $($errResp.StatusCode)"
        Write-Output "Error: $($reader.ReadToEnd())"
    } else {
        Write-Output "Error: $($_.Exception.Message)"
    }
}

# Test 5: Login with newly registered user (if registration succeeded)
Write-Output "`n=== TEST: LOGIN AFTER REGISTRATION ==="
try {
    $loginBody2 = '{"email":"newtest2026b@example.com","password":"Test@1234"}'
    $loginResp2 = Invoke-WebRequest -Uri "http://localhost:80/api/v1/auth/login" -Method POST -ContentType "application/json" -Body $loginBody2 -UseBasicParsing
    Write-Output "Status: $($loginResp2.StatusCode)"
    Write-Output "Body: $($loginResp2.Content)"
} catch {
    $errResp = $_.Exception.Response
    if ($errResp) {
        $stream = $errResp.GetResponseStream()
        $reader = [System.IO.StreamReader]::new($stream)
        Write-Output "Status: $($errResp.StatusCode)"
        Write-Output "Error: $($reader.ReadToEnd())"
    } else {
        Write-Output "Error: $($_.Exception.Message)"
    }
}

Write-Output "`n=== DONE ==="
