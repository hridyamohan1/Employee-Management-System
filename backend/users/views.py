from rest_framework import viewsets, permissions, status, generics
from .serializers import *
from .models import *
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

User = get_user_model()


class RegisterViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class LoginViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def create(self, request):
        serializer = self.serializer_class(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "id": request.user.id,
            "email": request.user.email,
        })


class UserViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

    def list(self, request):
        queryset = User.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class EmployeeListCreateView(generics.ListCreateAPIView):
    serializer_class = EmployeeSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = Employee.objects.all().order_by("-id")
        department_id = self.request.query_params.get("department")

        if department_id:
            try:
                department = Department.objects.get(id=department_id)
                queryset = queryset.filter(department__iexact=department.name)
            except Department.DoesNotExist:
                queryset = Employee.objects.none()

        return queryset


class EmployeeDetailView(generics.RetrieveAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class EmployeeUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def patch(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)


class DepartmentListCreateView(generics.ListCreateAPIView):
    queryset = Department.objects.all().order_by("id")
    serializer_class = DepartmentSerializer


class DepartmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class LeaveListCreateView(generics.ListCreateAPIView):
    queryset = Leave.objects.all().order_by("-id")
    serializer_class = LeaveSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class LeaveDetailView(generics.RetrieveUpdateAPIView):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def patch(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)


class SalaryListCreateView(generics.ListCreateAPIView):
    serializer_class = SalarySerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = Salary.objects.all().order_by("-id")
        employee_id = self.request.query_params.get("employee")

        if employee_id:
            queryset = queryset.filter(employee_id=employee_id)

        return queryset


class SalaryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Salary.objects.all()
    serializer_class = SalarySerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def patch(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)


class ChangePasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            employee = serializer.validated_data["employee"]
            employee.password = serializer.validated_data["new_password"]
            employee.save()

            return Response(
                {"message": "Password changed successfully"},
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AdminChangePasswordSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data["new_password"])
            user.save()

            return Response(
                {"message": "Admin password changed successfully"},
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ViewLeaveAdmin(APIView):
    def get(self, request, pk, *args, **kwargs):
        try:
            employee = Employee.objects.get(pk=pk)
        except Employee.DoesNotExist:
            return Response(
                {"detail": "Employee not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        leaves = Leave.objects.filter(emp_id=employee.emp_id).order_by("-id")
        serializer = AdminLeaveSerializer(leaves, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)