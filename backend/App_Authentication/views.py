from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from .models import TemporaryRegistration, UserType, CommonProfile
from .serializers import RegisterSerializer, VerifyOTPSerializer, ResendOTPSerializer, LoginSerializer, ForgotPasswordSerializer, VerifyResetOTPSerializer, ResetPasswordSerializer, ResendForgotPasswordOTPSerializer, CommonProfileSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
import random
import string
import datetime

User = get_user_model()

def generate_otp():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=6))

def send_otp_email(email, otp, subject='Verify your email - LMS', is_reset=False):
    # Colors: Green for Register, Red/Orange for Reset
    color = "#EF4444" if is_reset else "#10B981" 
    bg_color = "#fef2f2" if is_reset else "#f0fdf4"
    border_color = "#EF4444" if is_reset else "#10B981"
    title_text = "Reset Your Password" if is_reset else "Verify Your Email Address"
    desc_text = "Use the code below to reset your LMS password." if is_reset else "Use the code below to complete your registration with LMS."
    
    html_message = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">{title_text}</h2>
        <p style="font-size: 16px; color: #555; text-align: center;">{desc_text}</p>
        <div style="margin: 30px 0; text-align: center;">
            <h1 style="color: {color}; font-size: 40px; letter-spacing: 5px; margin: 0; padding: 10px; background-color: {bg_color}; display: inline-block; border-radius: 8px; border: 1px dashed {border_color};">{otp}</h1>
        </div>
        <p style="font-size: 14px; color: #999; text-align: center;">This code is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
        <div style="text-align: center; margin-top: 20px;">
            <small style="color: #aaa;">LMS System</small>
        </div>
    </div>
    """
    plain_message = f'Your verification code is: {otp}. Valid for 10 minutes.'
    
    send_mail(
        subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
        html_message=html_message
    )

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user_type = serializer.validated_data['user_type']

            # Generate OTP
            otp = generate_otp()
            hashed_password = make_password(password)

            # Store in TemporaryRegistration
            TemporaryRegistration.objects.update_or_create(
                email=email,
                defaults={
                    'password': hashed_password,
                    'user_type': user_type,
                    'otp': otp,
                    'otp_created_at': timezone.now()
                }
            )

            # Send Email (Styled HTML)
            try:
                send_otp_email(email, otp)
            except Exception as e:
                print(f"Error sending email: {e}")
                return Response({'error': 'Failed to send OTP email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({
                "message": "OTP sent to your email. Please verify.",
                "email": email
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']

        try:
            temp_reg = TemporaryRegistration.objects.get(email=email)
        except TemporaryRegistration.DoesNotExist:
            return Response({'error': 'Invalid email or OTP expired'}, status=status.HTTP_404_NOT_FOUND)

        if temp_reg.otp != otp:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

        # Check expiration (10 mins)
        if temp_reg.otp_created_at:
             time_diff = timezone.now() - temp_reg.otp_created_at
             if time_diff.total_seconds() > 600:
                 return Response({'error': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)

        # Create User
        try:
            # Username is auto-generated by nanoid in model
            user = User.objects.create(
                email=temp_reg.email,
                password=temp_reg.password # Already hashed
            )
            # Create UserType
            UserType.objects.create(user=user, user_type=temp_reg.user_type)

            # Create CommonProfile
            CommonProfile.objects.create(
                user=user,
                full_name=email.split('@')[0], # Default name from email
            )
            
            # Cleanup temp reg
            temp_reg.delete()

            return Response({
                'user_id': user.pk,
                'email': user.email,
                'role': temp_reg.user_type,
                'message': 'Email verified and account created successfully'
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': f'Failed to create user: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ResendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResendOTPSerializer(data=request.data)
        if not serializer.is_valid():
             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data['email']
        
        try:
            temp_reg = TemporaryRegistration.objects.get(email=email)
        except TemporaryRegistration.DoesNotExist:
            return Response({'error': 'Registration request not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Cooldown check (optional, let's keep it simple for now or add 1 min cooldown)
        time_diff = timezone.now() - temp_reg.otp_created_at
        if time_diff.total_seconds() < 60:
             return Response({'error': 'Please wait before resending OTP'}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        otp = generate_otp()
        temp_reg.otp = otp
        temp_reg.otp_created_at = timezone.now()
        temp_reg.save()
        
        # print(f"DEBUG: Resend OTP for {email}: {otp}")
        
        try:
            send_otp_email(email, otp, subject='Resend: Verify your email - LMS')
        except Exception as e:
             return Response({'error': 'Failed to send OTP email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
             
        return Response({'message': 'OTP resent successfully'}, status=status.HTTP_200_OK)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = authenticate(username=email, password=password)

        if not user:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

        token, _ = Token.objects.get_or_create(user=user)
        
        # Get role
        try:
            role = user.user_type.user_type
        except Exception:
            role = 'student' # Default fallback

        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'role': role,
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if not serializer.is_valid():
             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data['email']
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User with this email does not exist'}, status=status.HTTP_404_NOT_FOUND)

        otp = generate_otp()
        user.otp = otp
        user.otp_created_at = timezone.now()
        user.save()

        try:
            send_otp_email(email, otp, subject='Reset Password - LMS', is_reset=True)
        except Exception as e:
             return Response({'error': 'Failed to send OTP email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'OTP sent to your email.'}, status=status.HTTP_200_OK)

class VerifyResetOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyResetOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.otp != otp:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

        if user.otp_created_at:
            time_diff = timezone.now() - user.otp_created_at
            if time_diff.total_seconds() > 600: # 10 mins
                return Response({'error': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'OTP verified successfully'}, status=status.HTTP_200_OK)

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        new_password = serializer.validated_data['new_password']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.otp != otp:
             return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

        if user.otp_created_at:
             time_diff = timezone.now() - user.otp_created_at
             if time_diff.total_seconds() > 600:
                 return Response({'error': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.otp = None
        user.otp_created_at = None
        user.save()

        return Response({'message': 'Password reset successfully. Please login with your new password.'}, status=status.HTTP_200_OK)

class ResendForgotPasswordOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResendForgotPasswordOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data['email']
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.otp_created_at:
            time_diff = timezone.now() - user.otp_created_at
            if time_diff.total_seconds() < 60:
                 return Response({'error': 'Please wait before resending OTP'}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        otp = generate_otp()
        user.otp = otp
        user.otp_created_at = timezone.now()
        user.save()

        try:
            send_otp_email(email, otp, subject='Resend: Reset Password - LMS', is_reset=True)
        except Exception:
             return Response({'error': 'Failed to send OTP email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'OTP resent successfully'}, status=status.HTTP_200_OK)

class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommonProfileSerializer

    def get_object(self):
        # Ensure profile exists (if created manually or before migration)
        profile, created = CommonProfile.objects.get_or_create(
            user=self.request.user,
            defaults={'full_name': self.request.user.email.split('@')[0]}
        )
        return profile
