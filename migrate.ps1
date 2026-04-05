$env:DATABASE_URL = "postgresql://postgres.fcqumhrammnsrwwlszsl:Halong123%40%23%24@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
$env:DIRECT_URL = "postgresql://postgres.fcqumhrammnsrwwlszsl:Halong123%40%23%24@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
npx prisma db push --accept-data-loss
