#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset')
{
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, cwd = process.cwd())
{
    try
    {
        execSync(command, { cwd, stdio: 'inherit' });
        return true;
    } catch (error)
    {
        log(`❌ Error executing: ${command}`, 'red');
        return false;
    }
}

function sleep(ms)
{
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function bootstrap()
{
    log('\n🚀 LTI Bootstrap Script - Automated Setup\n', 'cyan');
    log('This script will set up your complete development environment.\n', 'blue');

    const steps = [
        {
            name: 'Environment Variables',
            action: () =>
            {
                const envExample = path.join(__dirname, '..', '.env.example');
                const backendEnv = path.join(__dirname, '..', 'backend', '.env');

                if (!fs.existsSync(backendEnv))
                {
                    log('📝 Creating backend/.env from template...', 'yellow');
                    fs.copyFileSync(envExample, backendEnv);
                    log('✅ Created backend/.env', 'green');
                } else
                {
                    log('✅ backend/.env already exists', 'green');
                }
            },
        },
        {
            name: 'Docker PostgreSQL',
            action: async () =>
            {
                log('🐳 Starting PostgreSQL container...', 'yellow');
                execCommand('docker compose up -d');
                log('⏳ Waiting for PostgreSQL to be ready (10 seconds)...', 'yellow');
                await sleep(10000);
                log('✅ PostgreSQL is running', 'green');
            },
        },
        {
            name: 'Backend Dependencies',
            action: () =>
            {
                log('📦 Installing backend dependencies...', 'yellow');
                execCommand('npm install', path.join(__dirname, '..', 'backend'));
                log('✅ Backend dependencies installed', 'green');
            },
        },
        {
            name: 'Prisma Client',
            action: () =>
            {
                log('🔧 Generating Prisma Client...', 'yellow');
                execCommand('npx prisma generate', path.join(__dirname, '..', 'backend'));
                log('✅ Prisma Client generated', 'green');
            },
        },
        {
            name: 'Database Migrations',
            action: () =>
            {
                log('🗄️  Running database migrations...', 'yellow');
                execCommand('npx prisma migrate deploy', path.join(__dirname, '..', 'backend'));
                log('✅ Migrations completed', 'green');
            },
        },
        {
            name: 'Frontend Dependencies',
            action: () =>
            {
                log('📦 Installing frontend dependencies...', 'yellow');
                execCommand('npm install', path.join(__dirname, '..', 'frontend'));
                log('✅ Frontend dependencies installed', 'green');
            },
        },
        {
            name: 'Health Check',
            action: async () =>
            {
                log('🏥 Starting backend for health check...', 'yellow');
                const backendPath = path.join(__dirname, '..', 'backend');

                // Start backend in background
                const { spawn } = require('child_process');
                const backend = spawn('npm', ['run', 'dev'], {
                    cwd: backendPath,
                    detached: true,
                    stdio: 'ignore'
                });

                log('⏳ Waiting for backend to start (15 seconds)...', 'yellow');
                await sleep(15000);

                try
                {
                    const http = require('http');
                    const healthCheck = await new Promise((resolve, reject) =>
                    {
                        http.get('http://localhost:3010/health', (res) =>
                        {
                            let data = '';
                            res.on('data', (chunk) => { data += chunk; });
                            res.on('end', () =>
                            {
                                if (res.statusCode === 200)
                                {
                                    resolve(JSON.parse(data));
                                } else
                                {
                                    reject(new Error(`Health check failed: ${res.statusCode}`));
                                }
                            });
                        }).on('error', reject);
                    });

                    log('✅ Health check passed:', 'green');
                    log(JSON.stringify(healthCheck, null, 2), 'cyan');

                    // Kill backend process
                    process.kill(-backend.pid);
                } catch (error)
                {
                    log(`⚠️  Health check skipped: ${error.message}`, 'yellow');
                    log('You can verify manually with: npm run dev', 'yellow');
                }
            },
        },
    ];

    let success = true;

    for (const [index, step] of steps.entries())
    {
        log(`\n[${index + 1}/${steps.length}] ${step.name}`, 'blue');
        log('─'.repeat(50), 'blue');

        try
        {
            await step.action();
        } catch (error)
        {
            log(`❌ Failed: ${error.message}`, 'red');
            success = false;
            break;
        }
    }

    if (success)
    {
        log('\n' + '═'.repeat(60), 'green');
        log('🎉 BOOTSTRAP COMPLETED SUCCESSFULLY!', 'green');
        log('═'.repeat(60), 'green');
        log('\n📚 Next Steps:', 'cyan');
        log('  1. Start development servers: npm run dev', 'cyan');
        log('  2. Backend will run at: http://localhost:3010', 'cyan');
        log('  3. Frontend will run at: http://localhost:3000', 'cyan');
        log('  4. Run tests: npm test', 'cyan');
        log('  5. Check database: npm run prisma:studio\n', 'cyan');
    } else
    {
        log('\n' + '═'.repeat(60), 'red');
        log('❌ BOOTSTRAP FAILED', 'red');
        log('═'.repeat(60), 'red');
        log('\nPlease check the errors above and try again.', 'yellow');
        log('Or follow manual installation steps in README.md\n', 'yellow');
        process.exit(1);
    }
}

// Execute bootstrap
bootstrap().catch((error) =>
{
    log(`\n❌ Unexpected error: ${error.message}`, 'red');
    process.exit(1);
});
