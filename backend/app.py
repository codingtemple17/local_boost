from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from supabase import create_client, Client
from dotenv import load_dotenv
import os
import json

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Initialize Supabase client
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(supabase_url, supabase_key)

@app.route('/signup', methods=['POST'])
def signup():
    """Create new user account"""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        # Sign up with Supabase
        response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })
        
        return jsonify({
            'success': True,
            'user': response.user.id if response.user else None,
            'session': response.session.access_token if response.session else None
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/login', methods=['POST'])
def login():
    """Log in existing user"""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        # Sign in with Supabase
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        return jsonify({
            'success': True,
            'user': response.user.id if response.user else None,
            'session': response.session.access_token if response.session else None
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 401

@app.route('/generate-campaign', methods=['POST'])
def generate_campaign():
    """Generate campaign and save to database"""
    try:
        # Get data from request
        data = request.json
        business_name = data.get('business_name')
        campaign_type = data.get('campaign_type')
        story = data.get('story', '')
        user_id = data.get('user_id')
        
        # Create prompt for OpenAI
        prompt = f"""You are an expert marketing consultant helping small businesses create effective social media campaigns.

Business: {business_name}
Campaign Type: {campaign_type}
Campaign Details & Target Audience: {story}

Generate 5 compelling social media posts for this campaign. Create posts with different tones and approaches:

1. Attention-grabbing with urgency
2. Inspirational and motivational
3. Community-focused and inclusive
4. Strong call-to-action
5. Emotional storytelling

Each post should be:
- 2-3 sentences maximum
- Include relevant emojis that match the campaign type
- Ready to copy-paste to Instagram, Facebook, or Twitter
- Tailored specifically to the campaign type and target audience
- Professional yet authentic

Format as a numbered list with clear separation between posts."""

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful community organizer expert at rallying support for local businesses."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            max_tokens=800
        )
        
        # Extract generated posts
        generated_posts = response.choices[0].message.content
        
        # Save campaign to Supabase
        campaign_data = {
            'user_id': user_id,
            'business_name': business_name,
            'campaign_type': campaign_type,
            'story': story,
            'posts': json.dumps({'content': generated_posts})
        }
        
        supabase.table('campaigns').insert(campaign_data).execute()
        
        return jsonify({
            'success': True,
            'posts': generated_posts,
            'business_name': business_name
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")  # This will show in Flask terminal
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/campaigns', methods=['GET'])
def get_campaigns():
    """Get all campaigns for a user"""
    try:
        user_id = request.args.get('user_id')
        
        response = supabase.table('campaigns').select('*').eq('user_id', user_id).order('created_at', desc=True).execute()
        
        return jsonify({
            'success': True,
            'campaigns': response.data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/test', methods=['GET'])
def test():
    return jsonify({'message': 'Backend is working with Supabase!'})

if __name__ == '__main__':
    app.run(debug=True, port=5001)