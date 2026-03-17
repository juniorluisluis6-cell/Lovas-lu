-- SCRIPT DE CORREÇÃO DEFINITIVA DE RLS (BIG LOVA)
-- Execute este script no SQL Editor do Supabase.

-- 1. AJUSTAR TABELA PREMIUM_DATA
-- Adiciona campos em falta para evitar erros de inserção
ALTER TABLE premium_data ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE premium_data ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE premium_data ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE premium_data ALTER COLUMN height TYPE TEXT;

-- 2. POLÍTICAS PARA PREMIUM_DATA
ALTER TABLE premium_data ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Premium data is visible by owner" ON premium_data;
CREATE POLICY "Premium data is visible by owner" ON premium_data FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own premium data" ON premium_data;
CREATE POLICY "Users can insert own premium data" ON premium_data FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. POLÍTICAS PARA VOTOS (RANKING)
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Votes are public" ON votes;
CREATE POLICY "Votes are public" ON votes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can vote" ON votes;
CREATE POLICY "Users can vote" ON votes FOR INSERT WITH CHECK (auth.uid() = voter_id);

-- 4. POLÍTICAS PARA NOTIFICAÇÕES (REFORÇO)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can see own notifications" ON notifications;
CREATE POLICY "Users can see own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON notifications;
CREATE POLICY "Authenticated users can insert notifications" ON notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 5. POLÍTICAS PARA CHAT GLOBAL E GRUPOS
ALTER TABLE group_messages ALTER COLUMN group_id DROP NOT NULL;
DROP POLICY IF EXISTS "Group messages are public" ON group_messages;
CREATE POLICY "Group messages are public" ON group_messages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can send group messages" ON group_messages;
CREATE POLICY "Users can send group messages" ON group_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- 6. STORAGE (GARANTIR PASTAS E ACESSO)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('posts', 'posts', true), 
       ('reels', 'reels', true), 
       ('stories', 'stories', true), 
       ('avatars', 'avatars', true), 
       ('messages', 'messages', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Acesso Público Storage" ON storage.objects;
CREATE POLICY "Acesso Público Storage" ON storage.objects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Upload Autenticado Storage" ON storage.objects;
CREATE POLICY "Upload Autenticado Storage" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Update Próprio Storage" ON storage.objects;
CREATE POLICY "Update Próprio Storage" ON storage.objects FOR UPDATE USING (auth.uid() = owner);
DROP POLICY IF EXISTS "Delete Próprio Storage" ON storage.objects;
CREATE POLICY "Delete Próprio Storage" ON storage.objects FOR DELETE USING (auth.uid() = owner);
