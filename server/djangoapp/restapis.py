
import os
import requests
from dotenv import load_dotenv

load_dotenv()

backend_url = os.getenv(
    "backend_url", default="http://localhost:3030"
)
sentiment_analyzer_url = os.getenv(
    "sentiment_analyzer_url",
    default="http://localhost:5050/"
)


def get_request(endpoint, **kwargs):
    response = requests.get(
        backend_url + endpoint,
        params=kwargs
    )
    if response.status_code == 200:
        return response.json()
    return None


def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url + "analyze/" + text
    response = requests.get(request_url)
    if response.status_code == 200:
        return response.json()
    return None


def post_review(data_dict):
    response = requests.post(
        backend_url + "/insert_review",
        json=data_dict
    )
    if response.status_code == 201:
        return response.json()
    return None
