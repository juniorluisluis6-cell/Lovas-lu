/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Profile, Post, Message, Story, PremiumData, Reel, Like, Comment as CommentType, Notification, GroupMessage } from './types';
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
  Check,
  CheckCheck,
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
  Mail,
  Upload,
  Lock,
  Filter,
  MapPin,
  Hash,
  Users,
  Key,
  Eye,
  EyeOff,
  Bell,
  Clock,
  ExternalLink,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Constants ---
const SUPPORT_WHATSAPP = "+258848342617";
const BUCKET_NAME = 'Luana';

const NOTIFICATION_SOUNDS = {
  message: 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3',
  notification: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3',
  call: 'https://assets.mixkit.co/active_storage/sfx/1359/1359-preview.mp3'
};

const playSound = (type: keyof typeof NOTIFICATION_SOUNDS) => {
  const audio = new Audio(NOTIFICATION_SOUNDS[type]);
  audio.play().catch(e => console.log('Sound play blocked:', e));
};

const createNotification = async (userId: string, type: Notification['type'], content: string, link?: string) => {
  const { error } = await supabase.from('notifications').insert({
    user_id: userId,
    type,
    content,
    link,
    is_read: false
  });
  if (error) console.error('Error creating notification:', error);
};

const uploadFile = async (file: File, folder: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return publicUrl;
};

// --- Components ---

const Skeleton = ({ className, ...props }: { className?: string } & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`animate-pulse bg-zinc-800/50 rounded-2xl ${className}`} {...props} />
);

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
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setSent(true);
      alert('Link de recuperação enviado para o seu e-mail!');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold gold-text-gradient">Recuperar Conta</h2>
        <p className="text-zinc-500 text-xs mt-2 uppercase tracking-widest">Insira o seu e-mail de cadastro</p>
      </div>

      {!sent ? (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-fashion-gold transition-colors" size={18} />
            <input
              type="email"
              placeholder="Seu e-mail"
              className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-12 py-4 focus:border-fashion-gold outline-none transition-all text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient text-fashion-black font-bold py-4 rounded-2xl transition-all gold-glow disabled:opacity-50 uppercase tracking-widest text-sm"
          >
            {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </button>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} />
          </div>
          <p className="text-sm text-zinc-400">Verifique a sua caixa de entrada para redefinir a sua palavra-passe.</p>
        </div>
      )}

      <button 
        onClick={onBack}
        className="w-full text-zinc-500 text-[10px] uppercase tracking-widest text-center"
      >
        Voltar para Login
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
  const [saved, setSaved] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalAvatarUrl = avatarUrl;
    try {
      if (file) {
        finalAvatarUrl = await uploadFile(file, 'avatars');
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

      if (!error) {
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
          onComplete();
        }, 2000);
      } else {
        alert('Erro ao atualizar perfil');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar imagem');
    } finally {
      setLoading(false);
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
              src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.username || 'U')}&background=D4AF37&color=000`} 
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
          disabled={loading || saved}
          className={`w-full gold-gradient py-4 rounded-2xl text-fashion-black font-bold gold-glow mt-6 disabled:opacity-50 transition-all flex items-center justify-center gap-2`}
        >
          {loading ? (
            <>
              <RefreshCw className="animate-spin" size={20} />
              Salvando...
            </>
          ) : saved ? (
            <>
              <CheckCircle2 size={20} />
              SALVO
            </>
          ) : 'SALVAR ALTERAÇÕES'}
        </button>
      </form>

      <AnimatePresence>
        {saved && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-fashion-gold text-fashion-black px-8 py-3 rounded-full font-bold gold-glow z-50 flex items-center gap-2"
          >
            <CheckCircle2 size={20} />
            SALVO COM SUCESSO
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-6 border-t border-white/5">
        <button className="w-full bg-zinc-900/50 py-4 rounded-2xl text-zinc-400 text-sm flex items-center justify-center gap-2">
          <Lock size={16} />
          Alterar Palavra-passe
        </button>
      </div>
    </div>
  );
};

const TermsAndPrivacy = ({ onClose }: { onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="fixed inset-0 z-[100] bg-fashion-black/95 backdrop-blur-xl p-6 overflow-y-auto"
  >
    <div className="max-w-2xl mx-auto space-y-8 py-10">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-display font-bold gold-text-gradient">Termos e Privacidade</h2>
        <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-zinc-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-6 text-zinc-400 text-sm leading-relaxed">
        <section className="space-y-3">
          <h3 className="text-white font-bold text-lg">1. Aceitação dos Termos</h3>
          <p>Ao acessar o BIG LOVA-FASHION, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.</p>
        </section>

        <section className="space-y-3">
          <h3 className="text-white font-bold text-lg">2. Uso de Licença</h3>
          <p>É concedida permissão para baixar temporariamente uma cópia dos materiais no aplicativo BIG LOVA-FASHION apenas para visualização transitória pessoal e não comercial.</p>
        </section>

        <section className="space-y-3">
          <h3 className="text-white font-bold text-lg">3. Isenção de Responsabilidade</h3>
          <p>Os materiais no BIG LOVA-FASHION são fornecidos 'como estão'. O BIG LOVA-FASHION não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias.</p>
        </section>

        <section className="space-y-3">
          <h3 className="text-white font-bold text-lg">4. Privacidade de Dados</h3>
          <p>Sua privacidade é importante para nós. É política do BIG LOVA-FASHION respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no aplicativo.</p>
          <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.</p>
        </section>

        <section className="space-y-3">
          <h3 className="text-white font-bold text-lg">5. Moderação de Conteúdo</h3>
          <p>O BIG LOVA-FASHION reserva-se o direito de remover qualquer conteúdo considerado impróprio, ofensivo ou que viole as diretrizes da comunidade sem aviso prévio.</p>
        </section>
      </div>

      <button 
        onClick={onClose}
        className="w-full gold-gradient py-4 rounded-2xl text-fashion-black font-bold gold-glow"
      >
        Entendi e Aceito
      </button>
    </div>
  </motion.div>
);

const Auth = ({ onShowTerms }: { onShowTerms: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;

        if (data.user) {
          // O perfil agora é criado automaticamente pelo Trigger no Banco de Dados.
          // Não é necessário fazer o upsert manual aqui, o que evita erros de RLS.
          console.log('Utilizador registado, perfil sendo gerado pelo servidor...');
        }

        alert('Conta criada com sucesso! Verifique o seu e-mail se necessário.');
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      alert(error.message || 'Ocorreu um erro na autenticação');
    } finally {
      setLoading(false);
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
          <div className="w-20 h-20 mx-auto mb-4 gold-gradient rounded-2xl flex items-center justify-center gold-glow transform rotate-12">
            <Crown size={40} className="text-fashion-black -rotate-12" />
          </div>
          <h1 className="text-4xl font-display font-bold gold-text-gradient mb-2">BIG LOVA</h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em]">Acesso Exclusivo de Luxo</p>
        </div>

        {isRecovering ? (
          <PasswordRecovery onBack={() => setIsRecovering(false)} />
        ) : (
          <>
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-fashion-gold transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Nome Completo"
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-12 py-4 focus:border-fashion-gold outline-none transition-all text-sm"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-fashion-gold transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-12 py-4 focus:border-fashion-gold outline-none transition-all text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-fashion-gold transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="Palavra-passe"
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-12 py-4 focus:border-fashion-gold outline-none transition-all text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full gold-gradient text-fashion-black font-bold py-4 rounded-2xl transition-all gold-glow disabled:opacity-50 uppercase tracking-widest text-sm mt-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="animate-spin" size={18} />
                    <span>Processando...</span>
                  </div>
                ) : isSignUp ? 'Criar Conta de Luxo' : 'Entrar no Mundo Fashion'}
              </button>
            </form>

            <div className="mt-8 space-y-4 text-center">
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-zinc-400 text-xs hover:text-fashion-gold transition-colors block w-full uppercase tracking-widest"
              >
                {isSignUp ? 'Já tem uma conta? Entrar' : 'Não tem conta? Criar conta'}
              </button>
              <div className="flex items-center justify-center gap-4">
                {!isSignUp && (
                  <button 
                    onClick={() => setIsRecovering(true)}
                    className="text-zinc-600 text-[10px] hover:text-fashion-gold transition-colors uppercase tracking-widest"
                  >
                    Esqueci palavra-passe
                  </button>
                )}
                <button 
                  onClick={onShowTerms}
                  className="text-zinc-600 text-[10px] hover:text-fashion-gold transition-colors uppercase tracking-widest"
                >
                  Termos e Privacidade
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

const StoryViewer = ({ story, onClose }: { story: Story, onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col"
    >
      <div className="absolute top-0 left-0 right-0 p-4 z-10 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-3">
          <img 
            src={story.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(story.profiles?.username || 'U')}&background=D4AF37&color=000`} 
            className="w-10 h-10 rounded-full border-2 border-fashion-gold"
            alt=""
          />
          <div>
            <p className="text-white font-bold text-sm">@{story.profiles?.username}</p>
            <p className="text-white/60 text-[10px]">{new Date(story.created_at).toLocaleTimeString()}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white p-2">
          <X size={24} />
        </button>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <img 
          src={story.image_url} 
          className="w-full max-h-full object-contain"
          alt=""
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 5, ease: "linear" }}
          className="h-full bg-fashion-gold"
        />
      </div>
    </motion.div>
  );
};

const Stories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

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

    // Real-time subscription for new stories
    const subscription = supabase
      .channel('stories-updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'stories' }, async (payload) => {
        const { data: newStory } = await supabase
          .from('stories')
          .select('*, profiles(*)')
          .eq('id', payload.new.id)
          .single();
        
        if (newStory) {
          setStories(prev => {
            if (prev.some(s => s.id === newStory.id)) return prev;
            return [newStory, ...prev];
          });
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAddStory = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    setLoading(true);
    try {
      const imageUrl = await uploadFile(file, 'stories');
      
      const { error } = await supabase.from('stories').insert({
        user_id: user.id,
        image_url: imageUrl
      });

      if (!error) {
        alert('Story publicado!');
        const { data } = await supabase.from('stories').select('*, profiles(*)').order('created_at', { ascending: false });
        setStories(data || []);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao publicar story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-4 scrollbar-hide">
      <AnimatePresence>
        {selectedStory && (
          <StoryViewer 
            story={selectedStory} 
            onClose={() => setSelectedStory(null)} 
          />
        )}
      </AnimatePresence>

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
        [1,2,3,4,5].map(i => (
          <div key={i} className="flex flex-col items-center gap-1 shrink-0">
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="w-12 h-2 mt-1" />
          </div>
        ))
      ) : stories.map(story => (
        <div 
          key={story.id} 
          className="flex flex-col items-center gap-1 shrink-0 cursor-pointer"
          onClick={() => setSelectedStory(story)}
        >
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

      // Create notification for post owner
      const { data: post } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single();
      
      if (post && post.user_id !== user.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        await createNotification(
          post.user_id,
          'comment',
          `@${profile?.username || 'Alguém'} comentou no seu post: "${newComment.substring(0, 20)}${newComment.length > 20 ? '...' : ''}"`,
          'feed'
        );
      }
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

const FashionInspiration = () => {
  const [inspirations, setInspirations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInspirations = async () => {
      // In a real app, this could be an API call. 
      // Here we use high-quality fashion images from Unsplash/Picsum
      const mockInspirations = [
        { id: 1, name: 'Zendaya', style: 'Chic & Bold', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500' },
        { id: 2, name: 'Harry Styles', style: 'Gender-Fluid Fashion', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=500' },
        { id: 3, name: 'Rihanna', style: 'Street Luxury', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=500' },
        { id: 4, name: 'Bella Hadid', style: 'Y2K & Vintage', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=500' },
        { id: 5, name: 'Timothée Chalamet', style: 'Avant-Garde Tailoring', image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=500' },
      ];
      setInspirations(mockInspirations);
      setLoading(false);
    };
    fetchInspirations();
  }, []);

  return (
    <div className="py-4">
      <div className="px-4 mb-4 flex items-center justify-between">
        <h3 className="text-sm font-display font-bold gold-text-gradient flex items-center gap-2">
          <Sparkles size={16} />
          Inspiração Mundial
        </h3>
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Tendências 2026</span>
      </div>
      <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="w-40 h-56 bg-zinc-900 rounded-2xl animate-pulse flex-shrink-0" />)
        ) : inspirations.map((item) => (
          <motion.div 
            key={item.id}
            whileHover={{ scale: 1.05 }}
            className="w-40 flex-shrink-0 group relative cursor-pointer"
          >
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 relative">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="mt-2">
              <p className="text-[10px] font-bold text-white truncate">{item.name}</p>
              <p className="text-[8px] text-fashion-gold uppercase tracking-tighter truncate">{item.style}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Feed = ({ profile, onTabChange }: { profile: Profile | null, onTabChange: (tab: string) => void }) => {
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

    // Real-time subscription for new posts
    const subscription = supabase
      .channel('feed-updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, async (payload) => {
        const { data: newPost } = await supabase
          .from('posts')
          .select('*, profiles(*)')
          .eq('id', payload.new.id)
          .single();
        
        if (newPost) {
          setPosts(prev => {
            if (prev.some(p => p.id === newPost.id)) return prev;
            return [newPost, ...prev];
          });
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
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
      
      // Create notification for post owner
      const post = posts.find(p => p.id === postId);
      if (post && post.user_id !== profile.id) {
        await createNotification(
          post.user_id,
          'like',
          `@${profile.username} curtiu seu post`,
          'feed'
        );
      }
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
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copiado para a área de transferência!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  if (loading) return (
    <div className="space-y-4 pb-24">
      <Stories />
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-fashion-zinc/30 border-y border-white/5 p-4 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="w-24 h-3" />
              <Skeleton className="w-16 h-2" />
            </div>
          </div>
          <Skeleton className="aspect-[4/5] w-full rounded-3xl" />
          <div className="space-y-2">
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-2/3 h-3" />
          </div>
        </div>
      ))}
    </div>
  );

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
                      src={post.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.profiles?.username || 'U')}&background=D4AF37&color=000`} 
                      alt="" 
                      className="w-full h-full rounded-full object-cover"
                      referrerPolicy="no-referrer"
                      loading="lazy"
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
              <div className="flex items-center gap-2">
                {profile?.account_type === 'admin' && (
                  <button 
                    onClick={async () => {
                      if (confirm('Deseja remover este post?')) {
                        await supabase.from('posts').delete().eq('id', post.id);
                        setPosts(posts.filter(p => p.id !== post.id));
                      }
                    }}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (confirm('Deseja denunciar este post por conteúdo impróprio?')) {
                      alert('Denúncia enviada com sucesso. Nossa equipe analisará em breve.');
                    }
                  }}
                  className="p-2 text-zinc-500 hover:text-fashion-gold transition-colors"
                >
                  <AlertCircle size={18} />
                </button>
                <button className="text-zinc-500"><MoreHorizontal size={20} /></button>
              </div>
            </div>

            {post.type !== 'text' ? (
              <div className="aspect-[4/5] bg-zinc-900 relative overflow-hidden">
                {post.type === 'video' ? (
                  <video 
                    src={post.image_url} 
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                    referrerPolicy="no-referrer"
                    preload="metadata"
                  />
                ) : (
                  <img 
                    src={post.image_url} 
                    alt="" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                )}
              </div>
            ) : (
              <div className="aspect-[4/5] gold-gradient p-8 flex items-center justify-center text-center">
                <p className="text-fashion-black text-xl font-display font-bold leading-relaxed">
                  "{post.caption}"
                </p>
              </div>
            )}

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
              {post.type !== 'text' && (
                <p className="text-sm">
                  <span className="font-bold mr-2">{post.profiles?.full_name}</span>
                  {post.caption}
                </p>
              )}
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
    full_name: '',
    phone: '',
    address: '',
    age: '',
    bi_number: '',
    height: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Mozambique phone (basic check)
    if (!formData.phone.startsWith('+258') && !formData.phone.startsWith('258') && formData.phone.length < 9) {
      alert('Por favor, insira um número de telefone real de Moçambique (+258)');
      return;
    }

    setLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { error: dataError } = await supabase
        .from('premium_data')
        .insert({
          user_id: user.id,
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          age: parseInt(formData.age),
          bi_number: formData.bi_number,
          height: formData.height
        });

      if (dataError) throw dataError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          account_type: 'admin',
          is_verified: true,
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      alert('Parabéns! Você agora tem ACESSO TOTAL (ADMIN) à plataforma.');
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
        <h2 className="text-3xl font-display font-bold gold-text-gradient">Tornar-se Elite</h2>
        <p className="text-zinc-500 text-sm mt-2">Complete seu cadastro para acesso total à plataforma</p>
        <p className="text-fashion-gold text-[10px] uppercase tracking-widest mt-2 font-bold">Totalmente Grátis para Membros</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-2">Nome Completo</label>
          <input
            type="text"
            placeholder="Nome Completo"
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-fashion-gold outline-none"
            value={formData.full_name}
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-2">Telefone (Moçambique)</label>
          <input
            type="tel"
            placeholder="+258 8X XXX XXXX"
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-fashion-gold outline-none"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-2">Endereço</label>
          <input
            type="text"
            placeholder="Cidade, Bairro, Rua"
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-fashion-gold outline-none"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-2">Idade</label>
            <input
              type="number"
              placeholder="Anos"
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-fashion-gold outline-none"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-2">Altura (cm)</label>
            <input
              type="text"
              placeholder="Ex: 175cm"
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-fashion-gold outline-none"
              value={formData.height}
              onChange={(e) => setFormData({...formData, height: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-2">Número de BI</label>
          <input
            type="text"
            placeholder="Número do Bilhete de Identidade"
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-fashion-gold outline-none"
            value={formData.bi_number}
            onChange={(e) => setFormData({...formData, bi_number: e.target.value})}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full gold-gradient py-4 rounded-2xl text-fashion-black font-bold gold-glow mt-6 disabled:opacity-50 uppercase tracking-widest"
        >
          {loading ? 'Processando...' : 'Confirmar Cadastro Elite'}
        </button>
      </form>
    </div>
  );
};

const SearchView = ({ profile }: { profile: Profile | null }) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'users' | 'posts' | 'reels'>('users');
  const [fashionStyle, setFashionStyle] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let supabaseQuery: any;
      if (filter === 'users') {
        supabaseQuery = supabase.from('profiles').select('*');
        if (query) supabaseQuery = supabaseQuery.ilike('username', `%${query}%`);
        if (fashionStyle) supabaseQuery = supabaseQuery.eq('fashion_style', fashionStyle);
        if (location) supabaseQuery = supabaseQuery.ilike('address', `%${location}%`);
      } else if (filter === 'posts') {
        supabaseQuery = supabase.from('posts').select('*, profiles(*)');
        if (query) supabaseQuery = supabaseQuery.ilike('caption', `%${query}%`);
        // Hashtag search logic
        if (query.startsWith('#')) {
          supabaseQuery = supabase.from('posts').select('*, profiles(*)').contains('hashtags', [query.replace('#', '')]);
        }
      } else {
        supabaseQuery = supabase.from('reels').select('*, profiles(*)');
        if (query) supabaseQuery = supabaseQuery.ilike('caption', `%${query}%`);
      }

      const { data, error } = await supabaseQuery.limit(20);
      if (error) throw error;
      setResults(data || []);
    } catch (error: any) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query || fashionStyle || location) handleSearch();
    }, 500);
    return () => clearTimeout(timer);
  }, [query, filter, fashionStyle, location]);

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6 pb-24">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
        <input
          type="text"
          placeholder="Pesquisar usuários, posts ou #hashtags..."
          className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-12 py-4 focus:border-fashion-gold outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['users', 'posts', 'reels'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${filter === f ? 'bg-fashion-gold text-fashion-black' : 'bg-zinc-900 text-zinc-500'}`}
          >
            {f === 'users' ? 'Membros' : f === 'posts' ? 'Publicações' : 'Reels'}
          </button>
        ))}
      </div>

      {filter === 'users' && (
        <div className="grid grid-cols-2 gap-3">
          <select 
            className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-fashion-gold"
            value={fashionStyle}
            onChange={(e) => setFashionStyle(e.target.value)}
          >
            <option value="">Estilo Fashion</option>
            <option value="Casual">Casual</option>
            <option value="Formal">Formal</option>
            <option value="Streetwear">Streetwear</option>
            <option value="Vintage">Vintage</option>
            <option value="Luxury">Luxury</option>
          </select>
          <input
            type="text"
            placeholder="Localização (Cidade)"
            className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-fashion-gold"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10"><RefreshCw className="animate-spin text-fashion-gold mx-auto" /></div>
        ) : results.length > 0 ? (
          results.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl flex items-center gap-4"
            >
              {filter === 'users' ? (
                <>
                  <img src={item.avatar_url || `https://picsum.photos/seed/${item.id}/100/100`} className="w-12 h-12 rounded-full border border-fashion-gold/20" alt="" />
                  <div className="flex-1">
                    <p className="font-bold text-sm">@{item.username}</p>
                    <p className="text-[10px] text-zinc-500">{item.fashion_style || 'Estilo não definido'} • {item.address || 'Moçambique'}</p>
                  </div>
                  {item.account_type === 'premium' && <Crown size={16} className="text-fashion-gold" />}
                </>
              ) : (
                <>
                  <img src={item.image_url || item.video_url} className="w-16 h-16 rounded-xl object-cover" alt="" />
                  <div className="flex-1">
                    <p className="text-xs line-clamp-2">{item.caption}</p>
                    <p className="text-[10px] text-fashion-gold mt-1">@{item.profiles?.username}</p>
                  </div>
                </>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 text-zinc-600">
            <Search size={48} className="mx-auto mb-4 opacity-10" />
            <p className="text-sm">Nenhum resultado encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

const NotificationsView = ({ profile }: { profile: Profile | null }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });
      setNotifications(data || []);
      setLoading(false);
      
      // Mark as read
      await supabase.from('notifications').update({ is_read: true }).eq('user_id', profile.id).eq('is_read', false);
    };
    fetchNotifications();
  }, [profile]);

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4 pb-24">
      <h2 className="text-2xl font-display font-bold gold-text-gradient mb-6">Notificações</h2>
      {loading ? (
        <div className="text-center py-10"><RefreshCw className="animate-spin text-fashion-gold mx-auto" /></div>
      ) : notifications.length > 0 ? (
        notifications.map((n) => (
          <div key={n.id} className={`p-4 rounded-2xl border ${n.is_read ? 'bg-zinc-900/30 border-white/5' : 'bg-fashion-gold/5 border-fashion-gold/20'}`}>
            <div className="flex gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${n.type === 'like' ? 'bg-red-500/10 text-red-500' : 'bg-fashion-gold/10 text-fashion-gold'}`}>
                {n.type === 'like' ? <Heart size={18} /> : <Sparkles size={18} />}
              </div>
              <div>
                <p className="text-sm text-zinc-200">{n.content}</p>
                <p className="text-[10px] text-zinc-500 mt-1">{new Date(n.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-20 text-zinc-600">
          <Megaphone size={48} className="mx-auto mb-4 opacity-10" />
          <p className="text-sm">Tudo limpo por aqui!</p>
        </div>
      )}
    </div>
  );
};

const ProfileView = ({ profile, onTabChange, isOtherUser = false }: { profile: Profile | null, onTabChange: (tab: string) => void, isOtherUser?: boolean }) => {
  const [premiumData, setPremiumData] = useState<PremiumData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!profile) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: currUser } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setCurrentUser(currUser);

        if (isOtherUser) {
          const { data: followData } = await supabase
            .from('follows')
            .select('*')
            .eq('follower_id', session.user.id)
            .eq('following_id', profile.id)
            .single();
          setIsFollowing(!!followData);
        }
      }

      const { count: followers } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', profile.id);
      setFollowersCount(followers || 0);

      const { count: following } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', profile.id);
      setFollowingCount(following || 0);

      // If profile is private and not the owner, hide details
      if (isOtherUser && profile.private_profile && !isFollowing) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('premium_data')
        .select('*')
        .eq('user_id', profile.id)
        .single();
      setPremiumData(data);
      setLoading(false);
    };
    fetchProfileData();
  }, [profile, isOtherUser, isFollowing]);

  const handleFollow = async () => {
    if (!profile || !currentUser) return;

    if (isFollowing) {
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', currentUser.id)
        .eq('following_id', profile.id);
      setIsFollowing(false);
      setFollowersCount(prev => prev - 1);
    } else {
      await supabase
        .from('follows')
        .insert({
          follower_id: currentUser.id,
          following_id: profile.id
        });
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
      
      // Create notification
      await supabase.from('notifications').insert({
        user_id: profile.id,
        type: 'follow',
        content: `@${currentUser.username} começou a seguir você!`,
        sender_id: currentUser.id
      });
    }
  };

  const handleMessage = () => {
    if (!profile) return;
    const event = new CustomEvent('select-chat-user', { detail: profile });
    window.dispatchEvent(event);
  };

  if (loading) return (
    <div className="p-6 max-w-2xl mx-auto space-y-8 pb-24">
      <div className="text-center space-y-4">
        <Skeleton className="w-32 h-32 rounded-3xl mx-auto" />
        <div className="space-y-2 flex flex-col items-center">
          <Skeleton className="w-48 h-6" />
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-24 h-6 rounded-full mt-2" />
        </div>
      </div>
    </div>
  );

  if (isOtherUser && profile?.private_profile && !isFollowing) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-8 pb-24 text-center">
        <div className="relative inline-block mb-4">
          <img 
            src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.username}`} 
            className="w-32 h-32 rounded-3xl object-cover border-4 border-fashion-gold/20 grayscale"
            alt="" 
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-3xl">
            <Lock className="text-fashion-gold" size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-display font-bold text-white">@{profile?.username}</h2>
        <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5 space-y-4">
          <Lock className="mx-auto text-zinc-600" size={48} />
          <h3 className="text-lg font-bold text-white">Este Perfil é Privado</h3>
          <p className="text-zinc-500 text-sm">Siga este usuário para ver suas publicações e detalhes luxuosos.</p>
          <button 
            onClick={handleFollow}
            className="gold-gradient px-8 py-3 rounded-2xl text-fashion-black font-bold gold-glow"
          >
            {isFollowing ? 'Seguindo' : 'Seguir'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8 pb-24">
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <img 
            src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.username || profile?.full_name || 'U')}&background=D4AF37&color=000`} 
            className="w-32 h-32 rounded-3xl object-cover border-4 border-fashion-gold/20 shadow-2xl"
            alt="" 
          />
          {profile?.is_verified && (
            <div className="absolute -bottom-2 -right-2 bg-fashion-gold text-fashion-black p-1.5 rounded-xl shadow-lg">
              <CheckCircle2 size={16} />
            </div>
          )}
          {profile?.show_online && (new Date().getTime() - new Date(profile.last_seen || 0).getTime() < 60000) && (
            <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-fashion-black rounded-full" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-white">@{profile?.username}</h2>
          <p className="text-zinc-500 text-sm">{profile?.full_name}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest ${profile?.account_type === 'premium' ? 'bg-fashion-gold text-fashion-black' : 'bg-zinc-800 text-zinc-400'}`}>
              {profile?.account_type === 'premium' ? 'Elite Member' : 'Standard Member'}
            </span>
          </div>
        </div>

        {isOtherUser && (
          <div className="flex items-center justify-center gap-3 mt-4">
            <button 
              onClick={handleFollow}
              className={`flex-1 py-3 rounded-2xl font-bold transition-all ${isFollowing ? 'bg-zinc-800 text-zinc-400' : 'gold-gradient text-fashion-black gold-glow'}`}
            >
              {isFollowing ? 'Seguindo' : 'Seguir'}
            </button>
            <button 
              onClick={handleMessage}
              className="p-3 bg-zinc-900/50 border border-white/10 rounded-2xl text-fashion-gold hover:bg-fashion-gold/10 transition-all"
            >
              <MessageSquare size={20} />
            </button>
            <button 
              onClick={() => onTabChange('chat')}
              className="p-3 bg-zinc-900/50 border border-white/10 rounded-2xl text-fashion-gold hover:bg-fashion-gold/10 transition-all"
            >
              <Phone size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900/50 p-4 rounded-2xl text-center border border-white/5">
          <p className="text-xl font-bold text-white">124</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Posts</p>
        </div>
        <div className="bg-zinc-900/50 p-4 rounded-2xl text-center border border-white/5">
          <p className="text-xl font-bold text-white">{followersCount}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Seguidores</p>
        </div>
        <div className="bg-zinc-900/50 p-4 rounded-2xl text-center border border-white/5">
          <p className="text-xl font-bold text-white">{followingCount}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Seguindo</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold gold-text-gradient uppercase tracking-widest">Dados Pessoais</h3>
          {!isOtherUser && <button onClick={() => onTabChange('profile-edit')} className="text-xs text-fashion-gold hover:underline">Editar</button>}
        </div>
        
        <div className="bg-zinc-900/50 rounded-3xl p-6 border border-white/5 space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-zinc-500 text-sm">Telefone</span>
            <span className="text-white text-sm">
              {profile?.hide_phone && isOtherUser ? '•••••••••' : (profile?.phone || 'Não definido')}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-zinc-500 text-sm">Estilo</span>
            <span className="text-white text-sm">{profile?.fashion_style || 'Não definido'}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-zinc-500 text-sm">Localização</span>
            <span className="text-white text-sm">{profile?.address || 'Moçambique'}</span>
          </div>
          
          {premiumData && (
            <>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-zinc-500 text-sm">Idade</span>
                <span className="text-white text-sm">{premiumData.age} anos</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-zinc-500 text-sm">Altura</span>
                <span className="text-white text-sm">{premiumData.height} cm</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-zinc-500 text-sm">BI / Documento</span>
                <span className="text-white text-sm">{premiumData.bi_number}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold gold-text-gradient uppercase tracking-widest">Publicações</h3>
        <div className="grid grid-cols-3 gap-2">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-square bg-zinc-900 rounded-xl overflow-hidden border border-white/5">
              <img src={`https://picsum.photos/seed/post${i}/300/300`} className="w-full h-full object-cover opacity-50" alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MembersView = ({ profile, onSelectUser, onViewProfile }: { profile: Profile | null, onSelectUser: (p: Profile) => void, onViewProfile: (p: Profile) => void }) => {
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  const [selectedMember, setSelectedMember] = useState<Profile | null>(null);
  const [showCallOptions, setShowCallOptions] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!profile) return;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', profile.id)
        .neq('account_type', 'admin')
        .order('last_seen', { ascending: false });
      setMembers(data || []);
      setLoading(false);
    };
    fetchMembers();

    const interval = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  const isOnline = (member: Profile) => {
    if (!member.show_online || !member.last_seen) return false;
    const lastSeen = new Date(member.last_seen).getTime();
    return (now.getTime() - lastSeen) < 60000;
  };

  const onlineCount = members.filter(isOnline).length;

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold gold-text-gradient">Membros da Comunidade</h2>
        <span className="bg-fashion-gold/10 text-fashion-gold px-3 py-1 rounded-full text-[10px] font-bold">{onlineCount} Online</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-10"><RefreshCw className="animate-spin text-fashion-gold mx-auto" /></div>
        ) : members.map((member) => (
          <motion.div
            key={member.id}
            whileHover={{ scale: 1.02 }}
            className="bg-zinc-900/50 border border-white/5 p-4 rounded-3xl flex items-center gap-4 group cursor-pointer"
            onClick={() => setSelectedMember(member)}
          >
            <div className="relative">
              <img src={member.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.username || 'U')}&background=D4AF37&color=000`} className="w-16 h-16 rounded-2xl object-cover border-2 border-fashion-gold/20" alt="" />
              {isOnline(member) && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-fashion-black rounded-full shadow-lg shadow-green-500/20" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-fashion-white">@{member.username}</p>
                {member.account_type === 'premium' && <Crown size={14} className="text-fashion-gold" />}
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">{member.fashion_style || 'Membro'} • {member.address || 'Moçambique'}</p>
              <div className="flex gap-2 mt-2">
                <span className={`text-[8px] ${member.account_type === 'premium' ? 'bg-fashion-gold/10 text-fashion-gold' : 'bg-zinc-800 text-zinc-500'} px-2 py-0.5 rounded-full uppercase tracking-widest font-bold`}>
                  {member.account_type === 'premium' ? 'Elite' : 'Membro'}
                </span>
                {member.is_verified && <span className="text-[8px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">Verificado</span>}
              </div>
            </div>
            <button className="p-3 bg-fashion-gold/10 text-fashion-gold rounded-2xl group-hover:bg-fashion-gold group-hover:text-fashion-black transition-all">
              <MoreHorizontal size={20} />
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedMember && !showCallOptions && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 z-[100] flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedMember(null)}
          >
            <div 
              className="w-full max-w-md bg-zinc-900 rounded-t-[40px] p-8 space-y-6 border-t border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <img src={selectedMember.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.username || 'U')}&background=D4AF37&color=000`} className="w-24 h-24 rounded-3xl object-cover border-4 border-fashion-gold/20" alt="" />
                <div>
                  <h3 className="text-xl font-bold">@{selectedMember.username}</h3>
                  <p className="text-zinc-500 text-sm">{selectedMember.full_name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => {
                    onViewProfile(selectedMember);
                    setSelectedMember(null);
                  }}
                  className="w-full bg-zinc-800 p-4 rounded-2xl flex items-center gap-3 text-white hover:bg-zinc-700 transition-all"
                >
                  <User className="text-fashion-gold" size={20} />
                  <span className="font-bold">Ver Perfil</span>
                </button>
                <button 
                  onClick={() => {
                    onSelectUser(selectedMember);
                    setSelectedMember(null);
                  }}
                  className="w-full bg-zinc-800 p-4 rounded-2xl flex items-center gap-3 text-white hover:bg-zinc-700 transition-all"
                >
                  <MessageSquare className="text-fashion-gold" size={20} />
                  <span className="font-bold">Enviar Mensagem</span>
                </button>
                <button 
                  onClick={() => {
                    setShowCallOptions(true);
                  }}
                  className="w-full bg-zinc-800 p-4 rounded-2xl flex items-center gap-3 text-white hover:bg-zinc-700 transition-all"
                >
                  <Phone className="text-fashion-gold" size={20} />
                  <span className="font-bold">Fazer Chamada</span>
                </button>
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="w-full p-4 text-zinc-500 font-bold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCallOptions && selectedMember && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowCallOptions(false)}
          >
            <div 
              className="w-full max-w-xs bg-zinc-900 rounded-[40px] p-8 space-y-8 border border-white/10 text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="space-y-2">
                <h3 className="text-lg font-bold gold-text-gradient">Tipo de Chamada</h3>
                <p className="text-zinc-500 text-xs">Selecione como deseja se conectar</p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => {
                    playSound('call');
                    setShowCallOptions(false);
                    setSelectedMember(null);
                  }}
                  className="w-full py-4 bg-zinc-800 rounded-2xl flex items-center justify-center gap-3 hover:bg-fashion-gold hover:text-fashion-black transition-all font-bold text-sm"
                >
                  <Mic size={20} />
                  Chamada de Voz
                </button>
                <button 
                  onClick={() => {
                    playSound('call');
                    setShowCallOptions(false);
                    setSelectedMember(null);
                  }}
                  className="w-full py-4 bg-fashion-gold text-fashion-black rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all font-bold text-sm"
                >
                  <Video size={20} />
                  Vídeo Chamada
                </button>
              </div>

              <button 
                onClick={() => setShowCallOptions(false)}
                className="text-zinc-500 text-xs font-bold uppercase tracking-widest"
              >
                Voltar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GlobalChat = ({ profile }: { profile: Profile | null }) => {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('group_messages')
        .select('*, sender:profiles(*)')
        .order('created_at', { ascending: true })
        .limit(50);
      setMessages(data || []);
      setLoading(false);
      scrollToBottom();
    };
    fetchMessages();

    const subscription = supabase
      .channel('global-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'group_messages' }, async (payload) => {
        const { data: msg } = await supabase
          .from('group_messages')
          .select('*, sender:profiles(*)')
          .eq('id', payload.new.id)
          .single();
        if (msg) {
          setMessages(prev => {
            if (prev.some(m => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          scrollToBottom();
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !profile) return;

    const { error } = await supabase.from('group_messages').insert({
      sender_id: profile.id,
      content: newMessage,
      type: 'text'
    });

    if (!error) setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] pb-24">
      <div className="p-4 border-b border-white/5 bg-fashion-gold/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center gold-glow">
            <Crown size={20} className="text-fashion-black" />
          </div>
          <div>
            <h3 className="font-display font-bold gold-text-gradient">Chat Global Elite</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Todos os membros conectados</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center py-10"><RefreshCw className="animate-spin text-fashion-gold mx-auto" /></div>
        ) : messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.sender_id === profile?.id ? 'flex-row-reverse' : ''}`}>
              <div className="relative">
                <img src={msg.sender?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender?.username || 'U')}&background=D4AF37&color=000`} className="w-8 h-8 rounded-full border border-fashion-gold/20" alt="" />
                {msg.sender && msg.sender.show_online && msg.sender.last_seen && (new Date().getTime() - new Date(msg.sender.last_seen).getTime() < 60000) && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-fashion-black rounded-full" />
                )}
              </div>
              <div className={`max-w-[70%] ${msg.sender_id === profile?.id ? 'items-end' : ''}`}>
                <div className="flex items-center gap-2 mb-1 px-2">
                  <p className="text-[10px] text-zinc-500">@{msg.sender?.username} {msg.sender?.account_type === 'admin' && '👑'}</p>
                  {profile?.account_type === 'admin' && (
                    <button 
                      onClick={async () => {
                        if (confirm('Remover mensagem?')) {
                          await supabase.from('group_messages').delete().eq('id', msg.id);
                          setMessages(messages.filter(m => m.id !== msg.id));
                        }
                      }}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 size={10} />
                    </button>
                  )}
                </div>
                <div className={`p-3 rounded-2xl text-sm ${msg.sender_id === profile?.id ? 'bg-fashion-gold text-fashion-black rounded-tr-none' : 'bg-zinc-900 text-zinc-200 rounded-tl-none'}`}>
                  {msg.content}
                </div>
                <p className="text-[8px] text-zinc-600 mt-1 px-2">{new Date(msg.created_at).toLocaleTimeString()}</p>
              </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-zinc-900/50 flex gap-2">
        <input
          type="text"
          placeholder="Mensagem para o grupo..."
          className="flex-1 bg-fashion-black border border-white/10 rounded-full px-4 py-3 text-sm focus:border-fashion-gold outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="bg-fashion-gold text-fashion-black p-3 rounded-full gold-glow">
          <Send size={20} />
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

const ConfirmModal = ({ title, message, onConfirm, onCancel }: { title: string, message: string, onConfirm: () => void, onCancel: () => void }) => (
  <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-full max-w-sm premium-card p-6 text-center"
    >
      <AlertCircle size={48} className="text-fashion-gold mx-auto mb-4" />
      <h3 className="text-xl font-display font-bold gold-text-gradient mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 mb-6">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-3 bg-zinc-800 rounded-xl text-xs font-bold text-zinc-400">CANCELAR</button>
        <button onClick={onConfirm} className="flex-1 py-3 gold-gradient rounded-xl text-xs font-bold text-fashion-black gold-glow">CONFIRMAR</button>
      </div>
    </motion.div>
  </div>
);

const Ranking = () => {
  const [topModels, setTopModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<string | null>(null);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    const { data } = await supabase
      .from('profiles')
      .select(`
        *,
        votes:votes(count)
      `)
      .eq('account_type', 'premium')
      .order('full_name', { ascending: true });

    if (data) {
      const sorted = data.sort((a, b) => (b.votes?.[0]?.count || 0) - (a.votes?.[0]?.count || 0));
      setTopModels(sorted);
    }
    setLoading(false);
  };

  const handleVote = async (modelId: string) => {
    setVoting(modelId);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { error } = await supabase.from('votes').insert({
        voter_id: user.id,
        candidate_id: modelId
      });

      if (error) {
        if (error.code === '23505') alert('Você já votou nesta modelo esta semana!');
        else alert('Erro ao votar');
      } else {
        alert('Voto registrado com sucesso!');
        fetchRanking();
      }
    } finally {
      setVoting(null);
    }
  };

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
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xl font-display font-bold text-fashion-gold">{model.votes?.[0]?.count || 0}</p>
                  <p className="text-[8px] text-zinc-500 uppercase tracking-widest">Votos</p>
                </div>
                <button 
                  onClick={() => handleVote(model.id)}
                  disabled={voting === model.id}
                  className="p-3 bg-fashion-gold/10 text-fashion-gold rounded-xl hover:bg-fashion-gold hover:text-fashion-black transition-all disabled:opacity-50"
                >
                  {voting === model.id ? <RefreshCw size={18} className="animate-spin" /> : <ThumbsUp size={18} />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const Chat = ({ profile, onCall, recipient }: { profile: Profile | null, onCall: () => void, recipient?: Profile | null }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<{ profile: Profile, lastMessage: Message }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allMembers, setAllMembers] = useState<Profile[]>([]);
  const [view, setView] = useState<'list' | 'chat'>('list');

  useEffect(() => {
    if (recipient) {
      setView('chat');
    } else {
      setView('list');
    }
  }, [recipient]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!profile) return;
      
      // Fetch all messages involving the user
      const { data: msgs } = await supabase
        .from('messages')
        .select('*, sender:profiles(*), receiver:profiles(*)')
        .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
        .order('created_at', { ascending: false });

      if (msgs) {
        const convMap = new Map<string, { profile: Profile, lastMessage: Message }>();
        msgs.forEach(m => {
          const otherUser = m.sender_id === profile.id ? m.receiver : m.sender;
          if (otherUser && otherUser.id !== '00000000-0000-0000-0000-000000000000') {
            if (!convMap.has(otherUser.id)) {
              convMap.set(otherUser.id, { profile: otherUser as Profile, lastMessage: m });
            }
          }
        });
        setConversations(Array.from(convMap.values()));
      }
      setLoading(false);
    };

    const fetchMembers = async () => {
      const { data } = await supabase.from('profiles').select('*').limit(1000);
      setAllMembers(data || []);
    };

    fetchConversations();
    fetchMembers();

    // Subscribe to messages for real-time updates and sounds
    const sub = supabase
      .channel('chat-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        const newMsg = payload.new as Message;
        if (newMsg.receiver_id === profile?.id) {
          playSound('message');
        }
        fetchConversations();
      })
      .subscribe();

    return () => { sub.unsubscribe(); };
  }, [profile?.id]);

  useEffect(() => {
    if (view === 'chat' && profile) {
      const fetchMessages = async () => {
        let query = supabase
          .from('messages')
          .select('*, sender:profiles(*)')
          .order('created_at', { ascending: true });
        
        if (recipient) {
          query = query.or(`and(sender_id.eq.${profile.id},receiver_id.eq.${recipient.id}),and(sender_id.eq.${recipient.id},receiver_id.eq.${profile.id})`);
        } else {
          query = query.eq('receiver_id', '00000000-0000-0000-0000-000000000000');
        }

        const { data } = await query;
        setMessages(data || []);
      };
      fetchMessages();

      const sub = supabase
        .channel('chat-room')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
          const newMsgRaw = payload.new as Message;
          const isGlobal = newMsgRaw.receiver_id === '00000000-0000-0000-0000-000000000000';
          const isRelevant = recipient 
            ? ((newMsgRaw.sender_id === profile.id && newMsgRaw.receiver_id === recipient.id) || 
               (newMsgRaw.sender_id === recipient.id && newMsgRaw.receiver_id === profile.id))
            : isGlobal;

          if (isRelevant) {
            // Fetch full message with sender profile
            const { data: newMsg } = await supabase
              .from('messages')
              .select('*, sender:profiles(*)')
              .eq('id', newMsgRaw.id)
              .single();

            if (newMsg) {
              setMessages(prev => {
                if (prev.some(m => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
              });
              
              // Mark as read if we are the receiver
              if (newMsg.receiver_id === profile.id) {
                await supabase.from('messages').update({ is_read: true }).eq('id', newMsg.id);
              }
            }
          }
        })
        .subscribe();

      return () => { sub.unsubscribe(); };
    }
  }, [view, recipient, profile?.id]);

  const filteredConversations = conversations.filter(c => 
    c.profile.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.profile.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMembers = allMembers.filter(m => 
    m.id !== profile?.id &&
    (m.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.full_name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (view === 'list') {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] max-w-2xl mx-auto bg-fashion-black">
        <div className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Procurar membros..."
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:border-fashion-gold outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filteredMembers.map(m => {
              const hasUnread = conversations.find(c => c.profile.id === m.id)?.lastMessage.is_read === false && 
                               conversations.find(c => c.profile.id === m.id)?.lastMessage.receiver_id === profile?.id;
              return (
                <button 
                  key={m.id} 
                  onClick={() => window.dispatchEvent(new CustomEvent('select-chat-user', { detail: m }))}
                  className="flex flex-col items-center gap-1 min-w-[70px]"
                >
                  <div className="relative">
                    <img src={m.avatar_url || `https://ui-avatars.com/api/?name=${m.username}`} className="w-14 h-14 rounded-2xl object-cover border border-white/10" alt="" />
                    {m.show_online && (new Date().getTime() - new Date(m.last_seen || 0).getTime() < 60000) && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-fashion-black rounded-full" />
                    )}
                    {hasUnread && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-fashion-black rounded-full animate-pulse" />
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-300 truncate w-14 text-center">@{m.username}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-2">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-2">Conversas Recentes</h3>
          {filteredConversations.length > 0 ? (
            filteredConversations.map(conv => (
              <button 
                key={conv.profile.id}
                onClick={() => {
                  // This is handled by App component usually, but we can trigger it here if needed
                  // For now we assume the App component handles recipient state
                  window.dispatchEvent(new CustomEvent('select-chat-user', { detail: conv.profile }));
                }}
                className="w-full flex items-center gap-4 p-4 bg-zinc-900/50 rounded-3xl border border-white/5 hover:border-fashion-gold/30 transition-all"
              >
                <div className="relative">
                  <img src={conv.profile.avatar_url || `https://ui-avatars.com/api/?name=${conv.profile.username}`} className="w-14 h-14 rounded-2xl object-cover" alt="" />
                  {conv.profile.show_online && (new Date().getTime() - new Date(conv.profile.last_seen || 0).getTime() < 60000) && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-fashion-black rounded-full" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-white text-sm">@{conv.profile.username}</h4>
                    <span className="text-[10px] text-zinc-500">{new Date(conv.lastMessage.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className="text-xs text-zinc-400 truncate max-w-[200px]">
                    {conv.lastMessage.sender_id === profile?.id ? 'Você: ' : ''}
                    {conv.lastMessage.type === 'text' ? conv.lastMessage.content : `[${conv.lastMessage.type}]`}
                  </p>
                </div>
                {!conv.lastMessage.is_read && conv.lastMessage.receiver_id === profile?.id && (
                  <div className="w-2 h-2 bg-fashion-gold rounded-full" />
                )}
              </button>
            ))
          ) : searchQuery && filteredMembers.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs text-zinc-500 ml-2">Membros encontrados:</p>
              {filteredMembers.map(m => (
                <button 
                  key={m.id}
                  onClick={() => window.dispatchEvent(new CustomEvent('select-chat-user', { detail: m }))}
                  className="w-full flex items-center gap-4 p-4 bg-zinc-900/30 rounded-3xl border border-white/5"
                >
                  <img src={m.avatar_url || `https://ui-avatars.com/api/?name=${m.username}`} className="w-12 h-12 rounded-2xl object-cover" alt="" />
                  <div className="text-left">
                    <h4 className="font-bold text-white text-sm">@{m.username}</h4>
                    <p className="text-xs text-zinc-500">{m.full_name}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 opacity-30">
              <MessageSquare size={48} className="mx-auto mb-4" />
              <p className="text-sm">Nenhuma conversa ainda</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const sendMessage = async (type: Message['type'] = 'text', mediaUrl?: string) => {
    if ((!newMessage.trim() && !mediaUrl) || !profile) return;

    const messageData = {
      sender_id: profile.id,
      receiver_id: recipient?.id || '00000000-0000-0000-0000-000000000000',
      content: type === 'text' ? newMessage : null,
      type,
      media_url: mediaUrl || null
    };

    const tempId = Math.random().toString();
    const optimisticMsg: Message = { ...messageData, id: tempId, created_at: new Date().toISOString(), is_read: false };
    setMessages(prev => [...prev, optimisticMsg]);
    setNewMessage('');

    const { error } = await supabase.from('messages').insert(messageData);
    if (error) {
      alert('Erro ao enviar mensagem');
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } else if (recipient) {
      // Create notification for recipient
      await createNotification(
        recipient.id, 
        'system', 
        `Nova mensagem de @${profile.username}: ${type === 'text' ? newMessage : `[${type}]`}`,
        'chat'
      );
    }
  };

  const handleFileUpload = async (type: Message['type']) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'photo' ? 'image/*' : type === 'video' ? 'video/*' : '*/*';
    
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      try {
        const url = await uploadFile(file, 'chat');
        sendMessage(type, url);
      } catch (err) {
        console.error(err);
        alert('Erro ao carregar arquivo');
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  const toggleRecording = () => {
    if (isRecording) {
      sendMessage('audio', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    }
    setIsRecording(!isRecording);
  };

  const deleteMessage = async (msgId: string, createdAt: string) => {
    if (!profile) return;
    const now = new Date();
    const msgTime = new Date(createdAt);
    const diffMins = (now.getTime() - msgTime.getTime()) / 60000;

    if (diffMins <= 10) {
      if (confirm('Deseja apagar esta mensagem para todos?')) {
        await supabase.from('messages').delete().eq('id', msgId);
        setMessages(prev => prev.filter(m => m.id !== msgId));
      }
    } else {
      if (confirm('Deseja apagar esta mensagem para você?')) {
        // In a real app we would have a 'deleted_for' array or similar
        // For now we just remove it from the local state
        setMessages(prev => prev.filter(m => m.id !== msgId));
      }
    }
  };

  const MessageStatus = ({ msg }: { msg: Message }) => {
    if (msg.sender_id !== profile?.id) return null;
    
    const isOnline = recipient?.show_online && (new Date().getTime() - new Date(recipient.last_seen || 0).getTime() < 60000);
    
    if (msg.is_read) {
      return <CheckCheck size={12} className="text-green-500" />;
    }
    if (isOnline) {
      return <CheckCheck size={12} className="text-zinc-500" />;
    }
    return <Check size={12} className="text-zinc-500" />;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-2xl mx-auto bg-fashion-black">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <button onClick={() => window.dispatchEvent(new CustomEvent('select-chat-user', { detail: null }))} className="p-2 text-zinc-400">
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <div className="relative">
            <img 
              src={recipient?.avatar_url || `https://ui-avatars.com/api/?name=${recipient?.username || 'G'}`} 
              className="w-10 h-10 rounded-2xl object-cover border border-fashion-gold/20"
              alt="" 
            />
            {recipient?.show_online && (new Date().getTime() - new Date(recipient.last_seen || 0).getTime() < 60000) && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-fashion-black rounded-full" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">@{recipient?.username || 'Global Chat'}</h3>
            <p className="text-[10px] text-zinc-500">
              {recipient?.show_online && (new Date().getTime() - new Date(recipient.last_seen || 0).getTime() < 60000) ? 'Online agora' : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onCall} className="p-2 text-fashion-gold hover:bg-fashion-gold/10 rounded-xl transition-all"><Phone size={20} /></button>
          <button onClick={onCall} className="p-2 text-fashion-gold hover:bg-fashion-gold/10 rounded-xl transition-all"><Video size={20} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex group ${msg.sender_id === profile?.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender_id === profile?.id ? 'bg-fashion-gold text-fashion-black' : 'bg-zinc-800 text-zinc-200'}`}>
              {!recipient && msg.sender_id !== profile?.id && (
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[10px] font-bold opacity-70">@{msg.sender?.username || 'user'}</p>
                </div>
              )}
              
              {msg.type === 'text' && <p className="text-sm">{msg.content}</p>}
              {msg.type === 'photo' && <img src={msg.media_url!} className="rounded-lg max-w-full" alt="" />}
              {msg.type === 'video' && <video src={msg.media_url!} controls className="rounded-lg max-w-full" />}
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
                <a href={msg.media_url!} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-black/10 p-2 rounded-lg">
                  <FileText size={20} />
                  <span className="text-xs truncate">Ver Documento</span>
                </a>
              )}

              <div className="flex justify-end gap-1 mt-1">
                <span className="text-[8px] opacity-50">{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                <MessageStatus msg={msg} />
                {msg.sender_id === profile?.id && (
                  <button 
                    onClick={() => deleteMessage(msg.id, msg.created_at)}
                    className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={10} className="text-red-500" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {uploading && (
          <div className="flex justify-end">
            <div className="bg-fashion-gold/20 p-3 rounded-2xl animate-pulse flex items-center gap-2">
              <Sparkles size={16} className="text-fashion-gold animate-spin" />
              <span className="text-xs text-fashion-gold">Enviando...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-fashion-zinc/50 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button onClick={() => handleFileUpload('photo')} className="p-2 text-zinc-500 hover:text-fashion-gold"><ImageIcon size={20} /></button>
            <button onClick={() => handleFileUpload('video')} className="p-2 text-zinc-500 hover:text-fashion-gold"><Video size={20} /></button>
            <button onClick={() => handleFileUpload('document')} className="p-2 text-zinc-500 hover:text-fashion-gold"><Plus size={20} /></button>
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
            onClick={() => sendMessage()}
            className="p-3 bg-fashion-gold text-fashion-black rounded-2xl shadow-lg shadow-fashion-gold/20 active:scale-95 transition-all"
          >
            <Send size={20} />
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
  const [confirmAction, setConfirmAction] = useState<{ title: string, message: string, onConfirm: () => void } | null>(null);

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
    setConfirmAction({
      title: 'Remover Usuário',
      message: 'Tem certeza que deseja remover este usuário permanentemente?',
      onConfirm: async () => {
        await supabase.from('profiles').delete().eq('id', userId);
        fetchData();
        setConfirmAction(null);
      }
    });
  };

  const makeAdmin = async (userId: string) => {
    setConfirmAction({
      title: 'Promover a Admin',
      message: 'Deseja tornar este usuário um Administrador do sistema?',
      onConfirm: async () => {
        await supabase.from('profiles').update({ account_type: 'admin' }).eq('id', userId);
        fetchData();
        setConfirmAction(null);
      }
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 pb-24">
      <AnimatePresence>
        {confirmAction && (
          <ConfirmModal 
            title={confirmAction.title}
            message={confirmAction.message}
            onConfirm={confirmAction.onConfirm}
            onCancel={() => setConfirmAction(null)}
          />
        )}
      </AnimatePresence>

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
            <BarChart3 size={24} className="text-fashion-gold mx-auto mb-2 opacity-50" />
            <p className="text-4xl font-display font-bold text-fashion-gold">{stats.total}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">Usuários Totais</p>
          </div>
          <div className="premium-card p-6 text-center">
            <Crown size={24} className="text-fashion-gold mx-auto mb-2 opacity-50" />
            <p className="text-4xl font-display font-bold text-fashion-gold">{stats.premium}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">Membros Premium</p>
          </div>
          <div className="premium-card p-6 text-center">
            <CheckCircle2 size={24} className="text-fashion-gold mx-auto mb-2 opacity-50" />
            <p className="text-4xl font-display font-bold text-fashion-gold">{stats.verified}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">Contas Verificadas</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10"><Sparkles className="animate-spin text-fashion-gold mx-auto" /></div>
          ) : users.map((user) => (
            <div key={user.id} className="premium-card p-4 flex items-center justify-between group hover:border-fashion-gold/50 transition-all">
              <div className="flex items-center gap-3">
                <img src={user.avatar_url || `https://picsum.photos/seed/${user.id}/100/100`} className="w-10 h-10 rounded-full object-cover border border-white/10" alt="" />
                <div>
                  <p className="text-sm font-bold flex items-center gap-1">
                    {user.full_name}
                    {user.is_verified && <CheckCircle2 size={14} className="text-blue-400" />}
                  </p>
                  <p className="text-[10px] text-zinc-500">@{user.username} • {user.account_type}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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

function ReelItem({ reel, isActive, profile, onRemove, onViewProfile }: any) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likes_count || 0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(e => console.error('Error playing video:', e));
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  useEffect(() => {
    const checkFollow = async () => {
      if (!profile || !reel.profiles) return;
      const { data } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', profile.id)
        .eq('following_id', reel.profiles.id)
        .single();
      setIsFollowing(!!data);
    };
    checkFollow();
  }, [profile, reel.profiles]);

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile || !reel.profiles) return;

    if (isFollowing) {
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', profile.id)
        .eq('following_id', reel.profiles.id);
      setIsFollowing(false);
    } else {
      await supabase
        .from('follows')
        .insert({
          follower_id: profile.id,
          following_id: reel.profiles.id
        });
      setIsFollowing(true);
      
      await createNotification(
        reel.profiles.id,
        'follow',
        `@${profile.username} começou a seguir você através de um Reel!`,
        'reels'
      );
    }
  };

  const handleLike = async () => {
    if (!profile) return;
    if (isLiked) {
      setLikesCount(prev => prev - 1);
      setIsLiked(false);
      await supabase.from('likes').delete().eq('user_id', profile.id).eq('reel_id', reel.id);
      await supabase.rpc('decrement_reel_likes', { reel_id_param: reel.id });
    } else {
      setLikesCount(prev => prev + 1);
      setIsLiked(true);
      await supabase.from('likes').insert({ user_id: profile.id, reel_id: reel.id });
      await supabase.rpc('increment_reel_likes', { reel_id_param: reel.id });
      
      if (reel.user_id !== profile.id) {
        await createNotification(
          reel.user_id,
          'like',
          `@${profile.username} curtiu seu Reel`,
          'reels'
        );
      }
    }
  };

  return (
    <div className="h-full w-full snap-start relative flex flex-col justify-end">
      {/* Video Content */}
      <div className="absolute inset-0 bg-zinc-900">
        <video 
          ref={videoRef}
          src={reel.video_url} 
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </div>

      {/* Sound Toggle */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* Overlay Content */}
      <div className="relative p-6 pb-24 flex justify-between items-end">
        <div className="flex-1 pr-12">
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-10 h-10 rounded-full gold-gradient p-[1px] cursor-pointer"
              onClick={() => onViewProfile(reel.profiles)}
            >
              <img 
                src={reel.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(reel.profiles?.username || 'U')}&background=D4AF37&color=000`} 
                className="w-full h-full rounded-full object-cover border-2 border-fashion-black"
                alt=""
              />
            </div>
            <div className="cursor-pointer" onClick={() => onViewProfile(reel.profiles)}>
              <p className="font-bold text-sm text-white flex items-center gap-1">
                {reel.profiles?.full_name}
                {reel.profiles?.is_verified && <CheckCircle2 size={14} className="text-fashion-gold" />}
              </p>
              <p className="text-[10px] text-zinc-400">@{reel.profiles?.username}</p>
            </div>
            {profile?.id !== reel.profiles?.id && (
              <button 
                onClick={handleFollow}
                className={`ml-2 px-3 py-1 border rounded-full text-[10px] font-bold transition-all ${isFollowing ? 'bg-white/10 border-white/30 text-white' : 'bg-fashion-gold border-fashion-gold text-fashion-black'}`}
              >
                {isFollowing ? 'Seguindo' : 'Seguir'}
              </button>
            )}
          </div>
          <p className="text-sm text-zinc-200 mb-4 line-clamp-2">{reel.caption}</p>
          <div className="flex items-center gap-2 text-xs text-fashion-gold">
            <Music size={14} className="animate-pulse" />
            <span className="truncate">{reel.music_name || 'Som Original - BIG LOVA'}</span>
          </div>
        </div>

        <div className="flex flex-col gap-6 items-center">
          {profile?.account_type === 'admin' && (
            <button 
              onClick={() => onRemove(reel.id)}
              className="w-12 h-12 rounded-full bg-red-500/20 backdrop-blur-md flex items-center justify-center text-red-500 hover:bg-red-500 transition-colors"
            >
              <Trash2 size={24} />
            </button>
          )}
          <div className="flex flex-col items-center gap-1">
            <button 
              onClick={handleLike}
              className={`w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center transition-colors ${isLiked ? 'text-red-500' : 'text-white hover:text-red-500'}`}
            >
              <Heart size={28} fill={isLiked ? "currentColor" : "none"} />
            </button>
            <span className="text-[10px] font-bold text-white">{likesCount}</span>
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
  );
}

const Reels = ({ profile, onViewProfile }: { profile: Profile | null, onViewProfile: (p: Profile) => void }) => {
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

    // Real-time subscription for new reels
    const subscription = supabase
      .channel('reels-updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reels' }, async (payload) => {
        const { data: newReel } = await supabase
          .from('reels')
          .select('*, profiles(*)')
          .eq('id', payload.new.id)
          .single();
        
        if (newReel) {
          setReels(prev => {
            if (prev.some(r => r.id === newReel.id)) return prev;
            return [newReel, ...prev];
          });
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const height = e.currentTarget.clientHeight;
    const index = Math.round(scrollTop / height);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const handleRemove = async (id: string) => {
    if (confirm('Remover este Reel?')) {
      await supabase.from('reels').delete().eq('id', id);
      setReels(reels.filter(r => r.id !== id));
    }
  };

  if (loading) return (
    <div className="h-[calc(100vh-70px)] bg-black space-y-4 overflow-hidden">
      <div className="h-full w-full relative flex flex-col justify-end p-6 pb-24">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="relative space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="w-24 h-3" />
              <Skeleton className="w-16 h-2" />
            </div>
          </div>
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-2/3 h-4" />
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="w-32 h-3" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      onScroll={handleScroll}
      className="h-[calc(100vh-70px)] bg-black snap-y snap-mandatory overflow-y-auto scrollbar-hide"
    >
      {reels.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-zinc-500 p-10 text-center">
          <Video size={64} className="mb-4 opacity-20" />
          <h3 className="text-xl font-display gold-text-gradient mb-2">Nenhum Reel ainda</h3>
          <p className="text-sm">Seja o primeiro a brilhar na passarela vertical!</p>
        </div>
      ) : reels.map((reel, index) => (
        <ReelItem 
          key={reel.id} 
          reel={reel} 
          isActive={index === activeIndex} 
          profile={profile}
          onRemove={handleRemove}
          onViewProfile={onViewProfile}
        />
      ))}
    </div>
  );
};

const PremiumOverlay = ({ onUpgrade }: { onUpgrade: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 z-[70] bg-fashion-black/95 backdrop-blur-xl flex items-center justify-center p-6 text-center"
  >
    <div className="max-w-xs space-y-6">
      <div className="w-24 h-24 gold-gradient rounded-full flex items-center justify-center gold-glow mx-auto">
        <Crown size={48} className="text-fashion-black" />
      </div>
      <h2 className="text-3xl font-display font-bold gold-text-gradient">Acesso Restrito</h2>
      <p className="text-zinc-400 text-sm leading-relaxed">
        Apenas membros <span className="text-fashion-gold font-bold">ELITE</span> têm acesso a esta funcionalidade. 
        Torne-se premium para publicar, conversar, fazer chamadas e muito mais!
      </p>
      <div className="space-y-3">
        <button 
          onClick={onUpgrade}
          className="w-full gold-gradient py-4 rounded-2xl text-fashion-black font-bold gold-glow uppercase tracking-widest text-xs"
        >
          Tornar-se Elite Agora
        </button>
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Acesso total garantido</p>
      </div>
    </div>
  </motion.div>
);

const SettingsView = ({ profile, setProfile, onTabChange, onShowTerms }: { profile: Profile | null, setProfile: (p: Profile | null) => void, onTabChange: (tab: string) => void, onShowTerms: () => void }) => {
  const [adminExists, setAdminExists] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const updatePrivacy = async (key: string, value: boolean) => {
    if (!profile) return;
    
    // Optimistic update
    const previousProfile = { ...profile };
    setProfile({ ...profile, [key]: value });

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [key]: value })
        .eq('id', profile.id);
      
      if (error) throw error;
    } catch (error: any) {
      // Rollback on error
      setProfile(previousProfile);
      alert('Erro ao atualizar: ' + error.message);
    }
  };

  const becomeAdmin = async () => {
    if (adminExists) {
      alert('Já existe um administrador no sistema.');
      return;
    }
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
    <div className="p-6 max-w-lg mx-auto space-y-6 pb-24">
      <h2 className="text-2xl font-display font-bold mb-6">Configurações</h2>
      
      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 ml-2">Conta</p>
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
              <span>Tornar-se Elite (Premium)</span>
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
            className="w-full bg-zinc-900 border border-dashed border-fashion-gold/30 p-4 rounded-2xl flex items-center justify-between hover:bg-fashion-gold/5 transition-all"
          >
            <div className="flex items-center gap-3 text-zinc-400">
              <ShieldCheck size={20} />
              <span>Registrar como Administrador</span>
            </div>
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 ml-2">Privacidade</p>
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <Lock size={18} className="text-zinc-500" />
              <div className="flex flex-col">
                <span className="text-sm">Perfil Privado</span>
                <span className="text-[10px] text-zinc-500">{profile?.private_profile ? 'Ligado' : 'Desligado'}</span>
              </div>
            </div>
            <button 
              disabled={loading}
              onClick={() => updatePrivacy('private_profile', !profile?.private_profile)}
              className={`w-10 h-5 rounded-full transition-all relative ${profile?.private_profile ? 'bg-fashion-gold' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${profile?.private_profile ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
          <div className="p-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-zinc-500" />
              <div className="flex flex-col">
                <span className="text-sm">Ocultar Telemóvel</span>
                <span className="text-[10px] text-zinc-500">{profile?.hide_phone ? 'Ligado' : 'Desligado'}</span>
              </div>
            </div>
            <button 
              disabled={loading}
              onClick={() => updatePrivacy('hide_phone', !profile?.hide_phone)}
              className={`w-10 h-5 rounded-full transition-all relative ${profile?.hide_phone ? 'bg-fashion-gold' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${profile?.hide_phone ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-zinc-500" />
              <div className="flex flex-col">
                <span className="text-sm">Mostrar Online</span>
                <span className="text-[10px] text-zinc-500">{profile?.show_online ? 'Ligado' : 'Desligado'}</span>
              </div>
            </div>
            <button 
              disabled={loading}
              onClick={() => updatePrivacy('show_online', !profile?.show_online)}
              className={`w-10 h-5 rounded-full transition-all relative ${profile?.show_online ? 'bg-fashion-gold' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${profile?.show_online ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-4">
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-zinc-500" />
              <div className="flex flex-col">
                <span className="text-sm">Notificações</span>
                <span className="text-[10px] text-zinc-500">{profile?.notifications_enabled ? 'Ligado' : 'Desligado'}</span>
              </div>
            </div>
            <button 
              onClick={() => updatePrivacy('notifications_enabled', !profile?.notifications_enabled)}
              className={`w-10 h-5 rounded-full transition-all relative ${profile?.notifications_enabled ? 'bg-fashion-gold' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${profile?.notifications_enabled ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>
        <button 
          onClick={() => supabase.auth.signOut()}
          className="w-full bg-red-500/10 text-red-500 p-4 rounded-2xl flex items-center justify-center gap-2 font-bold"
        >
          <LogOut size={18} />
          Sair da Conta
        </button>
      </div>

      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 ml-2">Suporte e Legal</p>
        <button 
          onClick={() => window.open(`https://wa.me/${SUPPORT_WHATSAPP}`, '_blank')}
          className="w-full bg-zinc-900 border border-white/10 p-4 rounded-2xl flex items-center justify-between hover:border-fashion-gold transition-all"
        >
          <div className="flex items-center gap-3 text-zinc-200">
            <MessageCircle size={20} className="text-fashion-gold" />
            <span>Suporte WhatsApp</span>
          </div>
          <ChevronRight size={18} />
        </button>
        <button 
          onClick={onShowTerms}
          className="w-full bg-zinc-900 border border-white/10 p-4 rounded-2xl flex items-center justify-between hover:border-fashion-gold transition-all"
        >
          <div className="flex items-center gap-3 text-zinc-200">
            <FileText size={20} className="text-fashion-gold" />
            <span>Termos e Privacidade</span>
          </div>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

const CreatePost = ({ onComplete }: { onComplete: () => void }) => {
  const [type, setType] = useState<'post' | 'reel' | 'text'>('post');
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
    if (type !== 'text' && !file && !caption) {
      alert('Adicione uma mídia ou legenda!');
      return;
    }
    if (type === 'text' && !caption) {
      alert('Escreva algo para publicar!');
      return;
    }
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let mediaUrl = '';
      if (file) {
        // Optimization for 4G: Show progress or use faster upload path if available
        // Here we simulate a faster experience by providing better feedback
        mediaUrl = await uploadFile(file, type === 'post' ? 'posts' : 'reels');
      } else if (type === 'post') {
        mediaUrl = 'https://picsum.photos/800/1000';
      }

      if (type === 'post' || type === 'text') {
        await supabase.from('posts').insert({
          user_id: user.id,
          caption,
          image_url: type === 'text' ? null : mediaUrl,
          type: type === 'text' ? 'text' : (file?.type.startsWith('video') ? 'video' : 'photo')
        });
      } else {
        await supabase.from('reels').insert({
          user_id: user.id,
          caption,
          video_url: mediaUrl,
          music_name: 'Fashion Beat - BIG LOVA'
        });
      }

      alert('Publicado com sucesso!');
      onComplete();
    } catch (err) {
      console.error(err);
      alert('Erro ao publicar. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const [uploadProgress, setUploadProgress] = useState(0);
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setUploadProgress(prev => (prev < 90 ? prev + 10 : prev));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setUploadProgress(0);
    }
  }, [loading]);

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6 pb-24">
      <h2 className="text-2xl font-display font-bold gold-text-gradient">Nova Publicação</h2>
      
      <div className="flex gap-2 p-1 bg-zinc-900 rounded-2xl">
        <button 
          onClick={() => { setType('post'); setFile(null); setPreviewUrl(null); }}
          className={`flex-1 py-3 rounded-xl text-[10px] font-bold transition-all ${type === 'post' ? 'bg-fashion-gold text-fashion-black' : 'text-zinc-500'}`}
        >
          POST
        </button>
        <button 
          onClick={() => { setType('reel'); setFile(null); setPreviewUrl(null); }}
          className={`flex-1 py-3 rounded-xl text-[10px] font-bold transition-all ${type === 'reel' ? 'bg-fashion-gold text-fashion-black' : 'text-zinc-500'}`}
        >
          REEL
        </button>
        <button 
          onClick={() => { setType('text'); setFile(null); setPreviewUrl(null); }}
          className={`flex-1 py-3 rounded-xl text-[10px] font-bold transition-all ${type === 'text' ? 'bg-fashion-gold text-fashion-black' : 'text-zinc-500'}`}
        >
          TEXTO
        </button>
      </div>

      {type !== 'text' && (
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
                <p className="text-[10px] mt-2 opacity-50 text-center px-4">Ao selecionar, o arquivo será preparado para publicação imediata</p>
              </>
            )}
            <input 
              type="file" 
              className="hidden" 
              accept="image/*,video/*" 
              onChange={handleFileChange}
            />
          </div>
        </label>
      )}

      <div className="space-y-4">
        <textarea 
          placeholder={type === 'text' ? "O que você está pensando hoje?" : "Escreva uma legenda luxuosa..."}
          className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-sm focus:border-fashion-gold outline-none h-32"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <button 
          onClick={handlePublish}
          disabled={loading}
          className="w-full gold-gradient py-4 rounded-2xl text-fashion-black font-bold gold-glow disabled:opacity-50 flex flex-col items-center justify-center gap-1 overflow-hidden relative"
        >
          {loading && (
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              className="absolute inset-0 bg-white/20"
            />
          )}
          <div className="flex items-center gap-2 relative z-10">
            {loading ? (
              <>
                <RefreshCw className="animate-spin" size={18} />
                {type === 'reel' ? 'Otimizando para 4G...' : 'Publicando...'}
              </>
            ) : 'PUBLICAR AGORA'}
          </div>
        </button>
      </div>
    </div>
  );
};

const Toast = ({ message, onClose }: { message: string, onClose: () => void, key?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -50, scale: 0.9 }}
    className="fixed top-20 left-4 right-4 z-[200] max-w-md mx-auto"
  >
    <div className="bg-fashion-zinc/90 backdrop-blur-xl border border-fashion-gold/30 p-4 rounded-2xl shadow-2xl flex items-center gap-4 gold-glow">
      <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center shrink-0">
        <Bell size={20} className="text-fashion-black" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-fashion-gold uppercase tracking-widest mb-1">Notificação</p>
        <p className="text-xs text-zinc-200 line-clamp-2">{message}</p>
      </div>
      <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
        <X size={20} />
      </button>
    </div>
  </motion.div>
);

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedChatUser, setSelectedChatUser] = useState<Profile | null>(null);
  const [viewingProfile, setViewingProfile] = useState<Profile | null>(null);
  const [calling, setCalling] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [showTerms, setShowTerms] = useState(false);
  const [toasts, setToasts] = useState<{ id: string, message: string }[]>([]);

  const addToast = (message: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
        }
        setProfile(data);
      };
      fetchProfile();

      // Update online status
      const updateOnlineStatus = async () => {
        // Only update if show_online is true or not explicitly false
        const { data: currentProfile } = await supabase.from('profiles').select('show_online').eq('id', session.user.id).single();
        if (currentProfile?.show_online === false) return;
        
        await supabase.from('profiles').update({ last_seen: new Date().toISOString() }).eq('id', session.user.id);
      };
      updateOnlineStatus();
      const interval = setInterval(updateOnlineStatus, 30000); // Every 30s

      // Fetch unread notifications
      const fetchUnread = async () => {
        const { count } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id)
          .eq('is_read', false);
        setUnreadNotifications(count || 0);
      };
      fetchUnread();

      // Real-time profile updates
      const profileSub = supabase
        .channel(`profile-${session.user.id}`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'profiles', 
          filter: `id=eq.${session.user.id}` 
        }, payload => {
          setProfile(payload.new as Profile);
        })
        .subscribe();

      // Real-time notifications
      const notifSub = supabase
        .channel(`notifs-${session.user.id}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications', 
          filter: `user_id=eq.${session.user.id}` 
        }, (payload) => {
          setUnreadNotifications(prev => prev + 1);
          const newNotif = payload.new as Notification;
          if (profile?.notifications_enabled) {
            playSound('notification');
            addToast(newNotif.content);
          }
        })
        .subscribe();

      return () => {
        profileSub.unsubscribe();
        notifSub.unsubscribe();
        clearInterval(interval);
      };
    }
  }, [session]);

  const openWhatsApp = () => {
    const text = encodeURIComponent("Olá, preciso de ajuda com o BIG LOVA-FASHION");
    window.open(`https://wa.me/${SUPPORT_WHATSAPP}?text=${text}`, '_blank');
  };

  useEffect(() => {
    // Custom event listener for chat selection from ChatList
    const handleSelectChat = (e: any) => {
      setSelectedChatUser(e.detail);
      setActiveTab('chat');
    };
    window.addEventListener('select-chat-user', handleSelectChat);

    return () => { 
      window.removeEventListener('select-chat-user', handleSelectChat);
    };
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleCall = () => {
    setCalling(true);
  };

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;
  if (authLoading) return (
    <div className="min-h-screen bg-fashion-black flex items-center justify-center">
      <RefreshCw size={48} className="text-fashion-gold animate-spin" />
    </div>
  );
  if (!session) return <Auth onShowTerms={() => setShowTerms(true)} />;

  return (
    <div className="min-h-screen bg-fashion-black text-fashion-white selection:bg-fashion-gold selection:text-fashion-black">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast 
            key={toast.id} 
            message={toast.message} 
            onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} 
          />
        ))}
        {calling && <VideoCall onEnd={() => setCalling(false)} />}
        {showTerms && <TermsAndPrivacy onClose={() => setShowTerms(false)} />}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-fashion-black/80 backdrop-blur-md border-b border-white/5 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center cursor-pointer" onClick={() => handleTabChange('feed')}>
              <Crown size={18} className="text-fashion-black" />
            </div>
            <h1 className="text-xl font-display font-bold gold-text-gradient tracking-tighter cursor-pointer" onClick={() => handleTabChange('feed')}>BIG LOVA</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleTabChange('notifications')}
              className="relative p-2 text-zinc-500 hover:text-fashion-gold transition-colors"
            >
              <Megaphone size={22} />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-fashion-black">
                  {unreadNotifications}
                </span>
              )}
            </button>
            <button onClick={() => handleTabChange('search')} className="p-2 text-zinc-500 hover:text-fashion-gold transition-colors"><Search size={22} /></button>
            <button 
              onClick={() => handleTabChange('profile')}
              className="w-10 h-10 rounded-2xl border border-fashion-gold/20 overflow-hidden hover:border-fashion-gold transition-all"
            >
              <img 
                src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.username || 'U')}`} 
                className="w-full h-full object-cover"
                alt="" 
              />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto min-h-screen">
        <AnimatePresence mode="wait">
          {activeTab === 'feed' && <Feed profile={profile} onTabChange={handleTabChange} />}
          {activeTab === 'reels' && <Reels profile={profile} onViewProfile={(p) => {
            setViewingProfile(p);
            setActiveTab('other-profile');
          }} />}
          {activeTab === 'chat' && (
            <Chat 
              profile={profile} 
              recipient={selectedChatUser}
              onCall={handleCall} 
            />
          )}
          {activeTab === 'ranking' && <Ranking />}
          {activeTab === 'premium' && <PremiumForm onComplete={() => setActiveTab('feed')} />}
          {activeTab === 'admin' && <AdminPanel />}
          {activeTab === 'settings' && <SettingsView profile={profile} setProfile={setProfile} onTabChange={handleTabChange} onShowTerms={() => setShowTerms(true)} />}
          {activeTab === 'profile-edit' && <ProfileEdit profile={profile} onComplete={() => handleTabChange('settings')} />}
          {activeTab === 'create' && <CreatePost onComplete={() => handleTabChange('feed')} />}
          {activeTab === 'search' && <SearchView profile={profile} />}
          {activeTab === 'notifications' && <NotificationsView profile={profile} />}
          {activeTab === 'members' && <MembersView profile={profile} onSelectUser={(p) => {
            setSelectedChatUser(p);
            setActiveTab('chat');
          }} onViewProfile={(p) => {
            setViewingProfile(p);
            setActiveTab('other-profile');
          }} />}
          {activeTab === 'global-chat' && <GlobalChat profile={profile} />}
          {activeTab === 'profile' && <ProfileView profile={profile} onTabChange={handleTabChange} />}
          {activeTab === 'other-profile' && <ProfileView profile={viewingProfile} onTabChange={handleTabChange} isOtherUser={true} />}
        </AnimatePresence>
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-fashion-black/90 backdrop-blur-xl border-t border-white/10 px-4 py-3 z-[60]">
        <div className="max-w-md mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => {
              handleTabChange('feed');
              setSelectedChatUser(null);
            }}
            className={`flex-shrink-0 p-2 transition-all flex flex-col items-center gap-1 ${activeTab === 'feed' ? 'text-fashion-gold scale-110' : 'text-zinc-600'}`}
          >
            <Home size={20} />
            <span className="text-[8px] font-bold uppercase tracking-tighter">Feed</span>
          </button>
          <button 
            onClick={() => {
              handleTabChange('reels');
              setSelectedChatUser(null);
            }}
            className={`flex-shrink-0 p-2 transition-all flex flex-col items-center gap-1 ${activeTab === 'reels' ? 'text-fashion-gold scale-110' : 'text-zinc-600'}`}
          >
            <Video size={20} />
            <span className="text-[8px] font-bold uppercase tracking-tighter">Reels</span>
          </button>
          <button 
            onClick={() => {
              handleTabChange('members');
              setSelectedChatUser(null);
            }}
            className={`flex-shrink-0 p-2 transition-all flex flex-col items-center gap-1 ${activeTab === 'members' ? 'text-fashion-gold scale-110' : 'text-zinc-600'}`}
          >
            <Users size={20} />
            <span className="text-[8px] font-bold uppercase tracking-tighter">Membros</span>
          </button>
          
          <div className="flex-shrink-0 px-2">
            <button 
              onClick={() => {
                handleTabChange('create');
                setSelectedChatUser(null);
              }}
              className="p-3 gold-gradient text-fashion-black rounded-2xl gold-glow transition-transform active:scale-90"
            >
              <PlusSquare size={20} />
            </button>
          </div>

          <button 
            onClick={() => {
              handleTabChange('global-chat');
              setSelectedChatUser(null);
            }}
            className={`flex-shrink-0 p-2 transition-all flex flex-col items-center gap-1 ${activeTab === 'global-chat' ? 'text-fashion-gold scale-110' : 'text-zinc-600'}`}
          >
            <MessageSquare size={20} />
            <span className="text-[8px] font-bold uppercase tracking-tighter">Global</span>
          </button>
          <button 
            onClick={() => {
              handleTabChange('ranking');
              setSelectedChatUser(null);
            }}
            className={`flex-shrink-0 p-2 transition-all flex flex-col items-center gap-1 ${activeTab === 'ranking' ? 'text-fashion-gold scale-110' : 'text-zinc-600'}`}
          >
            <Trophy size={20} />
            <span className="text-[8px] font-bold uppercase tracking-tighter">Ranking</span>
          </button>
          <button 
            onClick={() => {
              handleTabChange('chat');
              setSelectedChatUser(null);
            }}
            className={`flex-shrink-0 p-2 transition-all flex flex-col items-center gap-1 ${activeTab === 'chat' ? 'text-fashion-gold scale-110' : 'text-zinc-600'}`}
          >
            <MessageCircle size={20} />
            <span className="text-[8px] font-bold uppercase tracking-tighter">Chat</span>
          </button>
          <button 
            onClick={() => {
              handleTabChange('settings');
              setSelectedChatUser(null);
            }}
            className={`flex-shrink-0 p-2 transition-all flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-fashion-gold scale-110' : 'text-zinc-600'}`}
          >
            <Settings size={20} />
            <span className="text-[8px] font-bold uppercase tracking-tighter">Ajustes</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
