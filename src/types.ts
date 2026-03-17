export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  country: string | null;
  address: string | null;
  fashion_style: string | null;
  account_type: 'normal' | 'premium' | 'admin';
  is_verified: boolean;
  private_profile: boolean;
  hide_phone: boolean;
  show_online: boolean;
  notifications_enabled: boolean;
  last_seen: string | null;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'follow' | 'system';
  content: string;
  is_read: boolean;
  created_at: string;
  link?: string;
}

export interface GroupMessage {
  id: string;
  sender_id: string;
  content: string;
  type: 'text' | 'photo' | 'video';
  media_url?: string;
  created_at: string;
  sender?: Profile;
}

export interface PremiumData {
  user_id: string;
  bi_number: string;
  birth_date: string;
  age: number;
  gender: string;
  address: string;
  height: string;
}

export interface Post {
  id: string;
  user_id: string;
  type: 'photo' | 'video';
  image_url: string;
  caption: string | null;
  hashtags: string[] | null;
  likes_count: number;
  created_at: string;
  profiles?: Profile;
}

export interface Reel {
  id: string;
  user_id: string;
  video_url: string;
  caption: string | null;
  music_name: string | null;
  likes_count: number;
  created_at: string;
  profiles?: Profile;
}

export interface Like {
  id: string;
  user_id: string;
  post_id?: string;
  reel_id?: string;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  post_id?: string;
  reel_id?: string;
  content: string;
  created_at: string;
  profiles?: Profile;
}

export interface Story {
  id: string;
  user_id: string;
  image_url: string;
  created_at: string;
  profiles?: Profile;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string | null;
  type: 'text' | 'audio' | 'photo' | 'video' | 'document';
  media_url: string | null;
  is_read: boolean;
  created_at: string;
  sender?: Profile;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Vote {
  id: string;
  voter_id: string;
  candidate_id: string;
  week_number: number;
  year: number;
  created_at: string;
}
