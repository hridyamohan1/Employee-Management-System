from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from django.views.generic import RedirectView
from django.templatetags.static import static

router = DefaultRouter()
router.register("register", RegisterViewset, basename="register")
router.register("login", LoginViewset, basename="login")
router.register("user", UserViewset, basename="user")

urlpatterns = [
    path("favicon.ico", RedirectView.as_view(url=static("favicon.ico"))),

    path("", include(router.urls)),
    path("profile/", ProfileView.as_view(), name="profile"),

    path("employees/", EmployeeListCreateView.as_view(), name="employees"),
    path("employees/<int:pk>/", EmployeeDetailView.as_view(), name="employee-detail"),
    path("employees/<int:pk>/edit/", EmployeeUpdateView.as_view(), name="employee-update"),
    # path("employees/<int:pk>/leave/", ViewLeaveAdmin.as_view(), name="employee-leave"),
    path("employees/<int:pk>/leave/", ViewLeaveAdmin.as_view(), name="employee-leave"),

    path("departments/", DepartmentListCreateView.as_view(), name="department-list-create"),
    path("departments/<int:pk>/", DepartmentDetailView.as_view(), name="department-detail"),

    path("leaves/", LeaveListCreateView.as_view(), name="leave-list-create"),
    path("leaves/<int:pk>/", LeaveDetailView.as_view(), name="leave-detail"),

    path("salary/", SalaryListCreateView.as_view(), name="salary-list-create"),
    path("salary/<int:pk>/", SalaryDetailView.as_view(), name="salary-detail"),

    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("admin-change-password/", AdminChangePasswordView.as_view(), name="admin-change-password"),

    
]