-- LUMINA AI STUDIO: Row-Level Security (RLS) Lockdown Script
-- Run this in your Supabase SQL Editor to ensure full data isolation.

-- 1. Enable RLS on core tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Generation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CreditLog" ENABLE ROW LEVEL SECURITY;

-- 2. Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Users can only view their own profile" ON "User";
DROP POLICY IF EXISTS "Generations are private to the creator" ON "Generation";
DROP POLICY IF EXISTS "Credit logs are private" ON "CreditLog";

-- 3. USER TABLE POLICIES
-- Users can only read and update their own user record
CREATE POLICY "Users can only view their own profile" 
ON "User" 
FOR ALL 
USING (clerkId = auth.uid()::text);

-- 4. GENERATION TABLE POLICIES
-- Users can only see and manage their own generations
-- We link it back to the User table to verify ownership via clerkId
CREATE POLICY "Generations are private to the creator" 
ON "Generation" 
FOR ALL 
USING (
  userId IN (
    SELECT id FROM "User" WHERE clerkId = auth.uid()::text
  )
);

-- 5. CREDIT LOG POLICIES
-- Access restricted to the owner
CREATE POLICY "Credit logs are private" 
ON "CreditLog" 
FOR ALL 
USING (
  userId IN (
    SELECT id FROM "User" WHERE clerkId = auth.uid()::text
  )
);

-- Note: Ensure that the Prisma client is using a connection string that 
-- respects RLS if you are making client-side calls. For server-side (Next.js API), 
-- Prisma usually bypasses RLS unless specifically configured with an 'authenticated' role.
-- These policies provide a critical secondary "safety net" at the database level.
