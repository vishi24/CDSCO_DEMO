$ErrorActionPreference = 'Continue'

Write-Output "=== TEST 1: Login existing industry user ==="
try {
    $r = Invoke-WebRequest -Uri "http://localhost:80/api/v1/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"industry@example.com","password":"password"}' -UseBasicParsing
    Write-Output "Status: $($r.StatusCode)"
    $token = ($r.Content | ConvertFrom-Json).access_token
    Write-Output "Got token: $($null -ne $token)"
    # Decode JWT payload to show org_id
    $parts = $token.Split('.')
    $pad = $parts[1].Length % 4
    if ($pad -ne 0) { $parts[1] += '=' * (4 - $pad) }
    $payload = [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($parts[1]))
    Write-Output "JWT payload: $payload"
} catch {
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = [System.IO.StreamReader]::new($stream)
    Write-Output "FAIL: $($reader.ReadToEnd())"
}

Write-Output "`n=== TEST 2: Register NEW organization ==="
$newEmail = "newpharm_$(Get-Random -Maximum 9999)@testcdsco.gov.in"
$regBody = "{`"orgType`":`"MANUFACTURER`",`"orgName`":`"New Test Pharma Ltd`",`"cinLlpin`":`"U12345MH2026PTC$(Get-Random -Maximum 999999)`",`"panNumber`":`"ABCDE1234F`",`"gstNumber`":`"27ABCDE$(Get-Random -Maximum 9999)F1Z5`",`"city`":`"Mumbai`",`"stateCode`":`"MH`",`"contactPersonName`":`"Dr. Test User`",`"contactPersonDesignation`":`"Director`",`"aadhaarToken`":`"123456789012`",`"mobile`":`"987654$(Get-Random -Maximum 9999)`",`"email`":`"$newEmail`",`"password`":`"Test@1234`",`"fullName`":`"Dr. Test User`",`"dateOfBirth`":`"1985-06-15`",`"nationality`":`"INDIAN`",`"experienceYears`":10,`"qualification`":`"B.Pharm`",`"fatherSpouseName`":`"Father Name`",`"declaration`":true}"
try {
    $r2 = Invoke-WebRequest -Uri "http://localhost:80/api/v1/organizations/register" -Method POST -ContentType "application/json" -Body $regBody -UseBasicParsing
    Write-Output "Status: $($r2.StatusCode)"
    $org = $r2.Content | ConvertFrom-Json
    Write-Output "OrgCode: $($org.orgCode)"
    Write-Output "OrgId: $($org.id)"
    Write-Output "DdrsUserId: $($org.ddrsUserId)"
    $registeredOrgId = $org.id
} catch {
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = [System.IO.StreamReader]::new($stream)
    Write-Output "FAIL: $($reader.ReadToEnd())"
}

Write-Output "`n=== Wait 3s for identity-service to create user... ==="
Start-Sleep -Seconds 3

Write-Output "`n=== TEST 3: Login with newly registered user ==="
try {
    $r3 = Invoke-WebRequest -Uri "http://localhost:80/api/v1/auth/login" -Method POST -ContentType "application/json" -Body "{`"email`":`"$newEmail`",`"password`":`"Test@1234`"}" -UseBasicParsing
    Write-Output "Status: $($r3.StatusCode)"
    $newToken = ($r3.Content | ConvertFrom-Json).access_token
    Write-Output "Login SUCCESS! Got token: $($null -ne $newToken)"
    # Decode JWT
    $parts3 = $newToken.Split('.')
    $pad3 = $parts3[1].Length % 4
    if ($pad3 -ne 0) { $parts3[1] += '=' * (4 - $pad3) }
    $payload3 = [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($parts3[1]))
    Write-Output "JWT payload: $payload3"
} catch {
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = [System.IO.StreamReader]::new($stream)
    Write-Output "FAIL: $($reader.ReadToEnd())"
}

Write-Output "`n=== TEST 4: GET /api/v1/auth/me with token ==="
try {
    $r4 = Invoke-WebRequest -Uri "http://localhost:80/api/v1/auth/me" -Method GET -Headers @{"Authorization"="Bearer $newToken"} -UseBasicParsing
    Write-Output "Status: $($r4.StatusCode)"
    Write-Output "Profile: $($r4.Content)"
} catch {
    Write-Output "Error: $($_.Exception.Message)"
}

Write-Output "`n=== TEST 5: Submit an application ==="
try {
    $appBody = "{`"genericName`":`"Paracetamol`",`"brandName`":`"PainFix`",`"drugCategory`":`"GENERIC`",`"caseType`":`"FRESH`",`"dosageForm`":`"TABLET`",`"strengthComposition`":`"500mg`",`"routeOfAdministration`":`"ORAL`",`"therapeuticCategory`":`"Analgesics`",`"packSize`":`"10x10`",`"shelfLife`":`"24`",`"storageConditions`":`"Store below 25C`",`"manufacturerName`":`"New Test Pharma`",`"manufacturingSiteId`":`"MFG-001`",`"countryOfOrigin`":`"India`",`"licenceType`":`"MANUFACTURING`",`"organizationId`":`"$registeredOrgId`",`"feePaid`":true,`"feeAmount`":75000,`"digitalSigned`":true,`"paymentReference`":`"UTR123456789`",`"applicantDscToken`":`"DSC_SIGNED_VALID`",`"foreignRegulatoryApprovals`":`"[]`"}"
    $r5 = Invoke-WebRequest -Uri "http://localhost:80/api/v1/applications" -Method POST -ContentType "application/json" -Headers @{"Authorization"="Bearer $newToken"} -Body $appBody -UseBasicParsing
    Write-Output "Status: $($r5.StatusCode)"
    $app = $r5.Content | ConvertFrom-Json
    Write-Output "ARN: $($app.arnNumber)"
    Write-Output "Status: $($app.currentStatus)"
    Write-Output "AppId: $($app.id)"
} catch {
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = [System.IO.StreamReader]::new($stream)
    Write-Output "FAIL: $($reader.ReadToEnd())"
}

Write-Output "`n=== DONE ==="
