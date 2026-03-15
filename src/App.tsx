/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Profile, Post, Message } from './types';
import { 
  Heart, 
  MessageCircle, 
  Search, 
  User, 
  PlusSquare, 
  Home, 
  Send,
  LogOut,
  Camera,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Components
const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for confirmation!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-fashion-black p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900/50 p-8 rounded-3xl border border-white/10 backdrop-blur-xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl font-display font-bold text-fashion-pink mb-2 tracking-tighter">LOVAS</h1>
          <p className="text-zinc-400 text-sm">Where Fashion Meets Connection</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-fashion-black border border-white/10 rounded-xl px-4 py-3 focus:border-fashion-pink outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-fashion-black border border-white/10 rounded-xl px-4 py-3 focus:border-fashion-pink outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-fashion-pink hover:bg-pink-600 text-white font-bold py-3 rounded-xl transition-all pink-glow disabled:opacity-50"
          >
            {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-zinc-400 text-sm hover:text-fashion-pink transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(*)')
      .order('created_at', { ascending: false });
    
    if (error) console.error(error);
    else setPosts(data || []);
    setLoading(false);
  };

  if (loading) return <div className="flex justify-center p-10"><Sparkles className="animate-spin text-fashion-pink" /></div>;

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-24 pt-4">
      {posts.map((post) => (
        <motion.div 
          key={post.id}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-zinc-900/30 rounded-3xl overflow-hidden border border-white/5"
        >
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden border border-fashion-gold/30">
              {post.profiles?.avatar_url ? (
                <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-500"><User size={20} /></div>
              )}
            </div>
            <div>
              <p className="font-bold text-sm">@{post.profiles?.username || 'user'}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{post.profiles?.fashion_style || 'Fashionista'}</p>
            </div>
          </div>
          
          <div className="aspect-square bg-zinc-800 relative group">
            <img 
              src={post.image_url} 
              alt="Look" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="p-4">
            <div className="flex gap-4 mb-3">
              <button className="hover:text-fashion-pink transition-colors"><Heart size={24} /></button>
              <button className="hover:text-fashion-pink transition-colors"><MessageCircle size={24} /></button>
              <button className="hover:text-fashion-pink transition-colors ml-auto"><Send size={24} /></button>
            </div>
            <p className="text-sm mb-2">
              <span className="font-bold mr-2">@{post.profiles?.username}</span>
              {post.caption}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.hashtags?.map(tag => (
                <span key={tag} className="text-xs text-fashion-pink font-medium">#{tag}</span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const Explore = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
        <input 
          type="text" 
          placeholder="Search trends, styles, stylists..." 
          className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-fashion-pink outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[1,2,3,4,5,6,7,8,9].map(i => (
          <div key={i} className="aspect-square bg-zinc-800 rounded-lg overflow-hidden relative group cursor-pointer">
            <img 
              src={`https://picsum.photos/seed/fashion${i}/400/400`} 
              alt="" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Heart className="text-white fill-white" size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfileView = ({ user }: { user: any }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(data);
    };
    getProfile();
  }, [user]);

  return (
    <div className="max-w-2xl mx-auto pt-8 px-4">
      <div className="flex items-center gap-8 mb-12">
        <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-fashion-gold p-1">
          <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500"><User size={40} /></div>
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-2xl font-bold">@{profile?.username || 'username'}</h2>
            <button className="bg-zinc-800 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors">Edit Profile</button>
          </div>
          <div className="flex gap-6 text-sm mb-4">
            <span><strong className="text-fashion-pink">0</strong> posts</span>
            <span><strong className="text-fashion-pink">0</strong> followers</span>
            <span><strong className="text-fashion-pink">0</strong> following</span>
          </div>
          <p className="text-sm text-zinc-300">{profile?.bio || 'No bio yet.'}</p>
          <p className="text-xs text-fashion-gold mt-1 uppercase tracking-widest">{profile?.fashion_style || 'Style Explorer'}</p>
        </div>
      </div>

      <div className="border-t border-white/10 pt-8">
        <div className="flex justify-center gap-12 mb-8">
          <button className="text-fashion-pink border-b-2 border-fashion-pink pb-2 px-4 uppercase text-xs font-bold tracking-widest">Posts</button>
          <button className="text-zinc-500 hover:text-white transition-colors pb-2 px-4 uppercase text-xs font-bold tracking-widest">Saved</button>
        </div>
        
        <div className="grid grid-cols-3 gap-1">
          <div className="aspect-square bg-zinc-900 rounded-sm flex flex-col items-center justify-center text-zinc-600 border border-dashed border-white/10">
            <PlusSquare size={32} className="mb-2" />
            <span className="text-[10px] uppercase tracking-widest">New Look</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreatePost = ({ onComplete }: { onComplete: () => void }) => {
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;
    setLoading(true);

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      // 1. Upload Image to Storage
      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(filePath, image);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('posts')
        .getPublicUrl(filePath);

      // 2. Insert Post Record
      const tagsArray = hashtags.split(',').map(t => t.trim().replace('#', '')).filter(t => t !== '');
      
      const { error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          caption,
          hashtags: tagsArray
        });

      if (postError) throw postError;
      
      onComplete();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-zinc-900 rounded-3xl border border-white/10 max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-display font-bold text-fashion-pink mb-6">Share Your Look</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div 
          className="aspect-square bg-zinc-800 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden cursor-pointer hover:border-fashion-pink transition-colors"
          onClick={() => document.getElementById('image-input')?.click()}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <Camera size={40} className="mx-auto mb-2 text-zinc-500" />
              <p className="text-xs text-zinc-500 uppercase tracking-widest">Select Fashion Photo</p>
            </div>
          )}
        </div>
        <input 
          id="image-input"
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleImageChange}
        />
        
        <textarea
          placeholder="Describe your style..."
          className="w-full bg-fashion-black border border-white/10 rounded-xl px-4 py-3 focus:border-fashion-pink outline-none h-24 resize-none"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        
        <input
          type="text"
          placeholder="Hashtags (comma separated: streetwear, luxury)"
          className="w-full bg-fashion-black border border-white/10 rounded-xl px-4 py-3 focus:border-fashion-pink outline-none"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading || !image}
          className="w-full bg-fashion-pink hover:bg-pink-600 text-white font-bold py-3 rounded-xl transition-all pink-glow disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Post Look'}
        </button>
      </form>
    </div>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => { subscription.unsubscribe(); };
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*, sender:profiles(*)')
      .order('created_at', { ascending: true });
    setMessages(data || []);
    setLoading(false);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: '00000000-0000-0000-0000-000000000000', // Placeholder for global chat
        content: newMessage
      });

    if (error) console.error(error);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender_id === 'my-id' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender_id === 'my-id' ? 'bg-fashion-pink text-white' : 'bg-zinc-800 text-zinc-200'}`}>
              <p className="text-[10px] font-bold mb-1 opacity-50">@{msg.sender?.username || 'user'}</p>
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-fashion-pink outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="bg-fashion-pink p-3 rounded-xl pink-glow">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('feed');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) return <Auth />;

  return (
    <div className="min-h-screen bg-fashion-black pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-fashion-black/80 backdrop-blur-md border-b border-white/5 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold text-fashion-pink tracking-tighter">LOVAS</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-zinc-900 rounded-full transition-colors"><MessageCircle size={22} /></button>
            <button 
              onClick={() => supabase.auth.signOut()}
              className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-500"
            >
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'feed' && (
            <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Feed />
            </motion.div>
          )}
          {activeTab === 'create' && (
            <motion.div key="create" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CreatePost onComplete={() => setActiveTab('feed')} />
            </motion.div>
          )}
          {activeTab === 'chat' && (
            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Chat />
            </motion.div>
          )}
          {activeTab === 'explore' && (
            <motion.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Explore />
            </motion.div>
          )}
          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProfileView user={session.user} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-fashion-black/90 backdrop-blur-lg border-t border-white/10 px-6 py-3 z-50">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <button 
            onClick={() => setActiveTab('feed')}
            className={`p-2 transition-all ${activeTab === 'feed' ? 'text-fashion-pink scale-110' : 'text-zinc-500'}`}
          >
            <Home size={26} />
          </button>
          <button 
            onClick={() => setActiveTab('explore')}
            className={`p-2 transition-all ${activeTab === 'explore' ? 'text-fashion-pink scale-110' : 'text-zinc-500'}`}
          >
            <Search size={26} />
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`p-2 text-fashion-white bg-fashion-pink rounded-2xl pink-glow -mt-8 border-4 border-fashion-black transition-transform active:scale-90 ${activeTab === 'create' ? 'scale-110' : ''}`}
          >
            <PlusSquare size={28} />
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`p-2 transition-all ${activeTab === 'chat' ? 'text-fashion-pink scale-110' : 'text-zinc-500'}`}
          >
            <MessageCircle size={26} />
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`p-2 transition-all ${activeTab === 'profile' ? 'text-fashion-pink scale-110' : 'text-zinc-500'}`}
          >
            <User size={26} />
          </button>
        </div>
      </nav>
    </div>
  );
}
