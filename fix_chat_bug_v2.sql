-- SCRIPT DE CORREÇÃO DO CHAT (VERSÃO FINAL SEM ERROS)
-- Este script resolve o erro de chave estrangeira e garante o funcionamento do chat.
-- Execute este script no SQL Editor do seu projeto Supabase.

-- 1. TORNAR O RECEPTOR OPCIONAL
-- Isso permite que mensagens sem destinatário sejam tratadas como "Globais"
-- sem precisar de um usuário falso que causa erro de chave estrangeira.
ALTER TABLE messages ALTER COLUMN receiver_id DROP NOT NULL;

-- 2. HABILITAR REALTIME
-- Garante que as mensagens apareçam instantaneamente para quem recebe.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'messages'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE messages;
    END IF;
END $$;

-- 3. CONFIGURAR SEGURANÇA (RLS)
-- Garante que as mensagens possam ser lidas e enviadas com segurança.
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Política de Visualização (SELECT)
-- Permite ver mensagens privadas suas ou mensagens Globais (onde receiver_id é nulo).
DROP POLICY IF EXISTS "Messages are private" ON messages;
CREATE POLICY "Messages are private" ON messages 
FOR SELECT USING (
  auth.uid() = sender_id OR 
  auth.uid() = receiver_id OR 
  receiver_id IS NULL
);

-- Política de Inserção (INSERT)
-- Permite enviar mensagens se você for o remetente.
DROP POLICY IF EXISTS "Users can insert their own messages" ON messages;
CREATE POLICY "Users can insert their own messages" ON messages 
FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Política de Atualização (UPDATE)
-- Permite marcar mensagens recebidas como lidas.
DROP POLICY IF EXISTS "Users can update received messages" ON messages;
CREATE POLICY "Users can update received messages" ON messages 
FOR UPDATE USING (auth.uid() = receiver_id)
WITH CHECK (auth.uid() = receiver_id);

-- Política de Exclusão (DELETE)
-- Permite apagar suas próprias mensagens enviadas.
DROP POLICY IF EXISTS "Users can delete their own messages" ON messages;
CREATE POLICY "Users can delete their own messages" ON messages 
FOR DELETE USING (auth.uid() = sender_id);

-- 4. PERMISSÕES DE ACESSO
GRANT ALL ON TABLE messages TO authenticated;
GRANT ALL ON TABLE messages TO service_role;
