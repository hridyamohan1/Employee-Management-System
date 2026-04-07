from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import *
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")
        request = self.context.get("request")

        try:
            user = User.objects.get(email=email)

            if not user.check_password(password):
                raise serializers.ValidationError("Invalid email or password")

            if not user.is_active:
                raise serializers.ValidationError("User account is disabled")

            refresh = RefreshToken.for_user(user)

            return {
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "is_staff": user.is_staff,
                    "role": "admin" if user.is_staff else "user",
                },
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }

        except User.DoesNotExist:
            pass

        try:
            employee = Employee.objects.get(email=email)

            if employee.password != password:
                raise serializers.ValidationError("Invalid email or password")

            image_url = None
            if employee.image:
                if request:
                    image_url = request.build_absolute_uri(employee.image.url)
                else:
                    image_url = employee.image.url

            return {
                "user": {
                    "id": employee.id,
                    "emp_id": employee.emp_id,
                    "email": employee.email,
                    "name": employee.name,
                    "image": image_url,
                    "department": employee.department,
                    "gender": employee.gender,
                    "dob": employee.dob,
                    "designation": employee.designation,
                    "phone": employee.phone,
                    "join_date": employee.join_date,
                    "salary": employee.salary,
                    "is_staff": False,
                    "role": "employee",
                },
                "refresh": None,
                "access": "employee-login-success",
            }

        except Employee.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email")


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = "__all__"


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"


class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = "__all__"
        read_only_fields = ["days", "created_at"]

    def validate(self, attrs):
        from_date = attrs.get("from_date", getattr(self.instance, "from_date", None))
        to_date = attrs.get("to_date", getattr(self.instance, "to_date", None))

        if from_date and to_date and to_date < from_date:
            raise serializers.ValidationError({
                "to_date": "To date must be greater than or equal to from date."
            })

        return attrs

    def validate_status(self, value):
        allowed_status = ["Pending", "Approved", "Rejected"]
        if value not in allowed_status:
            raise serializers.ValidationError("Invalid status")
        return value


class AdminLeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = [
            "id",
            "emp_id",
            "name",
            "department",
            "leave_type",
            "description",
            "from_date",
            "to_date",
            "status",
            "days",
            "created_at",
        ]
        read_only_fields = ["days", "created_at"]


class SalarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Salary
        fields = "__all__"
        read_only_fields = ["net_salary", "created_at"]

    def validate(self, attrs):
        employee = attrs.get("employee")
        department = attrs.get("department")

        if employee and department:
            employee_department = employee.department.strip().lower()
            selected_department = department.name.strip().lower()

            if employee_department != selected_department:
                raise serializers.ValidationError({
                    "employee": "This employee does not belong to the selected department."
                })

        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        old_password = attrs.get("old_password")
        new_password = attrs.get("new_password")
        confirm_password = attrs.get("confirm_password")

        if new_password != confirm_password:
            raise serializers.ValidationError({
                "error": "New password and confirm password do not match."
            })

        if len(new_password) < 6:
            raise serializers.ValidationError({
                "error": "New password must be at least 6 characters."
            })

        try:
            employee = Employee.objects.get(email=email)
        except Employee.DoesNotExist:
            raise serializers.ValidationError({
                "error": "Employee not found."
            })

        if employee.password != old_password:
            raise serializers.ValidationError({
                "error": "Old password is incorrect."
            })

        attrs["employee"] = employee
        return attrs


class AdminChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        request = self.context.get("request")
        user = request.user

        old_password = attrs.get("old_password")
        new_password = attrs.get("new_password")
        confirm_password = attrs.get("confirm_password")

        if not user or not user.is_authenticated:
            raise serializers.ValidationError({
                "error": "Authentication required."
            })

        if not user.is_staff:
            raise serializers.ValidationError({
                "error": "Only admin can change this password."
            })

        if not user.check_password(old_password):
            raise serializers.ValidationError({
                "error": "Old password is incorrect."
            })

        if new_password != confirm_password:
            raise serializers.ValidationError({
                "error": "New password and confirm password do not match."
            })

        if len(new_password) < 6:
            raise serializers.ValidationError({
                "error": "New password must be at least 6 characters."
            })

        return attrs