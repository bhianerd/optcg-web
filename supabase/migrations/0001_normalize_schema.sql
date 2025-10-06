-- Drop existing tables to start fresh with normalized schema
DROP TABLE IF EXISTS "decks" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- Create users table
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

-- Create cards table - stores all available cards
CREATE TABLE "cards" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"img_url" text NOT NULL,
	"color" text,
	"cost" integer,
	"power" integer,
	"counter" integer,
	"attribute" text,
	"effect" text,
	"trigger" text,
	"life" integer,
	"rarity" text,
	"set_id" text,
	"card_number" text,
	"set" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create decks table
CREATE TABLE "decks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"leader_id" text NOT NULL,
	"user_id" uuid,
	"is_public" boolean DEFAULT false,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create deck_cards table - many-to-many relationship
CREATE TABLE "deck_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deck_id" uuid NOT NULL,
	"card_id" text NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Add foreign key constraints
ALTER TABLE "decks" ADD CONSTRAINT "decks_leader_id_cards_id_fk" FOREIGN KEY ("leader_id") REFERENCES "public"."cards"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "decks" ADD CONSTRAINT "decks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "deck_cards" ADD CONSTRAINT "deck_cards_deck_id_decks_id_fk" FOREIGN KEY ("deck_id") REFERENCES "public"."decks"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "deck_cards" ADD CONSTRAINT "deck_cards_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE no action ON UPDATE no action;

-- Enable Row Level Security
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE deck_cards ENABLE ROW LEVEL SECURITY;

-- Create policies for decks
CREATE POLICY "Users can view their own decks" ON decks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public decks" ON decks
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert their own decks" ON decks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own decks" ON decks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own decks" ON decks
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for deck_cards
CREATE POLICY "Users can view their own deck cards" ON deck_cards
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM decks WHERE decks.id = deck_cards.deck_id AND decks.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own deck cards" ON deck_cards
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM decks WHERE decks.id = deck_cards.deck_id AND decks.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own deck cards" ON deck_cards
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM decks WHERE decks.id = deck_cards.deck_id AND decks.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own deck cards" ON deck_cards
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM decks WHERE decks.id = deck_cards.deck_id AND decks.user_id = auth.uid()
  ));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cards_updated_at 
  BEFORE UPDATE ON cards
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_decks_updated_at 
  BEFORE UPDATE ON decks
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
