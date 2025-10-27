import openai
from typing import List
from app.core.config import settings
from app.models import Entry as EntryModel

class AIService:
    def __init__(self):
        if settings.OPENAI_API_KEY:
            openai.api_key = settings.OPENAI_API_KEY
        else:
            self.client = None
    
    async def summarize_text(self, text: str) -> str:
        """Summarize a text entry using OpenAI"""
        if not self.client:
            return "AI summarization not available (API key not configured)"
        
        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that creates concise, insightful summaries of journal entries. Focus on key themes, emotions, and important insights."
                    },
                    {
                        "role": "user",
                        "content": f"Please summarize this journal entry:\n\n{text}"
                    }
                ],
                max_tokens=200,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            return f"Error generating summary: {str(e)}"
    
    async def generate_reflection(self, entries: List[EntryModel]) -> str:
        """Generate a weekly reflection from multiple entries"""
        if not self.client:
            return "AI reflection not available (API key not configured)"
        
        # Combine entry content
        combined_content = "\n\n".join([
            f"Entry {i+1} ({entry.created_at.strftime('%Y-%m-%d')}): {entry.title}\n{entry.content or ''}"
            for i, entry in enumerate(entries)
        ])
        
        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a thoughtful journaling assistant. Create a weekly reflection that identifies patterns, themes, growth areas, and insights from the user's journal entries. Be encouraging and insightful."
                    },
                    {
                        "role": "user",
                        "content": f"Please create a weekly reflection based on these journal entries:\n\n{combined_content}"
                    }
                ],
                max_tokens=400,
                temperature=0.8
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            return f"Error generating reflection: {str(e)}"
    
    async def extract_themes(self, text: str) -> List[str]:
        """Extract key themes from text"""
        if not self.client:
            return ["AI theme extraction not available"]
        
        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that extracts key themes from text. Return a simple list of 3-5 main themes."
                    },
                    {
                        "role": "user",
                        "content": f"Extract the main themes from this text:\n\n{text}"
                    }
                ],
                max_tokens=100,
                temperature=0.5
            )
            
            themes_text = response.choices[0].message.content.strip()
            # Simple parsing - in production, you'd want more robust parsing
            themes = [theme.strip() for theme in themes_text.split('\n') if theme.strip()]
            return themes[:5]  # Limit to 5 themes
            
        except Exception as e:
            return [f"Error extracting themes: {str(e)}"]
    
    async def analyze_sentiment(self, text: str) -> str:
        """Analyze sentiment of text"""
        if not self.client:
            return "neutral"
        
        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that analyzes sentiment. Respond with only one word: positive, negative, or neutral."
                    },
                    {
                        "role": "user",
                        "content": f"Analyze the sentiment of this text:\n\n{text}"
                    }
                ],
                max_tokens=10,
                temperature=0.3
            )
            
            sentiment = response.choices[0].message.content.strip().lower()
            if sentiment in ["positive", "negative", "neutral"]:
                return sentiment
            else:
                return "neutral"
                
        except Exception as e:
            return "neutral"
