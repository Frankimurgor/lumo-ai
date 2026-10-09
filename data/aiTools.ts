// Lumo AI — AI Tools Directory
// All AI tools are hardcoded here. Update this file to add/remove tools.

export type AICategory =
  | 'Chat'
  | 'Image'
  | 'Code'
  | 'Video'
  | 'Audio'
  | 'Research'
  | 'Productivity';

export interface AITool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: AICategory;
  emoji: string;
  color: string;
  comingSoon?: boolean;
  featured?: boolean;
}

export const CATEGORIES: { key: AICategory; label: string; emoji: string }[] = [
  { key: 'Chat',         label: 'Chat',         emoji: '💬' },
  { key: 'Image',        label: 'Image',        emoji: '🎨' },
  { key: 'Code',         label: 'Code',         emoji: '💻' },
  { key: 'Video',        label: 'Video',        emoji: '🎥' },
  { key: 'Audio',        label: 'Audio',        emoji: '🎵' },
  { key: 'Research',     label: 'Research',     emoji: '📚' },
  { key: 'Productivity', label: 'Productivity', emoji: '🛠️' },
];

export const AI_TOOLS: AITool[] = [
  // ═══════════════════════════════════════════════
  // 💬 CHAT / ASSISTANTS
  // ═══════════════════════════════════════════════
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'OpenAI\'s conversational assistant — the gold standard for chat AI.',
    url: 'https://chat.openai.com',
    category: 'Chat',
    emoji: '💬',
    color: '#10A37F',
    featured: true,
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Anthropic\'s thoughtful AI — excellent for long-form writing and analysis.',
    url: 'https://claude.ai',
    category: 'Chat',
    emoji: '🤖',
    color: '#D97706',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    description: 'Google\'s multimodal AI — deeply integrated with Google services.',
    url: 'https://gemini.google.com',
    category: 'Chat',
    emoji: '✨',
    color: '#4285F4',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'Powerful open-model chat AI — free and surprisingly capable.',
    url: 'https://chat.deepseek.com',
    category: 'Chat',
    emoji: '🐋',
    color: '#4D6BFE',
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    description: 'AI search engine with cited sources — great for research questions.',
    url: 'https://perplexity.ai',
    category: 'Chat',
    emoji: '🔍',
    color: '#20808D',
  },
  {
    id: 'grok',
    name: 'Grok',
    description: 'xAI\'s assistant with real-time access to X (Twitter) content.',
    url: 'https://grok.com',
    category: 'Chat',
    emoji: '⚡',
    color: '#000000',
  },
  {
    id: 'copilot',
    name: 'Microsoft Copilot',
    description: 'Microsoft\'s AI assistant — free GPT-4 access with web browsing.',
    url: 'https://copilot.microsoft.com',
    category: 'Chat',
    emoji: '🪟',
    color: '#0078D4',
  },
  {
    id: 'mistral-lechat',
    name: 'Mistral Le Chat',
    description: 'Mistral AI\'s fast European chat assistant.',
    url: 'https://chat.mistral.ai',
    category: 'Chat',
    emoji: '🌬️',
    color: '#FA500F',
  },
  {
    id: 'meta-ai',
    name: 'Meta AI',
    description: 'Meta\'s assistant powered by Llama — free across Meta apps.',
    url: 'https://meta.ai',
    category: 'Chat',
    emoji: '🔵',
    color: '#0866FF',
  },
  {
    id: 'poe',
    name: 'Poe',
    description: 'Quora\'s hub — chat with many models (GPT, Claude, Gemini) in one app.',
    url: 'https://poe.com',
    category: 'Chat',
    emoji: '🎭',
    color: '#5D3FD3',
  },

  // ═══════════════════════════════════════════════
  // 🎨 IMAGE GENERATION
  // ═══════════════════════════════════════════════
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: 'Best-in-class artistic image generation — cinematic and stylized.',
    url: 'https://midjourney.com',
    category: 'Image',
    emoji: '🎨',
    color: '#4A90D9',
  },
  {
    id: 'dalle',
    name: 'DALL·E',
    description: 'OpenAI\'s image generator — accessible through ChatGPT.',
    url: 'https://chat.openai.com',
    category: 'Image',
    emoji: '🖼️',
    color: '#10A37F',
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    description: 'Open-source image model — free to run, deeply customizable.',
    url: 'https://stability.ai',
    category: 'Image',
    emoji: '🌀',
    color: '#7B61FF',
  },
  {
    id: 'leonardo',
    name: 'Leonardo AI',
    description: 'Game-asset and concept-art focused image generator with free credits.',
    url: 'https://leonardo.ai',
    category: 'Image',
    emoji: '🦁',
    color: '#FF6B35',
  },
  {
    id: 'ideogram',
    name: 'Ideogram',
    description: 'Image generator that excels at rendering text inside images.',
    url: 'https://ideogram.ai',
    category: 'Image',
    emoji: '🔤',
    color: '#E91E63',
  },
  {
    id: 'flux',
    name: 'Flux',
    description: 'Black Forest Labs\' open image model — photorealistic quality.',
    url: 'https://blackforestlabs.ai',
    category: 'Image',
    emoji: '⚡',
    color: '#111111',
  },
  {
    id: 'firefly',
    name: 'Adobe Firefly',
    description: 'Adobe\'s commercially-safe image generator — integrated with Creative Cloud.',
    url: 'https://firefly.adobe.com',
    category: 'Image',
    emoji: '🔥',
    color: '#FF3366',
  },

  // ═══════════════════════════════════════════════
  // 💻 CODE
  // ═══════════════════════════════════════════════
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    description: 'AI pair programmer inside VS Code, JetBrains, and more.',
    url: 'https://github.com/features/copilot',
    category: 'Code',
    emoji: '🐙',
    color: '#24292E',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'AI-first code editor — chat with your entire codebase.',
    url: 'https://cursor.com',
    category: 'Code',
    emoji: '🖱️',
    color: '#000000',
  },
  {
    id: 'replit-ai',
    name: 'Replit AI',
    description: 'Cloud IDE with AI code generation and instant deployment.',
    url: 'https://replit.com',
    category: 'Code',
    emoji: '🧩',
    color: '#F26207',
  },
  {
    id: 'codeium',
    name: 'Codeium',
    description: 'Free AI autocomplete for 70+ languages and 40+ editors.',
    url: 'https://codeium.com',
    category: 'Code',
    emoji: '🌊',
    color: '#09B6A2',
  },
  {
    id: 'tabnine',
    name: 'Tabnine',
    description: 'Privacy-focused AI code completion — runs locally if needed.',
    url: 'https://tabnine.com',
    category: 'Code',
    emoji: '🔮',
    color: '#6F42C1',
  },

  // ═══════════════════════════════════════════════
  // 🎥 VIDEO
  // ═══════════════════════════════════════════════
  {
    id: 'runway',
    name: 'Runway',
    description: 'Professional AI video generation, editing, and VFX tools.',
    url: 'https://runwayml.com',
    category: 'Video',
    emoji: '🎬',
    color: '#000000',
  },
  {
    id: 'pika',
    name: 'Pika',
    description: 'Playful AI video generator — turn text and images into clips.',
    url: 'https://pika.art',
    category: 'Video',
    emoji: '🎞️',
    color: '#FF5A5F',
  },
  {
    id: 'sora',
    name: 'Sora',
    description: 'OpenAI\'s text-to-video model — cinematic, long-form clips.',
    url: 'https://openai.com/sora',
    category: 'Video',
    emoji: '🌌',
    color: '#10A37F',
    comingSoon: true,
  },
  {
    id: 'heygen',
    name: 'HeyGen',
    description: 'AI avatars and video translation for marketing and training.',
    url: 'https://heygen.com',
    category: 'Video',
    emoji: '🧑‍💼',
    color: '#7C3AED',
  },
  {
    id: 'synthesia',
    name: 'Synthesia',
    description: 'Enterprise AI video — turn scripts into presenter-led videos.',
    url: 'https://synthesia.io',
    category: 'Video',
    emoji: '🎭',
    color: '#1E40AF',
  },

  // ═══════════════════════════════════════════════
  // 🎵 AUDIO / MUSIC
  // ═══════════════════════════════════════════════
  {
    id: 'suno',
    name: 'Suno',
    description: 'Generate full songs with vocals from a text prompt.',
    url: 'https://suno.com',
    category: 'Audio',
    emoji: '🎵',
    color: '#F97316',
  },
  {
    id: 'udio',
    name: 'Udio',
    description: 'High-fidelity AI music generation — great for demos and ideas.',
    url: 'https://udio.com',
    category: 'Audio',
    emoji: '🎶',
    color: '#8B5CF6',
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'Best-in-class AI voice generation, cloning, and dubbing.',
    url: 'https://elevenlabs.io',
    category: 'Audio',
    emoji: '🔊',
    color: '#000000',
  },

  // ═══════════════════════════════════════════════
  // 📚 RESEARCH / WRITING
  // ═══════════════════════════════════════════════
  {
    id: 'notebooklm',
    name: 'NotebookLM',
    description: 'Google\'s AI notebook — chat with your own documents and PDFs.',
    url: 'https://notebooklm.google.com',
    category: 'Research',
    emoji: '📓',
    color: '#4285F4',
  },
  {
    id: 'elicit',
    name: 'Elicit',
    description: 'AI research assistant that finds and summarizes academic papers.',
    url: 'https://elicit.com',
    category: 'Research',
    emoji: '🔬',
    color: '#0EA5E9',
  },
  {
    id: 'consensus',
    name: 'Consensus',
    description: 'Search 200M+ papers and get evidence-backed answers.',
    url: 'https://consensus.app',
    category: 'Research',
    emoji: '📊',
    color: '#3B82F6',
  },
  {
    id: 'grammarly',
    name: 'Grammarly',
    description: 'AI writing assistant for grammar, tone, and clarity.',
    url: 'https://grammarly.com',
    category: 'Research',
    emoji: '✍️',
    color: '#15C39A',
  },
  {
    id: 'quillbot',
    name: 'QuillBot',
    description: 'Paraphrasing, summarizing, and citation tools for writers.',
    url: 'https://quillbot.com',
    category: 'Research',
    emoji: '🪶',
    color: '#1E9E6A',
  },

  // ═══════════════════════════════════════════════
  // 🛠️ PRODUCTIVITY
  // ═══════════════════════════════════════════════
  {
    id: 'notion-ai',
    name: 'Notion AI',
    description: 'AI writing, summarizing, and Q&A inside your Notion workspace.',
    url: 'https://notion.so',
    category: 'Productivity',
    emoji: '📝',
    color: '#000000',
  },
  {
    id: 'gamma',
    name: 'Gamma',
    description: 'Generate beautiful presentations, docs, and webpages with AI.',
    url: 'https://gamma.app',
    category: 'Productivity',
    emoji: '📽️',
    color: '#7C3AED',
  },
  {
    id: 'tome',
    name: 'Tome',
    description: 'AI-native storytelling — turns prompts into polished decks.',
    url: 'https://tome.app',
    category: 'Productivity',
    emoji: '📖',
    color: '#111827',
  },
  {
    id: 'mem',
    name: 'Mem',
    description: 'Self-organizing AI notes — captures and connects your thoughts.',
    url: 'https://mem.ai',
    category: 'Productivity',
    emoji: '🧠',
    color: '#06B6D4',
  },
];

// ─── Helper: get today's featured tool (rotates daily) ─────────
export function getFeaturedTool(): AITool {
  const dayIndex = Math.floor(Date.now() / 86400000);
  const featured = AI_TOOLS.filter((t) => t.featured);
  const pool = featured.length > 0 ? featured : AI_TOOLS;
  return pool[dayIndex % pool.length];
}

// ─── Helper: group tools by category ───────────────────────────
export function groupByCategory(): Record<AICategory, AITool[]> {
  const grouped: Record<string, AITool[]> = {};
  for (const cat of CATEGORIES) grouped[cat.key] = [];
  for (const tool of AI_TOOLS) grouped[tool.category].push(tool);
  return grouped as Record<AICategory, AITool[]>;
}