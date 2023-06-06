from email.quoprimime import body_check
from turtle import title
from django.db import models

# Create custom user model.
# Customized Django User Authentication model:

from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser, PermissionsMixin
)                           

class UserAccountManager(BaseUserManager):
    # override:
    def create_user(self, email, password = None):
        if not email:
            raise ValueError('Users must have an email address.')

        email = self.normalize_email(email)
        email = email.lower()

        user = self.model(
            email = email,
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    # override:
    def create_superuser(self, email, password = None):
        user = self.create_user(
            email,
            password = password,
        )

        #is_staff is used for logging into Django admin
        user.is_staff = True
        # superuser allows them to actually go in and edit the data
        user.is_superuser = True
        user.save(using = self._db)

        return user

class UserAccount(AbstractBaseUser, PermissionsMixin):
    # must be unique emails
    email = models.EmailField(unique = True, max_length = 255)
    is_active = models.BooleanField(default = True)
    is_staff = models.BooleanField(default = False)

    # Following line allows us to do things such
    # as "User.objects.filter(email=email1)" 
    objects = UserAccountManager()
    

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email



class BlacklistedToken(models.Model):
    token = models.CharField(max_length=500)
    user = models.ForeignKey(UserAccount, related_name="blacklisted_tokens", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)