import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "postgresql://postgres.fcqumhrammnsrwwlszsl:Halong123%40%23%24@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
      }
    }
  });

  console.log('--- Applying Security Fix: Enabling RLS ---');

  try {
    // 1. Enable RLS on core tables
    const tables = ['User', 'Generation', 'CreditLog'];
    for (const table of tables) {
      console.log(`Enabling RLS on "${table}"...`);
      await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
    }

    // 2. Enable storage policy
    console.log('Configuring Storage Policy for "uploads" bucket...');
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM pg_policies 
              WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Public Read Access'
          ) THEN
              CREATE POLICY "Public Read Access"
              ON storage.objects FOR SELECT
              USING ( bucket_id = 'uploads' );
          END IF;
      END
      $$;
    `);

    console.log('\n✅ Security Fix Successfully Applied!');
    console.log('You can now check your Supabase Dashboard; the "Critical Issue" warning will disappear.');

  } catch (error) {
    console.error('\n❌ Failed to apply security fix:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
