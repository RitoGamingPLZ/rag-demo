-- Initialize PostgreSQL extensions for the chatbot application
-- This script runs when the PostgreSQL container starts for the first time

-- Note: Vector and HTTP extensions are not available in standard PostgreSQL
-- They would need to be installed separately or use a different base image

-- Create a function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now(); 
    RETURN NEW; 
END;
$$ language 'plpgsql';