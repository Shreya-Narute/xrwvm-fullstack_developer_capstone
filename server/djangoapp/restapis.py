
import os
import requests
from dotenv import load_dotenv

load_dotenv()

backend_url = os.getenv(
    'backend_url',
    'http://localhost:3030'
).rstrip('/')

sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    'http://localhost:5050/'
)


def get_request(endpoint, **kwargs):
    try:
        response = requests.get(
            backend_url + '/' + endpoint.lstrip('/'),
            params=kwargs,
            timeout=10
        )

        if response.status_code == 200:
            return response.json()

        return None

    except requests.RequestException as error:
        logger_message = f'GET request failed: {error}'
        print(logger_message)
        return None


def analyze_review_sentiments(text):
    try:
        from urllib.parse import quote

        request_url = (
            sentiment_analyzer_url.rstrip('/')
            + '/analyze/'
            + quote(str(text), safe='')
        )

        response = requests.get(request_url, timeout=10)

        if response.status_code == 200:
            return response.json()

        return None

    except requests.RequestException as error:
        print(f'Sentiment request failed: {error}')
        return None


def post_review(data_dict):
    try:
        response = requests.post(
            backend_url + '/insert_review',
            json=data_dict,
            timeout=10
        )

        if response.status_code in (200, 201):
            return response.json()

        print(f'Review submission failed: {response.status_code}')
        return None

    except requests.RequestException as error:
        print(f'Review submission failed: {error}')
        return None
