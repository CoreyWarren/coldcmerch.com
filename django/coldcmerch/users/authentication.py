# Why was this file created?

# This file was created to allow for the use of cookies to authenticate users.
# This is because HTTPONLY cookies cannot be accessed by javascript.
# So we need to send the token from the cookies to this django backend view.
# This view will then verify the token and return the result.


from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    def get_raw_token(self, request):
        return request.COOKIES.get('access')  
        # another way to get the request access cookie is:
        # return request.COOKIES['access']
        # or:
        # return request.COOKIES.get('access', None)
        # or:
        # return request.COOKIES.get('access', 'default value')

    

# Path: .users.authentication