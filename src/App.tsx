/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Profile, Post, Message, Story, PremiumData } from './types';
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
  Sparkles,
  Settings,
  ShieldCheck,
  Crown,
  Phone,
  MessageSquare,
  Share2,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  Video,
  Mic,
  Image as ImageIcon,
  ChevronRight,
  Menu,
  VideoOff,
  MicOff,
  X,
  Trophy,
  ThumbsUp,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Constants ---
const SUPPORT_WHATSAPP = "+258848342617";

// --- Components ---

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-fashion-black flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center"
      >
        <div className="w-32 h-32 mx-auto mb-6 gold-gradient rounded-full flex items-center justify-center gold-glow">
          <Crown size={64} className="text-fashion-black" />
        </div>
        <h1 className="text-4xl font-display font-bold gold-text-gradient tracking-tighter mb-2">
          BIG LOVA-FASHION
        </h1>
        <p className="text-fashion-gold/60 text-sm uppercase tracking-[0.3em]">
          Onde a moda encontra o luxo
        </p>
      </motion.div>
    </motion.div>
  );
};

const Auth = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Using email as a proxy for phone in this environment for Supabase Auth simplicity
      const email = `${phone.replace(/\D/g, '')}@biglova.com`;
      
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone
            }
          }
        });
        if (error) throw error;
        alert('Conta criada! Agora você pode entrar.');
        setIsSignUp(false);
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
    <div className="min-h-screen flex items-center justify-center bg-fashion-black p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-fashion-gold/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fashion-gold/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md premium-card p-8 relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-bold gold-text-gradient mb-2">BIG LOVA</h1>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Acesso Exclusivo</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-fashion-gold/50" size={18} />
              <input
                type="text"
                placeholder="Nome Completo"
                className="w-full bg-fashion-black/50 border border-white/10 rounded-2xl px-12 py-4 focus:border-fashion-gold outline-none transition-all"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-fashion-gold/50" size={18} />
            <input
              type="text"
              placeholder="Número de telefone"
              className="w-full bg-fashion-black/50 border border-white/10 rounded-2xl px-12 py-4 focus:border-fashion-gold outline-none transition-all"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-fashion-gold/50" size={18} />
            <input
              type="password"
              placeholder="Palavra-passe"
              className="w-full bg-fashion-black/50 border border-white/10 rounded-2xl px-12 py-4 focus:border-fashion-gold outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient text-fashion-black font-bold py-4 rounded-2xl transition-all gold-glow disabled:opacity-50 uppercase tracking-widest text-sm"
          >
            {loading ? 'Processando...' : isSignUp ? 'Criar Conta' : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 space-y-4 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-zinc-400 text-sm hover:text-fashion-gold transition-colors block w-full"
          >
            {isSignUp ? 'Já tem uma conta? Entrar' : 'Não tem conta? Criar conta'}
          </button>
          {!isSignUp && (
            <button className="text-zinc-500 text-xs hover:text-fashion-gold transition-colors">
              Esqueci palavra-passe
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const Stories = () => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-4 scrollbar-hide">
      <div className="flex flex-col items-center gap-1 shrink-0">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-fashion-gold/50 flex items-center justify-center p-1">
          <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-fashion-gold">
            <PlusSquare size={24} />
          </div>
        </div>
        <span className="text-[10px] text-zinc-500">Seu Story</span>
      </div>
      {[1,2,3,4,5].map(i => (
        <div key={i} className="flex flex-col items-center gap-1 shrink-0">
          <div className="w-16 h-16 rounded-full gold-gradient p-[2px]">
            <div className="w-full h-full rounded-full bg-fashion-black p-1">
              <img 
                src={`https://picsum.photos/seed/model${i}/100/100`} 
                alt="" 
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <span className="text-[10px] text-zinc-400">Model {i}</span>
        </div>
      ))}
    </div>
  );
};

const Feed = ({ profile }: { profile: Profile | null }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*, profiles(*)')
        .order('created_at', { ascending: false });
      setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="p-10 text-center"><Sparkles className="animate-spin text-fashion-gold mx-auto" /></div>;

  return (
    <div className="space-y-4 pb-24">
      <Stories />
      
      {posts.length === 0 ? (
        <div className="p-10 text-center text-zinc-500">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
          <p>Nenhum post exclusivo ainda.</p>
        </div>
      ) : (
        posts.map((post) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-fashion-zinc/30 border-y border-white/5"
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gold-gradient p-[1px]">
                  <div className="w-full h-full rounded-full bg-fashion-black p-[2px]">
                    <img 
                      src={post.profiles?.avatar_url || `https://picsum.photos/seed/${post.profiles?.id}/100/100`} 
                      alt="" 
                      className="w-full h-full rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-sm">{post.profiles?.full_name || 'User'}</p>
                    {post.profiles?.is_verified && <CheckCircle2 size={14} className="text-fashion-gold" />}
                  </div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">@{post.profiles?.username}</p>
                </div>
              </div>
              <button className="text-zinc-500"><MoreHorizontal size={20} /></button>
            </div>

            <div className="aspect-[4/5] bg-zinc-900 relative">
              {post.type === 'video' ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Video size={48} className="text-fashion-gold/20" />
                  <p className="absolute bottom-4 left-4 text-xs bg-black/50 px-2 py-1 rounded">Vídeo Clipe</p>
                </div>
              ) : (
                <img 
                  src={post.image_url} 
                  alt="" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-4">
                  <button className="hover:text-fashion-gold transition-colors"><Heart size={24} /></button>
                  <button className="hover:text-fashion-gold transition-colors"><MessageCircle size={24} /></button>
                  <button className="hover:text-fashion-gold transition-colors"><Share2 size={24} /></button>
                </div>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-fashion-gold" />
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                </div>
              </div>
              <p className="text-sm">
                <span className="font-bold mr-2">{post.profiles?.full_name}</span>
                {post.caption}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {post.hashtags?.map(tag => (
                  <span key={tag} className="text-xs text-fashion-gold">#{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

const PremiumForm = ({ onComplete }: { onComplete: () => void }) => {
  const [formData, setFormData] = useState({
    bi_number: '',
    birth_date: '',
    age: '',
    gender: '',
    address: '',
    height: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { error: dataError } = await supabase
        .from('premium_data')
        .insert({
          user_id: user.id,
          bi_number: formData.bi_number,
          birth_date: formData.birth_date,
          age: parseInt(formData.age),
          gender: formData.gender,
          address: formData.address,
          height: formData.height
        });

      if (dataError) throw dataError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ account_type: 'premium' })
        .eq('id', user.id);

      if (profileError) throw profileError;

      alert('Parabéns! Você agora é um membro PREMIUM.');
      onComplete();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto pb-24">
      <div className="text-center mb-8">
        <Crown size={48} className="text-fashion-gold mx-auto mb-4" />
        <h2 className="text-3xl font-display font-bold gold-text-gradient">Tornar-se Premium</h2>
        <p className="text-zinc-500 text-sm mt-2">Acesse funções exclusivas e luxuosas</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Número de BI"
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-fashion-gold outline-none"
            value={formData.bi_number}
            onChange={(e) => setFormData({...formData, bi_number: e.target.value})}
            required
          />
          <input
            type="date"
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-fashion-gold outline-none text-zinc-500"
            value={formData.birth_date}
            onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Idade"
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-fashion-gold outline-none"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            required
          />
          <select
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-fashion-gold outline-none text-zinc-500"
            value={formData.gender}
            onChange={(e) => setFormData({...formData, gender: e.target.value})}
            required
          >
            <option value="">Sexo</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Endereço"
          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-fashion-gold outline-none"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Altura (ex: 1.75m)"
          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-fashion-gold outline-none"
          value={formData.height}
          onChange={(e) => setFormData({...formData, height: e.target.value})}
          required
        />

        <div className="bg-fashion-gold/5 p-4 rounded-2xl border border-fashion-gold/20 space-y-2">
          <p className="text-xs font-bold text-fashion-gold uppercase tracking-widest">Benefícios:</p>
          <ul className="text-[10px] text-zinc-400 space-y-1">
            <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-fashion-gold" /> Publicar fotos e vídeos</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-fashion-gold" /> Chat privado exclusivo</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-fashion-gold" /> Vídeo chamadas e conferências</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-fashion-gold" /> Selo de verificação dourado</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full gold-gradient text-fashion-black font-bold py-4 rounded-2xl transition-all gold-glow disabled:opacity-50"
        >
          {loading ? 'Processando...' : 'Confirmar Assinatura Premium'}
        </button>
      </form>
    </div>
  );
};

const VideoCall = ({ onEnd }: { onEnd: () => void }) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-fashion-black flex flex-col"
    >
      {/* Remote Video (Placeholder) */}
      <div className="flex-1 relative bg-zinc-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000" 
          alt="Remote User" 
          className="w-full h-full object-cover opacity-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full gold-gradient p-1 mb-4">
            <div className="w-full h-full rounded-full bg-fashion-black flex items-center justify-center">
              <User size={48} className="text-fashion-gold" />
            </div>
          </div>
          <h2 className="text-2xl font-display font-bold gold-text-gradient">Model Exclusive</h2>
          <p className="text-fashion-gold/60 text-sm mt-2">{formatTime(timer)}</p>
        </div>

        {/* Local Video (Small Overlay) */}
        <div className="absolute top-6 right-6 w-32 aspect-[3/4] bg-zinc-800 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="w-full h-full flex items-center justify-center bg-zinc-900">
            <User size={24} className="text-zinc-700" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-10 bg-gradient-to-t from-black to-transparent flex justify-center gap-6">
        <button className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors">
          <MicOff size={24} />
        </button>
        <button 
          onClick={onEnd}
          className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white gold-glow hover:bg-red-600 transition-colors"
        >
          <Phone size={24} className="rotate-[135deg]" />
        </button>
        <button className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors">
          <VideoOff size={24} />
        </button>
      </div>
    </motion.div>
  );
};

const Ranking = () => {
  const [topModels, setTopModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      // Aggregate votes per candidate for current week
      const week = Math.floor((new Date().getDate() - 1) / 7) + 1; // Simple week calc
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          votes:votes(count)
        `)
        .eq('account_type', 'premium')
        .limit(10);

      if (data) {
        // Sort by votes count manually as Supabase aggregate sorting is complex
        const sorted = data.sort((a, b) => (b.votes?.[0]?.count || 0) - (a.votes?.[0]?.count || 0));
        setTopModels(sorted);
      }
      setLoading(false);
    };
    fetchRanking();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 pb-24">
      <div className="text-center mb-10">
        <Trophy size={48} className="text-fashion-gold mx-auto mb-4 animate-bounce" />
        <h2 className="text-3xl font-display font-bold gold-text-gradient">Top Model da Semana</h2>
        <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] mt-2">Ranking de Elite</p>
      </div>

      {loading ? (
        <div className="text-center py-10"><Sparkles className="animate-spin text-fashion-gold mx-auto" /></div>
      ) : (
        <div className="space-y-4">
          {topModels.map((model, index) => (
            <motion.div 
              key={model.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`premium-card p-4 flex items-center justify-between ${index === 0 ? 'border-fashion-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-14 h-14 rounded-full p-[2px] ${index === 0 ? 'gold-gradient' : 'bg-zinc-800'}`}>
                    <div className="w-full h-full rounded-full bg-fashion-black p-1">
                      <img 
                        src={model.avatar_url || `https://picsum.photos/seed/${model.id}/100/100`} 
                        alt="" 
                        className="w-full h-full rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${index === 0 ? 'bg-fashion-gold text-fashion-black' : 'bg-zinc-800 text-zinc-500'}`}>
                    {index + 1}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-sm">{model.full_name}</p>
                    {index === 0 && <Star size={12} className="text-fashion-gold fill-fashion-gold" />}
                  </div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">@{model.username}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-display font-bold text-fashion-gold">{Math.floor(Math.random() * 1000) + 500}</p>
                <p className="text-[8px] text-zinc-500 uppercase tracking-widest">Pontos Fashion</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const Chat = ({ profile, onCall }: { profile: Profile | null, onCall: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*, sender:profiles(*)')
        .order('created_at', { ascending: true });
      setMessages(data || []);
    };
    fetchMessages();

    const sub = supabase
      .channel('chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => { sub.unsubscribe(); };
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !profile) return;

    if (profile.account_type === 'normal') {
      alert('Apenas membros PREMIUM podem usar o chat.');
      return;
    }

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: profile.id,
        receiver_id: '00000000-0000-0000-0000-000000000000', // Global
        content: newMessage,
        type: 'text'
      });

    if (error) console.error(error);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender_id === profile?.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender_id === profile?.id ? 'bg-fashion-gold text-fashion-black' : 'bg-zinc-800 text-zinc-200'}`}>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[10px] font-bold opacity-70">@{msg.sender?.username || 'user'}</p>
                {msg.sender?.account_type === 'premium' && <Crown size={10} />}
              </div>
              <p className="text-sm">{msg.content}</p>
              <div className="flex justify-end gap-1 mt-1 opacity-50">
                <span className="text-[8px]">{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                <CheckCircle2 size={10} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-fashion-zinc/50 border-t border-white/5 flex gap-2">
        <button 
          type="button" 
          onClick={onCall}
          className="p-2 text-zinc-500 hover:text-fashion-gold"
        >
          <Video size={24} />
        </button>
        <button type="button" className="p-2 text-zinc-500 hover:text-fashion-gold"><Mic size={24} /></button>
        <input
          type="text"
          placeholder="Digite uma mensagem..."
          className="flex-1 bg-fashion-black border border-white/10 rounded-2xl px-4 py-2 focus:border-fashion-gold outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="bg-fashion-gold p-3 rounded-2xl gold-glow text-fashion-black">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

const AdminPanel = () => {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <ShieldCheck size={40} className="text-fashion-gold" />
        <h2 className="text-3xl font-display font-bold gold-text-gradient">Painel do Administrador</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="premium-card p-6 text-center">
          <p className="text-3xl font-bold text-fashion-gold">124</p>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-2">Usuários Totais</p>
        </div>
        <div className="premium-card p-6 text-center">
          <p className="text-3xl font-bold text-fashion-gold">42</p>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-2">Membros Premium</p>
        </div>
      </div>

      <div className="space-y-2">
        <button className="w-full bg-zinc-900 border border-white/10 p-4 rounded-2xl flex items-center justify-between hover:border-fashion-gold transition-all">
          <div className="flex items-center gap-3">
            <User size={20} className="text-fashion-gold" />
            <span className="text-sm">Gerenciar Usuários</span>
          </div>
          <ChevronRight size={18} />
        </button>
        <button className="w-full bg-zinc-900 border border-white/10 p-4 rounded-2xl flex items-center justify-between hover:border-fashion-gold transition-all">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-fashion-gold" />
            <span className="text-sm">Conteúdos Denunciados</span>
          </div>
          <ChevronRight size={18} />
        </button>
        <button className="w-full bg-zinc-900 border border-white/10 p-4 rounded-2xl flex items-center justify-between hover:border-fashion-gold transition-all">
          <div className="flex items-center gap-3">
            <Send size={20} className="text-fashion-gold" />
            <span className="text-sm">Enviar Anúncio Geral</span>
          </div>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

const SettingsView = ({ profile, onTabChange }: { profile: Profile | null, onTabChange: (tab: string) => void }) => {
  const [adminExists, setAdminExists] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('account_type', 'admin');
      setAdminExists((count || 0) > 0);
    };
    checkAdmin();
  }, []);

  const becomeAdmin = async () => {
    if (adminExists) return;
    const { error } = await supabase
      .from('profiles')
      .update({ account_type: 'admin' })
      .eq('id', profile?.id);
    if (!error) {
      alert('Você agora é o Administrador do sistema!');
      window.location.reload();
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <h2 className="text-2xl font-display font-bold mb-6">Configurações</h2>
      
      {profile?.account_type === 'normal' && (
        <button 
          onClick={() => onTabChange('premium')}
          className="w-full gold-gradient p-4 rounded-2xl flex items-center justify-between gold-glow"
        >
          <div className="flex items-center gap-3 text-fashion-black font-bold">
            <Crown size={20} />
            <span>Tornar-se Premium</span>
          </div>
          <ChevronRight size={18} className="text-fashion-black" />
        </button>
      )}

      {profile?.account_type === 'admin' && (
        <button 
          onClick={() => onTabChange('admin')}
          className="w-full bg-fashion-gold/10 border border-fashion-gold p-4 rounded-2xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3 text-fashion-gold font-bold">
            <ShieldCheck size={20} />
            <span>Painel do Administrador</span>
          </div>
          <ChevronRight size={18} />
        </button>
      )}

      {!adminExists && profile?.account_type !== 'admin' && (
        <button 
          onClick={becomeAdmin}
          className="w-full bg-fashion-zinc border-2 border-fashion-gold p-4 rounded-2xl flex items-center justify-between animate-pulse"
        >
          <div className="flex items-center gap-3 text-fashion-gold font-bold">
            <Sparkles size={20} />
            <span>🟡 TORNAR-SE ADMINISTRADOR</span>
          </div>
          <ChevronRight size={18} />
        </button>
      )}

      <div className="space-y-2 pt-4">
        <button className="w-full bg-zinc-900/50 p-4 rounded-2xl flex items-center justify-between text-zinc-400">
          <span>Privacidade</span>
          <ChevronRight size={18} />
        </button>
        <button className="w-full bg-zinc-900/50 p-4 rounded-2xl flex items-center justify-between text-zinc-400">
          <span>Notificações</span>
          <ChevronRight size={18} />
        </button>
        <button 
          onClick={() => supabase.auth.signOut()}
          className="w-full bg-red-500/10 text-red-500 p-4 rounded-2xl flex items-center justify-center gap-2 font-bold"
        >
          <LogOut size={18} />
          Sair da Conta
        </button>
      </div>

      <div className="pt-10 text-center">
        <p className="text-[10px] text-zinc-600 uppercase tracking-[0.3em]">BIG LOVA-FASHION v1.0</p>
      </div>
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [calling, setCalling] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(data);
      };
      fetchProfile();
    }
  }, [session]);

  const openWhatsApp = () => {
    const text = encodeURIComponent("Olá, preciso de ajuda com o BIG LOVA-FASHION");
    window.open(`https://wa.me/${SUPPORT_WHATSAPP}?text=${text}`, '_blank');
  };

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;
  if (!session) return <Auth />;

  return (
    <div className="min-h-screen bg-fashion-black text-fashion-white">
      <AnimatePresence>
        {calling && <VideoCall onEnd={() => setCalling(false)} />}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-fashion-black/80 backdrop-blur-md border-b border-white/5 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center">
              <Crown size={18} className="text-fashion-black" />
            </div>
            <h1 className="text-xl font-display font-bold gold-text-gradient tracking-tighter">BIG LOVA</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={openWhatsApp}
              className="bg-fashion-gold/10 text-fashion-gold px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-fashion-gold/20 flex items-center gap-2"
            >
              <Phone size={12} />
              Suporte
            </button>
            <button className="p-2 text-zinc-500"><Search size={22} /></button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto min-h-screen">
        <AnimatePresence mode="wait">
          {activeTab === 'feed' && <Feed profile={profile} />}
          {activeTab === 'chat' && <Chat profile={profile} onCall={() => setCalling(true)} />}
          {activeTab === 'ranking' && <Ranking />}
          {activeTab === 'premium' && <PremiumForm onComplete={() => setActiveTab('feed')} />}
          {activeTab === 'admin' && <AdminPanel />}
          {activeTab === 'settings' && <SettingsView profile={profile} onTabChange={setActiveTab} />}
          {activeTab === 'profile' && (
            <div className="p-10 text-center text-zinc-500">
              <User size={48} className="mx-auto mb-4 opacity-20" />
              <h2 className="text-xl font-bold text-white">@{profile?.username}</h2>
              <p className="text-xs text-fashion-gold mt-1 uppercase tracking-widest">{profile?.account_type}</p>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Support Button */}
      <button 
        onClick={openWhatsApp}
        className="fixed bottom-24 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl gold-glow flex items-center gap-2 group"
      >
        <MessageSquare size={24} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-xs font-bold whitespace-nowrap">Precisa de ajuda?</span>
      </button>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-fashion-black/90 backdrop-blur-xl border-t border-white/10 px-6 py-3 z-[60]">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <button 
            onClick={() => setActiveTab('feed')}
            className={`p-2 transition-all ${activeTab === 'feed' ? 'text-fashion-gold scale-110' : 'text-zinc-600'}`}
          >
            <Home size={24} />
          </button>
          <button 
            onClick={() => setActiveTab('ranking')}
            className={`p-2 transition-all ${activeTab === 'ranking' ? 'text-fashion-gold scale-110' : 'text-zinc-600'}`}
          >
            <Trophy size={24} />
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className="p-3 gold-gradient text-fashion-black rounded-2xl gold-glow -mt-10 border-4 border-fashion-black transition-transform active:scale-90"
          >
            <PlusSquare size={24} />
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`p-2 transition-all ${activeTab === 'chat' ? 'text-fashion-gold scale-110' : 'text-zinc-600'}`}
          >
            <MessageCircle size={24} />
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`p-2 transition-all ${activeTab === 'settings' ? 'text-fashion-gold scale-110' : 'text-zinc-600'}`}
          >
            <Settings size={24} />
          </button>
        </div>
      </nav>
    </div>
  );
}
