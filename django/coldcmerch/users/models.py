from django.db import models

# Create custom user model.
# Customized Django User Authentication model:

from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser, PermissionsMixin
)                           

class UserAccountManager(BaseUserManager):
    # override:
    def create_user(self, first_name, last_name, email, password = None):
        if not email:
            raise ValueError('Users must have an email address.')

        email = self.normalize_email(email)
        email = email.lower()

        user = self.model(
            first_name = first_name,
            last_name = last_name,
            email = email,
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    # override:
    def create_superuser(self, email, first_name, last_name, password = None):
        user = self.create_user(
            first_name,
            last_name,
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
    first_name = models.CharField(max_length = 255)
    last_name = models.CharField(max_length = 255)
    # must be unique emails
    email = models.EmailField(unique = True, max_length = 255)
    is_active = models.BooleanField(default = True)
    is_staff = models.BooleanField(default = False)

    # Following line allows us to do things such
    # as "User.objects.filter(email=email1)" 
    objects = UserAccountManager()
    

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email



    