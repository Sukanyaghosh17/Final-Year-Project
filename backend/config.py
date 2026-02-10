
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev_secret_key_change_in_production'
    MONGO_URI = os.environ.get('MONGO_URI') or 'mongodb://localhost:27017/fir_automation'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt_secret_key_change_in_production'
    ASSETS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets')
    MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model')
    CRIME_MODEL_PATH = os.path.join(MODEL_DIR, 'crime_model.pkl')
    BNS_ASSETS_PATH = os.path.join(MODEL_DIR, 'bns_assets.pkl')
    
class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
