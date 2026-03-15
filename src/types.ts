export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  country: string | null;
  fashion_style: string | null;
  account_type: 'normal' | 'premium' | 'admin';
  is_verified: boolean;
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
  type: 'text' | 'audio' | 'photo' | 'video';
  media_url: string | null;
  is_read: boolean;
  created_at: string;
  sender?: Profile;
}

export interface Vote {
  id: string;
  voter_id: string;
  candidate_id: string;
  week_number: number;
  year: number;
  created_at: string;
}
