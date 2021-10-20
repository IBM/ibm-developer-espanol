import pymongo

from dotenv import load_dotenv
from pymongo import MongoClient
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

# Get all db records
def get_all_records():
    database = get_database()

    # Select collection
    collection_name = environ['COLLECTION_NAME']
    collection = database[collection_name]

    # Get all docs
    cursor = collection.find({})

    results = []

    for elem in cursor:
        results.append(elem)

    # Close database connection
    database.client.close()

    # Return all items
    return results

def main():
    records = get_all_records()
    print(records)


if __name__ == '__main__':
    main()     