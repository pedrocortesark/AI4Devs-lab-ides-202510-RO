#!/usr/bin/env node

const http = require('http');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset')
{
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkHealth()
{
    log('\n🏥 LTI Health Check\n', 'cyan');

    const services = [
        {
            name: 'Backend API',
            url: 'http://localhost:3010/health',
            port: 3010,
        },
        {
            name: 'Frontend',
            url: 'http://localhost:3000',
            port: 3000,
        },
    ];

    let allHealthy = true;

    for (const service of services)
    {
        try
        {
            const data = await new Promise((resolve, reject) =>
            {
                const req = http.get(service.url, (res) =>
                {
                    let body = '';
                    res.on('data', (chunk) => { body += chunk; });
                    res.on('end', () =>
                    {
                        if (res.statusCode === 200)
                        {
                            try
                            {
                                resolve(JSON.parse(body));
                            } catch
                            {
                                resolve({ status: 'ok' });
                            }
                        } else
                        {
                            reject(new Error(`HTTP ${res.statusCode}`));
                        }
                    });
                });

                req.on('error', reject);
                req.setTimeout(5000, () =>
                {
                    req.destroy();
                    reject(new Error('Timeout'));
                });
            });

            log(`✅ ${service.name} (port ${service.port}): HEALTHY`, 'green');

            if (service.name === 'Backend API' && data.database)
            {
                log(`   └─ Database: ${data.database.status}`, 'cyan');
                log(`   └─ Response time: ${data.responseTime}ms`, 'cyan');
            }
        } catch (error)
        {
            log(`❌ ${service.name} (port ${service.port}): UNHEALTHY`, 'red');
            log(`   └─ Error: ${error.message}`, 'red');
            allHealthy = false;
        }
    }

    log('');

    if (allHealthy)
    {
        log('🎉 All services are healthy!', 'green');
        process.exit(0);
    } else
    {
        log('⚠️  Some services are not responding.', 'yellow');
        log('Make sure to run: npm run dev', 'yellow');
        process.exit(1);
    }
}

checkHealth().catch((error) =>
{
    log(`\n❌ Health check failed: ${error.message}`, 'red');
    process.exit(1);
});
