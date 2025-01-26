import { MetaData } from '@/types/meta';


export enum AssistantCategory {
  Academic = 'academic',
  All = 'all',
  Career = 'career',
  CopyWriting = 'copywriting',
  Design = 'design',
  Education = 'education',
  Emotions = 'emotions',
  Entertainment = 'entertainment',
  Games = 'games',
  General = 'general',
  Life = 'life',
  Marketing = 'marketing',
  Office = 'office',
  Programming = 'programming',
  Translation = 'translation',
}

export enum PluginCategory {
  All = 'all',
  GamingEntertainment = 'gaming-entertainment',
  LifeStyle = 'lifestyle',
  MediaGenerate = 'media-generate',
  ScienceEducation = 'science-education',
  Social = 'social',
  StocksFinance = 'stocks-finance',
  Tools = 'tools',
  WebSearch = 'web-search',
}

export enum DiscoverTab {
  Assistants = 'assistants',
  Home = 'home',
  Models = 'models',
  Plugins = 'plugins',
  Providers = 'providers',
}

// TODO 可能需要修改
export interface ExampleTopic {
  description: string;
  id: string;
  title: string;
}

export enum SortBy {
  MostLiked = 'liked',
  MostUsed = 'used',
  Newest = 'newest',
  Oldest = 'oldest',
  Recommended = 'recommended',
}

export enum TimePeriod {
  All = 'all',
  Day = 'day',
  Month = 'month',
  Week = 'week',
  Year = 'year',
}

export enum AuthorRange {
  Everyone = 'everyone',
  Followed = 'followed',
}

export interface FilterBy {
  author?: AuthorRange;
  content?: number;
  fc?: boolean;
  knowledge?: boolean;
  plugin?: boolean;
  price?: number;
  time?: TimePeriod;
  token?: number;
  vision?: boolean;
}

interface AgentIndexItem {
  author: string;
  createAt: string;
  createdAt: string;
  homepage: string;
  identifier: string;
  meta: {
    avatar: string;
    category: string;
    description: string;
    tags: string[];
    title: string;
  };
}

export interface AgentStoreIndex {
  agents: AgentIndexItem[];
  schemaVersion: number;
}
