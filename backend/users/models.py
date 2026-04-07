from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is a required field")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    email = models.EmailField(max_length=200, unique=True)
    dob = models.DateField(null=True, blank=True)
    username = models.CharField(max_length=100, null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []


class Employee(models.Model):
    emp_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    department = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    join_date = models.DateField()
    image = models.ImageField(upload_to="employees/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    gender = models.CharField(max_length=15)
    dob = models.DateField(null=True, blank=True)
    password = models.CharField(max_length=20)

    def __str__(self):
        return self.name


class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Leave(models.Model):
    LEAVE_TYPE_CHOICES = [
        ("Sick Leave", "Sick Leave"),
        ("Casual Leave", "Casual Leave"),
        ("Annual Leave", "Annual Leave"),
    ]

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Approved", "Approved"),
        ("Rejected", "Rejected"),
    ]

    emp_id = models.CharField(max_length=20)
    name = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    leave_type = models.CharField(max_length=50, choices=LEAVE_TYPE_CHOICES)

    from_date = models.DateField(null=True, blank=True)
    to_date = models.DateField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    days = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.from_date and self.to_date:
            self.days = (self.to_date - self.from_date).days + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Salary(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="salaries")
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    allowances = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    pay_date = models.DateField()
    net_salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.net_salary = self.basic_salary + self.allowances - self.deductions
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.employee.name} - {self.pay_date}"