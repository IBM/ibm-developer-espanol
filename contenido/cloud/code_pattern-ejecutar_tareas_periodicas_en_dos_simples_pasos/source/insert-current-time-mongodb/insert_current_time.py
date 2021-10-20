import datetime

import pymongo

from pymongo import MongoClient
from dotenv import load_dotenv
from os import environ

# Load environment variables from .env
load_dotenv()

def get_database():
    # Connect to mongodb using pymongo
    CONNECTION_STRING = environ['MONGO_URL']

    TLS_FILE = environ['TLS_FILE_PATH']

    # Create a connection using MongoClient
    client = MongoClient(CONNECTION_STRING, tls=True, tlsCAFile=TLS_FILE)
    # client = MongoClient(CONNECTION_STRING)

    database = client[environ['MONGO_DBNAME']]

    return database

def insert_data(json_object):
    # Create DB Client
    database = get_database()                           

    # Select collection
    collection_name = environ['COLLECTION_NAME']
    collection = database[collection_name]

    # Insert new publication
    insert_result = collection.insert_one(json_object)  
    
    # Close database connection
    database.client.close()

    return insert_result                             


def main():
    current_time = datetime.datetime.today().strftime("%m/%d/%Y, %H:%M:%S GMT-3")

    json_object = {
        'current_time' : current_time
    }    

    result = insert_data(json_object)

    print('Successfully inserted new registry into database.\nRegistry ', json_object)

if __name__ == '__main__':
    main()                      # Run Main program
