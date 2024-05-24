from django.contrib.auth import authenticate, login, get_user_model
from django.contrib.auth.hashers import make_password, check_password
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

User = get_user_model()

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        try:
            user = User.objects.get(username=username)
            if check_password(password, user.password):
                login(request, user)
                return JsonResponse({'status': 'success', 'message': 'Logged in successfully'})
            else:
                return JsonResponse({'status': 'error', 'message': 'Invalid credentials'}, status=400)
        except User.DoesNotExist:
            # Create a new user if they don't exist
            user = User(username=username, password=make_password(password))
            user.save()
            login(request, user)
            return JsonResponse({'status': 'success', 'message': 'Account created and logged in successfully'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)
