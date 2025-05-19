-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create knowledge_base table
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rating TEXT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add some initial knowledge entries
INSERT INTO knowledge_base (title, content, category, tags)
VALUES 
('General Greetings', 'The chatbot can respond to greetings like "hello", "hi", "good morning", etc. with appropriate responses.', 'general', ARRAY['greetings', 'hello', 'introduction']),
('World Geography', 'Earth has 7 continents: Africa, Antarctica, Asia, Europe, North America, Australia/Oceania, and South America. There are approximately 195 countries in the world.', 'knowledge', ARRAY['geography', 'world', 'countries', 'continents']),
('Basic Science', 'The scientific method is a process for experimentation used to explore observations and answer questions. The basic steps include: asking a question, doing background research, constructing a hypothesis, testing with an experiment, analyzing results, and drawing conclusions.', 'knowledge', ARRAY['science', 'scientific method', 'research'])
ON CONFLICT DO NOTHING;
