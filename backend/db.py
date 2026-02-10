
from pymongo import MongoClient
from config import config
import os

class Database:
    client = None
    db = None

    @staticmethod
    def init_db(app):
        mongo_uri = app.config['MONGO_URI']
        try:
            Database.client = MongoClient(mongo_uri)
            # If the URI includes a database name, get_default_database() uses it
            # Otherwise we might need to specify it.
            # For Atlas/Render, usually the URI has it.
            # Localhost default:
            if 'localhost' in mongo_uri and not mongo_uri.split('/')[-1]:
                 Database.db = Database.client['fir_automation']
            else:
                Database.db = Database.client.get_default_database()
                
            print(f"Connected to MongoDB: {Database.db.name}")
        except Exception as e:
            print(f"Failed to connect to MongoDB: {e}")

def get_db():
    return Database.db
