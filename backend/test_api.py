import requests

token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc0ODUyOTk0LCJpYXQiOjE3NzQ4NTI2OTQsImp0aSI6Ijk4NGMxNTA2OThmMzRjMWE4YzlmNmVmNTg2MmRiYTQ0IiwidXNlcl9pZCI6IjYifQ.Tl5366xL3S-BHs_XfL7EKdgnRXXdom0Gpn_UCHYID9U'
headers = {
    "Authorization": f"Bearer {token}"
}

response = requests.get("http://127.0.0.1:8000/user/", headers=headers)

print(response.status_code)
print(response.json())