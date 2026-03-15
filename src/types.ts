export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  country: string | null;
  fashion_style: string | null;
}

export interface Post {
  id: string;
  user_id: string;
  image_url: string;
  caption: string | null;
  hashtags: string[] | null;
  created_at: string;
  profiles?: Profile;
  likes_count?: number;
  user_has_liked?: boolean;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  sender?: Profile;
}
