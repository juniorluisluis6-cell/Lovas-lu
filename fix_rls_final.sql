-- SCRIPT DE CORREÇÃO FINAL DE RLS E ESQUEMA (BIG LOVA)

-- 1. Ajustar tabela de mensagens de grupo para suportar chat global (group_id opcional)
ALTER TABLE group_messages ALTER COLUMN group_id DROP NOT NULL;

-- 2. Habilitar RLS em todas as tabelas (caso não esteja)
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS PARA GRUPOS E MENSAGENS DE GRUPO

-- Grupos
DROP POLICY IF EXISTS "Grupos são visíveis por todos" ON groups;
CREATE POLICY "Grupos são visíveis por todos" ON groups FOR SELECT USING (true);

DROP POLICY IF EXISTS "Usuários autenticados podem criar grupos" ON groups;
CREATE POLICY "Usuários autenticados podem criar grupos" ON groups FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Membros de Grupo
DROP POLICY IF EXISTS "Membros são visíveis por todos" ON group_members;
CREATE POLICY "Membros são visíveis por todos" ON group_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Usuários podem se juntar a grupos" ON group_members;
CREATE POLICY "Usuários podem se juntar a grupos" ON group_members FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Mensagens de Grupo (Chat Global e Grupos)
DROP POLICY IF EXISTS "Mensagens de grupo são públicas" ON group_messages;
CREATE POLICY "Mensagens de grupo são públicas" ON group_messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Usuários podem enviar mensagens de grupo" ON group_messages;
CREATE POLICY "Usuários podem enviar mensagens de grupo" ON group_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Usuários podem deletar suas próprias mensagens" ON group_messages;
CREATE POLICY "Usuários podem deletar suas próprias mensagens" ON group_messages FOR DELETE USING (auth.uid() = sender_id);

-- 4. POLÍTICAS PARA NOTIFICAÇÕES (IMPORTANTE)

DROP POLICY IF EXISTS "Usuários podem ver suas próprias notificações" ON notifications;
CREATE POLICY "Usuários podem ver suas próprias notificações" ON notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem marcar notificações como lidas" ON notifications;
CREATE POLICY "Usuários podem marcar notificações como lidas" ON notifications FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Sistema e usuários podem criar notificações" ON notifications;
CREATE POLICY "Sistema e usuários podem criar notificações" ON notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 5. POLÍTICAS DE STORAGE (REFORÇO)

-- Garantir que as políticas de storage cubram SELECT, INSERT e UPDATE
DROP POLICY IF EXISTS "Acesso Público Storage" ON storage.objects;
CREATE POLICY "Acesso Público Storage" ON storage.objects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Upload Autenticado Storage" ON storage.objects;
CREATE POLICY "Upload Autenticado Storage" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Update Próprio Storage" ON storage.objects;
CREATE POLICY "Update Próprio Storage" ON storage.objects FOR UPDATE USING (auth.uid() = owner);

-- 6. FUNÇÕES DE INCREMENTO/DECREMENTO DE LIKES (RPC)

CREATE OR REPLACE FUNCTION increment_likes(post_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET likes_count = likes_count + 1
  WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_likes(post_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET likes_count = likes_count - 1
  WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_reel_likes(reel_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE reels
  SET likes_count = likes_count + 1
  WHERE id = reel_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_reel_likes(reel_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE reels
  SET likes_count = likes_count - 1
  WHERE id = reel_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
