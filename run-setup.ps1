# 1) Write server/.env with your values
$envContent = @"
PORT=4000
MONGODB_URI=mongodb+srv://tirupathamma31:23cse275%2A@mydb.f04hufo.mongodb.net/foodapp?appName=MyDB
JWT_SECRET=W9xX2qvZz2a4kQw7nE7mZpR3uG5bV8c1Y4tU9oR2sM6nD3fH1pK7jL0bC8vQ5rT2
"@
New-Item -ItemType Directory -Force -Path ".\server" | Out-Null
$envPath = ".\server\.env"
$envContent | Out-File -FilePath $envPath -Encoding utf8 -Force

# 2) Create full project files (server + client)
# If you already have setup.ps1 from me earlier, skip this block and run that file instead.
$setup = @"
<PLACEHOLDER_SETUP_PS1>
"@
# If you already ran my big setup script earlier, comment the next 2 lines:
$setupPath = ".\setup.ps1"
$setup | Out-File -FilePath $setupPath -Encoding utf8 -Force
powershell -ExecutionPolicy Bypass -File .\setup.ps1

# 3) Install and run server
Push-Location .\server
npm install
npm run seed
Start-Process powershell -ArgumentList '-NoExit','-Command','npm run dev'
Pop-Location

# 4) Install and run client
Push-Location .\client
npm install
Start-Process powershell -ArgumentList '-NoExit','-Command','npm run dev'
Pop-Location

Write-Host "Done. API: http://localhost:4000  |  Client will show a local URL (e.g., http://localhost:5173)"
