# Quick Start Script for Testing LTI Application

Write-Host "🚀 Starting LTI Application..." -ForegroundColor Green

# Check if Docker is running
Write-Host "`n📦 Step 1: Checking Docker..." -ForegroundColor Cyan
$dockerRunning = docker ps 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Start PostgreSQL
Write-Host "`n🐘 Step 2: Starting PostgreSQL..." -ForegroundColor Cyan
docker compose up -d
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ PostgreSQL started successfully" -ForegroundColor Green
    Start-Sleep -Seconds 3
} else {
    Write-Host "❌ Failed to start PostgreSQL" -ForegroundColor Red
    exit 1
}

# Run migrations
Write-Host "`n📊 Step 3: Running database migrations..." -ForegroundColor Cyan
Set-Location backend
npx prisma migrate deploy
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migrations applied successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️  Migration warnings (non-critical)" -ForegroundColor Yellow
}

# Start backend in new window
Write-Host "`n🔧 Step 4: Starting Backend Server..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"
Write-Host "✅ Backend starting on http://localhost:3010" -ForegroundColor Green

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend in new window
Write-Host "`n⚛️  Step 5: Starting Frontend Server..." -ForegroundColor Cyan
Set-Location ../frontend
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm start"
Write-Host "✅ Frontend starting on http://localhost:3000" -ForegroundColor Green

Write-Host "`n" -NoNewline
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "🎉 LTI Application Started Successfully!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "`n📝 Quick Testing Guide:" -ForegroundColor Cyan
Write-Host "  1. Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  2. Backend:  http://localhost:3010" -ForegroundColor White
Write-Host "  3. Health:   http://localhost:3010/health" -ForegroundColor White
Write-Host "`n✨ Test the Candidate Form:" -ForegroundColor Cyan
Write-Host "  • Click 'Agregar Candidato' button" -ForegroundColor White
Write-Host "  • Fill in: First Name, Last Name, Email (required)" -ForegroundColor White
Write-Host "  • Optionally upload a PDF CV (< 10MB)" -ForegroundColor White
Write-Host "  • Click 'Guardar' to create candidate" -ForegroundColor White
Write-Host "`n📖 Full testing guide: See TESTING_GUIDE.md" -ForegroundColor Yellow
Write-Host "`n🛑 To stop all services:" -ForegroundColor Cyan
Write-Host "  • Close the terminal windows" -ForegroundColor White
Write-Host "  • Run: docker compose down" -ForegroundColor White
Write-Host "`n"

# Return to root directory
Set-Location ..
