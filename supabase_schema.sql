-- BIG LOVA-FASHION Database Schema
-- Execute este script no SQL Editor do Supabase para configurar as tabelas e permissões.

-- 1. Profiles Table (Extended for Premium/Admin)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  country TEXT,
  address TEXT,
  fashion_style TEXT,
  account_type TEXT DEFAULT 'normal' CHECK (account_type IN ('normal', 'premium', 'admin')),
  is_verified BOOLEAN DEFAULT false,
  private_profile BOOLEAN DEFAULT false,
  hide_phone BOOLEAN DEFAULT true,
  show_online BOOLEAN DEFAULT true,
  notifications_enabled BOOLEAN DEFAULT true,
  last_seen TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Premium Data Table
CREATE TABLE IF NOT EXISTS premium_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  age INTEGER,
  height TEXT,
  bi_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. Posts Table (Supports Photo, Video and Text)
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT DEFAULT 'photo' CHECK (type IN ('photo', 'video', 'text')),
  image_url TEXT, -- Nullable para suportar posts de apenas texto
  caption TEXT,
  hashtags TEXT[],
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Reels Table (Vertical Videos)
CREATE TABLE IF NOT EXISTS reels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  video_url TEXT NOT NULL,
  caption TEXT,
  music_name TEXT,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. Likes Table
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  reel_id UUID REFERENCES reels(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, reel_id)
);

-- 6. Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  reel_id UUID REFERENCES reels(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 7. Stories Table
CREATE TABLE IF NOT EXISTS stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 8. Messages Table (WhatsApp style)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'audio', 'photo', 'video', 'document')),
  media_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 9. Ranking Top Model (Votes)
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  voter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  week_number INTEGER DEFAULT extract(week from now()),
  year INTEGER DEFAULT extract(year from now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(voter_id, candidate_id, week_number, year)
);

-- 10. Groups and Notifications
CREATE TABLE IF NOT EXISTS groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS group_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(group_id, user_id)
);

CREATE TABLE IF NOT EXISTS group_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE, -- Removido NOT NULL para Chat Global
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  type TEXT DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ==========================================
-- Habilitar RLS (Row Level Security)
-- NOTA: RLS desativado a pedido do utilizador para facilitar o desenvolvimento.
-- ==========================================
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE premium_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE reels DISABLE ROW LEVEL SECURITY;
ALTER TABLE likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE group_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE group_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- ==========================================
-- Políticas de Segurança (RLS Policies)
-- ==========================================

-- Profiles
DROP POLICY IF EXISTS "Profiles are public" ON profiles;
CREATE POLICY "Profiles are public" ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Posts
DROP POLICY IF EXISTS "Posts are public" ON posts;
CREATE POLICY "Posts are public" ON posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert their own posts" ON posts;
CREATE POLICY "Users can insert their own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;
CREATE POLICY "Users can delete their own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- Reels
DROP POLICY IF EXISTS "Reels are public" ON reels;
CREATE POLICY "Reels are public" ON reels FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert their own reels" ON reels;
CREATE POLICY "Users can insert their own reels" ON reels FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete their own reels" ON reels;
CREATE POLICY "Users can delete their own reels" ON reels FOR DELETE USING (auth.uid() = user_id);

-- Stories
DROP POLICY IF EXISTS "Stories are public" ON stories;
CREATE POLICY "Stories are public" ON stories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert their own stories" ON stories;
CREATE POLICY "Users can insert their own stories" ON stories FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own stories" ON stories;
CREATE POLICY "Users can delete own stories" ON stories FOR DELETE USING (auth.uid() = user_id);

-- Likes
DROP POLICY IF EXISTS "Likes are public" ON likes;
CREATE POLICY "Likes are public" ON likes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert their own likes" ON likes;
CREATE POLICY "Users can insert their own likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can unlike" ON likes;
CREATE POLICY "Users can unlike" ON likes FOR DELETE USING (auth.uid() = user_id);

-- Comments
DROP POLICY IF EXISTS "Comments are public" ON comments;
CREATE POLICY "Comments are public" ON comments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert their own comments" ON comments;
CREATE POLICY "Users can insert their own comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Messages
DROP POLICY IF EXISTS "Messages are private" ON messages;
CREATE POLICY "Messages are private" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
DROP POLICY IF EXISTS "Users can insert their own messages" ON messages;
CREATE POLICY "Users can insert their own messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Notifications
DROP POLICY IF EXISTS "Users can see own notifications" ON notifications;
CREATE POLICY "Users can see own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON notifications;
CREATE POLICY "Authenticated users can insert notifications" ON notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Premium Data
DROP POLICY IF EXISTS "Premium data is visible by owner" ON premium_data;
CREATE POLICY "Premium data is visible by owner" ON premium_data FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own premium data" ON premium_data;
CREATE POLICY "Users can insert own premium data" ON premium_data FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Votes
DROP POLICY IF EXISTS "Votes are public" ON votes;
CREATE POLICY "Votes are public" ON votes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can vote" ON votes;
CREATE POLICY "Users can vote" ON votes FOR INSERT WITH CHECK (auth.uid() = voter_id);

-- Groups
DROP POLICY IF EXISTS "Groups are public" ON groups;
CREATE POLICY "Groups are public" ON groups FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can create groups" ON groups;
CREATE POLICY "Authenticated users can create groups" ON groups FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Group Members
DROP POLICY IF EXISTS "Group members are public" ON group_members;
CREATE POLICY "Group members are public" ON group_members FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can join groups" ON group_members;
CREATE POLICY "Users can join groups" ON group_members FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Group Messages
DROP POLICY IF EXISTS "Group messages are public" ON group_messages;
CREATE POLICY "Group messages are public" ON group_messages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can send group messages" ON group_messages;
CREATE POLICY "Users can send group messages" ON group_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- RPC Functions for Likes
CREATE OR REPLACE FUNCTION increment_likes(post_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts SET likes_count = likes_count + 1 WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_likes(post_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts SET likes_count = likes_count - 1 WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- STORAGE POLICIES
-- ==========================================

-- Criar buckets se não existirem
INSERT INTO storage.buckets (id, name, public) 
VALUES ('posts', 'posts', true), 
       ('reels', 'reels', true), 
       ('stories', 'stories', true), 
       ('avatars', 'avatars', true), 
       ('messages', 'messages', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage
DROP POLICY IF EXISTS "Acesso Público Storage" ON storage.objects;
CREATE POLICY "Acesso Público Storage" ON storage.objects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Upload Autenticado Storage" ON storage.objects;
CREATE POLICY "Upload Autenticado Storage" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Update Próprio Storage" ON storage.objects;
CREATE POLICY "Update Próprio Storage" ON storage.objects FOR UPDATE USING (auth.uid() = owner);

DROP POLICY IF EXISTS "Delete Próprio Storage" ON storage.objects;
CREATE POLICY "Delete Próprio Storage" ON storage.objects FOR DELETE USING (auth.uid() = owner);

-- Trigger para Criação Automática de Perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, account_type)
  VALUES (
    new.id,
    split_part(new.email, '@', 1),
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'normal'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
