-- VERIFY AND FIX RLS POLICY - Run this in Supabase SQL Editor
-- This will show you exactly what's wrong and fix it

-- ============================================
-- STEP 1: CHECK CURRENT STATE
-- ============================================
-- Check if RLS is enabled
SELECT 
  'RLS Status' as check_type,
  CASE 
    WHEN rowsecurity THEN 'ENABLED ✓'
    ELSE 'DISABLED ✗ - This is the problem!'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'quiz_attempts';

-- Check existing policies
SELECT 
  'Existing Policies' as check_type,
  COALESCE(COUNT(*), 0) as count,
  CASE 
    WHEN COUNT(*) = 0 THEN 'NO POLICIES FOUND ✗ - Need to create one!'
    WHEN COUNT(*) > 0 THEN 'POLICIES EXIST - Checking details...'
  END as status
FROM pg_policies 
WHERE tablename = 'quiz_attempts';

-- Show all policies (if any exist)
SELECT 
  policyname,
  roles,
  cmd,
  with_check
FROM pg_policies 
WHERE tablename = 'quiz_attempts';

-- ============================================
-- STEP 2: FIX THE ISSUE
-- ============================================

-- Ensure RLS is enabled
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Remove ALL existing policies (clean slate)
DO $$ 
DECLARE
  policy_record RECORD;
BEGIN
  FOR policy_record IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'quiz_attempts'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON quiz_attempts', policy_record.policyname);
    RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
  END LOOP;
END $$;

-- Create a PERMISSIVE policy for anon role (allows inserts)
CREATE POLICY "anon_can_insert_quiz_attempts"
ON quiz_attempts
AS PERMISSIVE
FOR INSERT
TO anon
WITH CHECK (true);

-- ============================================
-- STEP 3: VERIFY THE FIX
-- ============================================
-- Check RLS is enabled
SELECT 
  'Final RLS Check' as check_type,
  CASE 
    WHEN rowsecurity THEN 'ENABLED ✓'
    ELSE 'STILL DISABLED ✗'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'quiz_attempts';

-- Check policy was created
SELECT 
  'Final Policy Check' as check_type,
  policyname,
  permissive,
  roles::text[] as roles,
  cmd as command,
  with_check
FROM pg_policies 
WHERE tablename = 'quiz_attempts';

-- Final summary
SELECT 
  'SETUP COMPLETE' as status,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'quiz_attempts') as policy_count,
  (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'quiz_attempts') as rls_enabled;

