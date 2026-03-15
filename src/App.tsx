/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Profile, Post, Message, Story, PremiumData, Reel, Like, Comment as CommentType } from './types';
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
  Star,
  Play,
  Music,
  FileText,
  RotateCcw,
  RefreshCw,
  Trash2,
  Ban,
  BarChart3,
  Megaphone,
  PhoneOff,
  Plus,
  Upload,
  Lock
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

const PasswordRecovery = ({ onBack }: { onBack: () => void }) => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'phone' | 'code' | 'new'>('phone');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate SMS sending
    setTimeout(() => {
      setStep('code');
      setLoading(false);
    }, 1500);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setStep('new');
      setLoading(false);
    }, 1000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // In a real app, use supabase.auth.updateUser({ password: newPassword })
    setTimeout(() => {
      alert('Palavra-passe redefinida com sucesso!');
      onBack();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold gold-text-gradient">Recuperar Conta</h2>
        <p className="text-zinc-500 text-xs mt-2 uppercase tracking-widest">Siga os passos abaixo</p>
      </div>

      {step === 'phone' && (
        <form onSubmit={handleSendCode} className="space-y-4">
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
          <button type="submit" disabled={loading} className="w-full gold-gradient text-fashion-black font-bold py-4 rounded-2xl gold-glow disabled:opacity-50">
            {loading ? 'Enviando...' : 'Enviar Código SMS'}
          </button>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div className="relative">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-fashion-gold/50" size={18} />
            <input
              type="text"
              placeholder="Código de Verificação"
              className="w-full bg-fashion-black/50 border border-white/10 rounded-2xl px-12 py-4 focus:border-fashion-gold outline-none transition-all text-center tracking-[1em]"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="w-full gold-gradient text-fashion-black font-bold py-4 rounded-2xl gold-glow disabled:opacity-50">
            {loading ? 'Verificando...' : 'Verificar Código'}
          </button>
        </form>
      )}

      {step === 'new' && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="relative">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-fashion-gold/50" size={18} />
            <input
              type="password"
              placeholder="Nova Palavra-passe"
              className="w-full bg-fashion-black/50 border border-white/10 rounded-2xl px-12 py-4 focus:border-fashion-gold outline-none transition-all"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="w-full gold-gradient text-fashion-black font-bold py-4 rounded-2xl gold-glow disabled:opacity-50">
            {loading ? 'Redefinindo...' : 'Redefinir Palavra-passe'}
          </button>
        </form>
      )}

      <button onClick={onBack} className="w-full text-zinc-500 text-sm hover:text-fashion-gold transition-colors">
        Voltar ao Login
      </button>
    </div>
  );
};

const ProfileEdit = ({ profile, onComplete }: { profile: Profile | null, onComplete: () => void }) => {
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [file, setFile] = useState<File | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalAvatarUrl = avatarUrl;
    if (file) {
      // In a real app, upload to Supabase Storage
      finalAvatarUrl = URL.createObjectURL(file);
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone,
        address,
        avatar_url: finalAvatarUrl
      })
      .eq('id', profile?.id);

    setLoading(false);
    if (!error) {
      alert('Perfil atualizado com sucesso!');
      onComplete();
    } else {
      alert('Erro ao atualizar perfil');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAvatarUrl(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-8 pb-24">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-full gold-gradient p-1">
            <img 
              src={avatarUrl || `https://picsum.photos/seed/${profile?.id}/200/200`} 
              className="w-full h-full rounded-full object-cover border-4 border-fashion-black"
              alt=""
            />
          </div>
          <label className="absolute bottom-0 right-0 bg-fashion-gold text-fashion-black p-2 rounded-full gold-glow cursor-pointer">
            <Camera size={20} />
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>
        <h2 className="text-2xl font-display font-bold mt-4 gold-text-gradient">Editar Perfil</h2>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-2">Nome Completo</label>
          <input 
            type="text" 
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 focus:border-fashion-gold outline-none text-sm"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-2">Número de Telefone</label>
          <input 
            type="tel" 
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 focus:border-fashion-gold outline-none text-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-2">Endereço</label>
          <input 
            type="text" 
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 focus:border-fashion-gold outline-none text-sm"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full gold-gradient py-4 rounded-2xl text-fashion-black font-bold gold-glow mt-6 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>

      <div className="pt-6 border-t border-white/5">
        <button className="w-full bg-zinc-900/50 py-4 rounded-2xl text-zinc-400 text-sm flex items-center justify-center gap-2">
          <Lock size={16} />
          Alterar Palavra-passe
        </button>
      </div>
    </div>
  );
};

const Auth = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState(1);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
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

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (recoveryStep === 1) {
      alert('Código de recuperação enviado para ' + phone);
      setRecoveryStep(2);
    } else if (recoveryStep === 2) {
      setRecoveryStep(3);
    } else {
      alert('Palavra-passe redefinida com sucesso!');
      setIsRecovering(false);
      setRecoveryStep(1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-fashion-black p-4 relative overflow-hidden">
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

        {isRecovering ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-display font-bold text-white">Recuperação</h2>
              <p className="text-xs text-zinc-500 mt-1">
                {recoveryStep === 1 && "Insira seu número para receber o código"}
                {recoveryStep === 2 && "Insira o código enviado por SMS"}
                {recoveryStep === 3 && "Crie sua nova palavra-passe"}
              </p>
            </div>
            <form onSubmit={handleRecovery} className="space-y-4">
              {recoveryStep === 1 && (
                <input 
                  type="tel" placeholder="Número de telefone" required
                  className="w-full bg-fashion-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:border-fashion-gold outline-none"
                  value={phone} onChange={(e) => setPhone(e.target.value)}
                />
              )}
              {recoveryStep === 2 && (
                <input 
                  type="text" placeholder="Código SMS" required
                  className="w-full bg-fashion-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:border-fashion-gold outline-none text-center tracking-widest"
                />
              )}
              {recoveryStep === 3 && (
                <input 
                  type="password" placeholder="Nova Palavra-passe" required
                  className="w-full bg-fashion-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:border-fashion-gold outline-none"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
              )}
              <button type="submit" className="w-full gold-gradient py-4 rounded-2xl text-fashion-black font-bold gold-glow">
                {recoveryStep === 1 ? "Enviar Código" : recoveryStep === 2 ? "Verificar Código" : "Redefinir Senha"}
              </button>
            </form>
            <button onClick={() => setIsRecovering(false)} className="w-full text-zinc-500 text-sm">Voltar ao Login</button>
          </div>
        ) : (
          <>
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
                <button 
                  onClick={() => setIsRecovering(true)}
                  className="text-zinc-500 text-xs hover:text-fashion-gold transition-colors"
                >
                  Esqueci palavra-passe
                </button>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

const Stories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      const { data } = await supabase
        .from('stories')
        .select('*, profiles(*)')
        .order('created_at', { ascending: false });
      setStories(data || []);
      setLoading(false);
    };
    fetchStories();
  }, []);

  const handleAddStory = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    // Simulate upload
    const imageUrl = URL.createObjectURL(file);
    
    const { error } = await supabase.from('stories').insert({
      user_id: user.id,
      image_url: imageUrl
    });

    if (!error) {
      alert('Story publicado!');
      // Refresh
      const { data } = await supabase.from('stories').select('*, profiles(*)').order('created_at', { ascending: false });
      setStories(data || []);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-4 scrollbar-hide">
      <label className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-fashion-gold/50 flex items-center justify-center p-1">
          <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-fashion-gold">
            <PlusSquare size={24} />
          </div>
        </div>
        <span className="text-[10px] text-zinc-500">Seu Story</span>
        <input type="file" className="hidden" accept="image/*,video/*" onChange={handleAddStory} />
      </label>
      
      {loading ? (
        [1,2,3].map(i => (
          <div key={i} className="w-16 h-16 rounded-full bg-zinc-900 animate-pulse shrink-0" />
        ))
      ) : stories.map(story => (
        <div key={story.id} className="flex flex-col items-center gap-1 shrink-0">
          <div className="w-16 h-16 rounded-full gold-gradient p-[2px]">
            <div className="w-full h-full rounded-full bg-fashion-black p-1">
              <img 
                src={story.image_url} 
                className="w-full h-full rounded-full object-cover"
                alt=""
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <span className="text-[10px] text-zinc-500 truncate w-16 text-center">
            {story.profiles?.username}
          </span>
        </div>
      ))}
    </div>
  );
};

const CommentModal = ({ postId, onClose }: { postId: string, onClose: () => void }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      const { data } = await supabase
        .from('comments')
        .select('*, profiles(*)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      setComments(data || []);
      setLoading(false);
    };
    fetchComments();
  }, [postId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content: newComment
      })
      .select('*, profiles(*)')
      .single();

    if (!error && data) {
      setComments([...comments, data]);
      setNewComment('');
    }
  };

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="fixed inset-0 z-[150] bg-fashion-black flex flex-col"
    >
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="font-display font-bold gold-text-gradient">Comentários</h3>
        <button onClick={onClose} className="p-2 text-zinc-500"><X size={24} /></button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center py-10"><Sparkles className="animate-spin text-fashion-gold mx-auto" /></div>
        ) : comments.length > 0 ? comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <img 
              src={comment.profiles?.avatar_url || `https://picsum.photos/seed/${comment.user_id}/100/100`} 
              className="w-8 h-8 rounded-full"
              alt=""
            />
            <div className="flex-1">
              <div className="bg-zinc-900/50 p-3 rounded-2xl">
                <p className="text-[10px] font-bold text-fashion-gold mb-1">@{comment.profiles?.username}</p>
                <p className="text-xs text-zinc-300">{comment.content}</p>
              </div>
              <p className="text-[8px] text-zinc-600 mt-1 ml-2">
                {new Date(comment.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 text-zinc-600">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-20" />
            <p>Seja o primeiro a comentar!</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-zinc-900/50 flex gap-2">
        <input
          type="text"
          placeholder="Adicione um comentário..."
          className="flex-1 bg-fashion-black border border-white/10 rounded-full px-4 py-3 text-sm focus:border-fashion-gold outline-none"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit" className="bg-fashion-gold text-fashion-black p-3 rounded-full gold-glow">
          <Send size={20} />
        </button>
      </form>
    </motion.div>
  );
};

const Feed = ({ profile }: { profile: Profile | null }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*, profiles(*)')
        .order('created_at', { ascending: false });
      setPosts(data || []);
      setLoading(false);
    };

    const fetchLikes = async () => {
      if (!profile) return;
      const { data } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', profile.id);
      if (data) setLikedPosts(new Set(data.map(l => l.post_id!)));
    };

    fetchPosts();
    fetchLikes();
  }, [profile]);

  const toggleLike = async (postId: string) => {
    if (!profile) return;

    const isLiked = likedPosts.has(postId);
    const newLikedPosts = new Set(likedPosts);

    if (isLiked) {
      newLikedPosts.delete(postId);
      await supabase.from('likes').delete().eq('user_id', profile.id).eq('post_id', postId);
      await supabase.rpc('decrement_likes', { post_id_param: postId });
    } else {
      newLikedPosts.add(postId);
      await supabase.from('likes').insert({ user_id: profile.id, post_id: postId });
      await supabase.rpc('increment_likes', { post_id_param: postId });
    }

    setLikedPosts(newLikedPosts);
    setPosts(posts.map(p => p.id === postId ? { ...p, likes_count: p.likes_count + (isLiked ? -1 : 1) } : p));
  };

  const handleShare = async (post: Post) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BIG LOVA-FASHION',
          text: `Confira este post de @${post.profiles?.username}: ${post.caption}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      alert('Link copiado para a área de transferência!');
    }
  };

  if (loading) return <div className="p-10 text-center"><Sparkles className="animate-spin text-fashion-gold mx-auto" /></div>;

  return (
    <div className="space-y-4 pb-24">
      <Stories />
      
      <AnimatePresence>
        {activeCommentPost && (
          <CommentModal 
            postId={activeCommentPost} 
            onClose={() => setActiveCommentPost(null)} 
          />
        )}
      </AnimatePresence>
      
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
                  <button 
                    onClick={() => toggleLike(post.id)}
                    className={`transition-all ${likedPosts.has(post.id) ? 'text-red-500 scale-125' : 'hover:text-fashion-gold'}`}
                  >
                    <Heart size={24} fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} />
                  </button>
                  <button 
                    onClick={() => setActiveCommentPost(post.id)}
                    className="hover:text-fashion-gold transition-colors"
                  >
                    <MessageCircle size={24} />
                  </button>
                  <button 
                    onClick={() => handleShare(post)}
                    className="hover:text-fashion-gold transition-colors"
                  >
                    <Share2 size={24} />
                  </button>
                </div>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-fashion-gold" />
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                </div>
              </div>
              <p className="text-xs font-bold mb-2">{post.likes_count} curtidas</p>
              <p className="text-sm">
                <span className="font-bold mr-2">{post.profiles?.full_name}</span>
                {post.caption}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {post.hashtags?.map(tag => (
                  <span key={tag} className="text-xs text-fashion-gold">#{tag}</span>
                ))}
              </div>
              <button 
                onClick={() => setActiveCommentPost(post.id)}
                className="text-[10px] text-zinc-500 mt-3 uppercase tracking-widest hover:text-fashion-gold transition-colors"
              >
                Ver todos os comentários
              </button>
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
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-fashion-black flex flex-col"
    >
      <div className="relative flex-1">
        {/* Remote Video (Mock) */}
        <img 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000" 
          className="w-full h-full object-cover opacity-50"
          alt=""
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
          {!isCameraOff ? (
            <img 
              src="https://picsum.photos/seed/me/400/600" 
              className={`w-full h-full object-cover ${!isFrontCamera ? 'scale-x-[-1]' : ''}`}
              alt=""
            />
          ) : (
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
              <VideoOff size={24} className="text-zinc-700" />
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="p-10 bg-gradient-to-t from-black to-transparent flex justify-center items-center gap-6">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        
        <button 
          onClick={onEnd}
          className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white gold-glow shadow-2xl hover:bg-red-700 transition-colors"
        >
          <PhoneOff size={32} />
        </button>

        <button 
          onClick={() => setIsCameraOff(!isCameraOff)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isCameraOff ? 'bg-red-500 text-white' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
        >
          {isCameraOff ? <VideoOff size={24} /> : <Video size={24} />}
        </button>

        <button 
          onClick={() => setIsFrontCamera(!isFrontCamera)}
          className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700"
        >
          <RefreshCw size={24} />
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
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*, sender:profiles(*)')
        .order('created_at', { ascending: true });
      setMessages(data || []);
      setLoading(false);
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

  const sendMessage = async (type: Message['type'] = 'text', mediaUrl?: string) => {
    if ((!newMessage.trim() && !mediaUrl) || !profile) return;

    if (profile.account_type === 'normal') {
      alert('Apenas membros PREMIUM podem usar o chat.');
      return;
    }

    const messageData = {
      sender_id: profile.id,
      receiver_id: '00000000-0000-0000-0000-000000000000', // Global
      content: type === 'text' ? newMessage : null,
      type,
      media_url: mediaUrl || null
    };

    // Optimistic update
    const tempId = Math.random().toString();
    const optimisticMsg: Message = { ...messageData, id: tempId, created_at: new Date().toISOString(), is_read: false };
    setMessages(prev => [...prev, optimisticMsg]);
    setNewMessage('');

    const { error } = await supabase.from('messages').insert(messageData);
    if (error) {
      alert('Erro ao enviar mensagem');
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  const handleFileUpload = async (type: Message['type']) => {
    setUploading(true);
    // Simulate file upload
    setTimeout(() => {
      const mockUrl = type === 'photo' ? 'https://picsum.photos/800/600' : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
      sendMessage(type, mockUrl);
      setUploading(false);
    }, 1000);
  };

  const toggleRecording = () => {
    if (isRecording) {
      sendMessage('audio', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    }
    setIsRecording(!isRecording);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-2xl mx-auto bg-fashion-black">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender_id === profile?.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender_id === profile?.id ? 'bg-fashion-gold text-fashion-black' : 'bg-zinc-800 text-zinc-200'}`}>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[10px] font-bold opacity-70">@{msg.sender?.username || 'user'}</p>
                {msg.sender?.account_type === 'premium' && <Crown size={10} />}
              </div>
              
              {msg.type === 'text' && <p className="text-sm">{msg.content}</p>}
              {msg.type === 'photo' && <img src={msg.media_url!} className="rounded-lg max-w-full" alt="" />}
              {msg.type === 'audio' && (
                <div className="flex items-center gap-2 min-w-[150px]">
                  <Play size={16} />
                  <div className="flex-1 h-1 bg-black/20 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-current" />
                  </div>
                  <span className="text-[10px]">0:12</span>
                </div>
              )}
              {msg.type === 'document' && (
                <div className="flex items-center gap-2 bg-black/10 p-2 rounded-lg">
                  <FileText size={20} />
                  <span className="text-xs truncate">Documento.pdf</span>
                </div>
              )}

              <div className="flex justify-end gap-1 mt-1 opacity-50">
                <span className="text-[8px]">{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                <CheckCircle2 size={10} />
              </div>
            </div>
          </div>
        ))}
        {uploading && (
          <div className="flex justify-end">
            <div className="bg-fashion-gold/20 p-3 rounded-2xl animate-pulse flex items-center gap-2">
              <Sparkles size={16} className="text-fashion-gold animate-spin" />
              <span className="text-xs text-fashion-gold">Enviando arquivo...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-fashion-zinc/50 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button onClick={() => handleFileUpload('photo')} className="p-2 text-zinc-500 hover:text-fashion-gold"><Camera size={20} /></button>
            <button onClick={() => handleFileUpload('document')} className="p-2 text-zinc-500 hover:text-fashion-gold"><Plus size={20} /></button>
            <button onClick={onCall} className="p-2 text-zinc-500 hover:text-fashion-gold"><Video size={20} /></button>
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Digite uma mensagem..."
              className="w-full bg-fashion-black border border-white/10 rounded-2xl px-4 py-2 focus:border-fashion-gold outline-none text-sm"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
          </div>
          <button 
            onClick={toggleRecording}
            className={`p-3 rounded-full transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-fashion-gold text-fashion-black'}`}
          >
            {isRecording ? <MicOff size={20} /> : newMessage.trim() ? <Send size={20} onClick={() => sendMessage()} /> : <Mic size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [stats, setStats] = useState({ total: 0, premium: 0, verified: 0 });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'stats' | 'users'>('stats');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (profiles) {
      setUsers(profiles);
      setStats({
        total: profiles.length,
        premium: profiles.filter(u => u.account_type === 'premium').length,
        verified: profiles.filter(u => u.is_verified).length
      });
    }
    setLoading(false);
  };

  const toggleVerify = async (userId: string, current: boolean) => {
    await supabase.from('profiles').update({ is_verified: !current }).eq('id', userId);
    fetchData();
  };

  const deleteUser = async (userId: string) => {
    if (confirm('Tem certeza que deseja remover este usuário?')) {
      await supabase.from('profiles').delete().eq('id', userId);
      fetchData();
    }
  };

  const makeAdmin = async (userId: string) => {
    if (confirm('Deseja tornar este usuário um Administrador?')) {
      await supabase.from('profiles').update({ account_type: 'admin' }).eq('id', userId);
      fetchData();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 pb-24">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <ShieldCheck size={40} className="text-fashion-gold" />
          <h2 className="text-3xl font-display font-bold gold-text-gradient">Painel Admin</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('stats')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${view === 'stats' ? 'bg-fashion-gold text-fashion-black' : 'bg-zinc-900 text-zinc-500'}`}>Estatísticas</button>
          <button onClick={() => setView('users')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${view === 'users' ? 'bg-fashion-gold text-fashion-black' : 'bg-zinc-900 text-zinc-500'}`}>Usuários</button>
        </div>
      </div>

      {view === 'stats' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="premium-card p-6 text-center">
            <p className="text-4xl font-display font-bold text-fashion-gold">{stats.total}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">Usuários Totais</p>
          </div>
          <div className="premium-card p-6 text-center">
            <p className="text-4xl font-display font-bold text-fashion-gold">{stats.premium}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">Membros Premium</p>
          </div>
          <div className="premium-card p-6 text-center">
            <p className="text-4xl font-display font-bold text-fashion-gold">{stats.verified}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">Contas Verificadas</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10"><Sparkles className="animate-spin text-fashion-gold mx-auto" /></div>
          ) : users.map((user) => (
            <div key={user.id} className="premium-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={user.avatar_url || `https://picsum.photos/seed/${user.id}/100/100`} className="w-10 h-10 rounded-full object-cover" alt="" />
                <div>
                  <p className="text-sm font-bold flex items-center gap-1">
                    {user.full_name}
                    {user.is_verified && <CheckCircle2 size={14} className="text-blue-400" />}
                  </p>
                  <p className="text-[10px] text-zinc-500">@{user.username} • {user.account_type}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleVerify(user.id, user.is_verified || false)}
                  className={`p-2 rounded-lg transition-all ${user.is_verified ? 'bg-fashion-gold/20 text-fashion-gold' : 'bg-zinc-800 text-zinc-500'}`}
                  title={user.is_verified ? "Desverificar" : "Verificar"}
                >
                  <CheckCircle2 size={18} />
                </button>
                {user.account_type !== 'admin' && (
                  <button 
                    onClick={() => makeAdmin(user.id)}
                    className="p-2 bg-fashion-gold/10 text-fashion-gold rounded-lg hover:bg-fashion-gold hover:text-fashion-black transition-all"
                    title="Tornar Admin"
                  >
                    <Crown size={18} />
                  </button>
                )}
                <button 
                  onClick={() => deleteUser(user.id)}
                  className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Reels = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchReels = async () => {
      const { data } = await supabase
        .from('reels')
        .select('*, profiles(*)')
        .order('created_at', { ascending: false });
      setReels(data || []);
      setLoading(false);
    };
    fetchReels();
  }, []);

  if (loading) return <div className="h-screen bg-fashion-black flex items-center justify-center"><Sparkles className="animate-spin text-fashion-gold" /></div>;

  return (
    <div className="h-[calc(100vh-70px)] bg-black snap-y snap-mandatory overflow-y-auto scrollbar-hide">
      {reels.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-zinc-500 p-10 text-center">
          <Video size={64} className="mb-4 opacity-20" />
          <h3 className="text-xl font-display gold-text-gradient mb-2">Nenhum Reel ainda</h3>
          <p className="text-sm">Seja o primeiro a brilhar na passarela vertical!</p>
        </div>
      ) : reels.map((reel, index) => (
        <div key={reel.id} className="h-full w-full snap-start relative flex flex-col justify-end">
          {/* Video Mock */}
          <div className="absolute inset-0 bg-zinc-900">
            <img 
              src={reel.video_url} 
              className="w-full h-full object-cover opacity-80"
              alt=""
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
          </div>

          {/* Overlay Content */}
          <div className="relative p-6 pb-24 flex justify-between items-end">
            <div className="flex-1 pr-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full gold-gradient p-[1px]">
                  <img 
                    src={reel.profiles?.avatar_url || `https://picsum.photos/seed/${reel.user_id}/100/100`} 
                    className="w-full h-full rounded-full object-cover border-2 border-fashion-black"
                    alt=""
                  />
                </div>
                <div>
                  <p className="font-bold text-sm text-white flex items-center gap-1">
                    {reel.profiles?.full_name}
                    {reel.profiles?.is_verified && <CheckCircle2 size={14} className="text-fashion-gold" />}
                  </p>
                  <p className="text-[10px] text-zinc-400">@{reel.profiles?.username}</p>
                </div>
                <button className="ml-2 px-3 py-1 border border-white/30 rounded-full text-[10px] font-bold text-white hover:bg-white/10">Seguir</button>
              </div>
              <p className="text-sm text-zinc-200 mb-4 line-clamp-2">{reel.caption}</p>
              <div className="flex items-center gap-2 text-xs text-fashion-gold">
                <Music size={14} className="animate-pulse" />
                <span className="truncate">{reel.music_name || 'Som Original - BIG LOVA'}</span>
              </div>
            </div>

            <div className="flex flex-col gap-6 items-center">
              <div className="flex flex-col items-center gap-1">
                <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:text-red-500 transition-colors">
                  <Heart size={28} />
                </button>
                <span className="text-[10px] font-bold text-white">{reel.likes_count}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:text-fashion-gold transition-colors">
                  <MessageCircle size={28} />
                </button>
                <span className="text-[10px] font-bold text-white">24</span>
              </div>
              <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:text-fashion-gold transition-colors">
                <Share2 size={28} />
              </button>
              <div className="w-10 h-10 rounded-full gold-gradient p-[2px] animate-spin-slow">
                <div className="w-full h-full rounded-full bg-fashion-black flex items-center justify-center">
                  <Music size={16} className="text-fashion-gold" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
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
      
      <button 
        onClick={() => onTabChange('profile-edit')}
        className="w-full bg-zinc-900 border border-white/10 p-4 rounded-2xl flex items-center justify-between hover:border-fashion-gold transition-all"
      >
        <div className="flex items-center gap-3 text-zinc-200">
          <User size={20} className="text-fashion-gold" />
          <span>Editar Perfil</span>
        </div>
        <ChevronRight size={18} />
      </button>

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

const CreatePost = ({ onComplete }: { onComplete: () => void }) => {
  const [type, setType] = useState<'post' | 'reel'>('post');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handlePublish = async () => {
    if (!file && !caption) {
      alert('Adicione uma mídia ou legenda!');
      return;
    }
    
    setLoading(true);
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    // In a real app, we would upload to Supabase Storage here
    // For now, we'll use a placeholder or the local preview URL if we want it to show up immediately
    const mediaUrl = previewUrl || (type === 'post' ? 'https://picsum.photos/800/1000' : 'https://picsum.photos/seed/reel/800/1400');

    if (type === 'post') {
      await supabase.from('posts').insert({
        user_id: user.id,
        caption,
        image_url: mediaUrl,
        type: file?.type.startsWith('video') ? 'video' : 'photo'
      });
    } else {
      await supabase.from('reels').insert({
        user_id: user.id,
        caption,
        video_url: mediaUrl,
        music_name: 'Fashion Beat - BIG LOVA'
      });
    }

    setLoading(false);
    alert('Publicado com sucesso!');
    onComplete();
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6 pb-24">
      <h2 className="text-2xl font-display font-bold gold-text-gradient">Nova Publicação</h2>
      
      <div className="flex gap-2 p-1 bg-zinc-900 rounded-2xl">
        <button 
          onClick={() => { setType('post'); setFile(null); setPreviewUrl(null); }}
          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${type === 'post' ? 'bg-fashion-gold text-fashion-black' : 'text-zinc-500'}`}
        >
          POST FASHION
        </button>
        <button 
          onClick={() => { setType('reel'); setFile(null); setPreviewUrl(null); }}
          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${type === 'reel' ? 'bg-fashion-gold text-fashion-black' : 'text-zinc-500'}`}
        >
          REEL FASHION
        </button>
      </div>

      <label className="block cursor-pointer">
        <div className="aspect-[4/5] bg-zinc-900 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-zinc-600 overflow-hidden relative">
          {previewUrl ? (
            type === 'post' && !file?.type.startsWith('video') ? (
              <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <video src={previewUrl} className="w-full h-full object-cover" muted />
            )
          ) : (
            <>
              <Upload size={48} className="mb-4 opacity-20" />
              <p className="text-sm">Carregar {type === 'post' ? 'Foto/Vídeo' : 'Vídeo'}</p>
              <p className="text-[10px] mt-2 opacity-50">Clique para selecionar do aparelho</p>
            </>
          )}
          <input 
            type="file" 
            className="hidden" 
            accept={type === 'post' ? "image/*,video/*" : "video/*"} 
            onChange={handleFileChange}
          />
        </div>
      </label>

      <textarea 
        placeholder="Escreva uma legenda luxuosa..."
        className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-sm focus:border-fashion-gold outline-none h-32"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />

      <button 
        onClick={handlePublish}
        disabled={loading}
        className="w-full gold-gradient py-4 rounded-2xl text-fashion-black font-bold gold-glow disabled:opacity-50"
      >
        {loading ? 'Publicando...' : 'PUBLICAR AGORA'}
      </button>
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
          {activeTab === 'reels' && <Reels />}
          {activeTab === 'chat' && <Chat profile={profile} onCall={() => setCalling(true)} />}
          {activeTab === 'ranking' && <Ranking />}
          {activeTab === 'premium' && <PremiumForm onComplete={() => setActiveTab('feed')} />}
          {activeTab === 'admin' && <AdminPanel />}
          {activeTab === 'settings' && <SettingsView profile={profile} onTabChange={setActiveTab} />}
          {activeTab === 'profile-edit' && <ProfileEdit profile={profile} onComplete={() => setActiveTab('settings')} />}
          {activeTab === 'create' && <CreatePost onComplete={() => setActiveTab('feed')} />}
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
            onClick={() => setActiveTab('reels')}
            className={`p-2 transition-all ${activeTab === 'reels' ? 'text-fashion-gold scale-110' : 'text-zinc-600'}`}
          >
            <Video size={24} />
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
