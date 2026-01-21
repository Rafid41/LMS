from django.contrib import admin
from App_Authentication.models import User, UserType, TemporaryRegistration

# Register your models here.
admin.site.register(User)
admin.site.register(UserType)
admin.site.register(TemporaryRegistration)