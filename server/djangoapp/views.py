
import json
import logging
from datetime import datetime

from django.http import JsonResponse
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt

from .restapis import (
    get_request,
    analyze_review_sentiments,
    post_review,
)

logger = logging.getLogger(__name__)


@csrf_exempt
def login_user(request):
    if request.method != 'POST':
        return JsonResponse(
            {'error': 'POST method required'},
            status=405
        )

    try:
        data = json.loads(request.body)
        username = data.get('userName', '')
        password = data.get('password', '')

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is not None:
            login(request, user)
            return JsonResponse({
                'userName': username,
                'status': 'Authenticated'
            })

        return JsonResponse({
            'userName': username,
            'status': 'Invalid credentials'
        }, status=401)

    except (json.JSONDecodeError, TypeError):
        return JsonResponse(
            {'error': 'Invalid request data'},
            status=400
        )


def logout_request(request):
    logout(request)
    return JsonResponse({'status': 'Logged out'})


@csrf_exempt
def registration(request):
    if request.method != 'POST':
        return JsonResponse(
            {'error': 'POST method required'},
            status=405
        )

    try:
        data = json.loads(request.body)
        username = data.get('userName', '').strip()
        password = data.get('password', '')

        if not username or not password:
            return JsonResponse(
                {'error': 'Username and password are required'},
                status=400
            )

        if User.objects.filter(username=username).exists():
            return JsonResponse(
                {'error': 'Username already exists'},
                status=400
            )

        user = User.objects.create_user(
            username=username,
            password=password
        )

        return JsonResponse({
            'userName': user.username,
            'status': 'Registered'
        }, status=201)

    except (json.JSONDecodeError, TypeError):
        return JsonResponse(
            {'error': 'Invalid request data'},
            status=400
        )


def get_dealerships(request):
    dealerships = get_request('/fetchDealers')

    if dealerships is None:
        return JsonResponse(
            {'error': 'Unable to fetch dealerships'},
            status=502
        )

    return JsonResponse({'dealerships': dealerships})


def get_dealer_reviews(request, dealer_id):
    reviews = get_request(
        f'/fetchReviews/dealer/{dealer_id}'
    )

    if reviews is None:
        return JsonResponse(
            {'error': 'Unable to fetch reviews'},
            status=502
        )

    return JsonResponse({
        'dealer_id': dealer_id,
        'reviews': reviews
    })


def get_dealer_details(request, dealer_id):
    dealer = get_request(f'/fetchDealer/{dealer_id}')

    if dealer is None:
        return JsonResponse(
            {'error': 'Dealership not found'},
            status=404
        )

    return JsonResponse({'dealer': dealer})


@csrf_exempt
def add_review(request):
    if request.method != 'POST':
        return JsonResponse(
            {'error': 'POST method required'},
            status=405
        )

    try:
        data = json.loads(request.body)

        required_fields = [
            'name',
            'dealership',
            'review',
            'purchase',
            'purchase_date',
            'car_make',
            'car_model',
            'car_year',
        ]

        for field in required_fields:
            if field not in data:
                return JsonResponse(
                    {'error': f'Missing field: {field}'},
                    status=400
                )

        sentiment = analyze_review_sentiments(
            data['review']
        )

        if sentiment is not None:
            data['sentiment'] = sentiment

        result = post_review(data)

        if result is None:
            return JsonResponse(
                {'error': 'Unable to submit review'},
                status=502
            )

        return JsonResponse(result, status=201)

    except (json.JSONDecodeError, TypeError):
        return JsonResponse(
            {'error': 'Invalid request data'},
            status=400
        )
