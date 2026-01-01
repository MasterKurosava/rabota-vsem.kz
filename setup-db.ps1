# Setup database script
Write-Host "🌱 Setting up database..." -ForegroundColor Green

# Step 1: Generate Prisma Client
Write-Host "`n📦 Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}

# Step 2: Create and apply migrations
Write-Host "`n🗄️ Creating migration..." -ForegroundColor Yellow
npx prisma migrate dev --name init_service_marketplace
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create migration" -ForegroundColor Red
    exit 1
}

# Step 3: Run seed
Write-Host "`n🌱 Seeding database..." -ForegroundColor Yellow
npx prisma db seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to seed database" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Database setup completed!" -ForegroundColor Green

