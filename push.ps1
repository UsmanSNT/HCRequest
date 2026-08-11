Set-Location -LiteralPath $PSScriptRoot -ErrorAction Stop

Write-Host ""
Write-Host "=== HCRequest GitHub Push ==="

git add .

$changes = git diff --cached --name-only

if ($changes) {
    git commit -m "Update HCRequest"
    if ($LASTEXITCODE -ne 0) { exit 1 }
} else {
    Write-Host "Commit qilinadigan o'zgarish yo'q."
}

git pull --rebase origin main
if ($LASTEXITCODE -ne 0) { exit 1 }

git push origin main
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host ""
Write-Host "=========================="
Write-Host "GitHub yangilandi."
Write-Host "=========================="

Read-Host "Yopish uchun Enter bosing"
