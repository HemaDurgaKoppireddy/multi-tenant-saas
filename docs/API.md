# API Documentation  
## Multi-Tenant SaaS Platform – Project & Task Management System

---

## Authentication APIs

### API 1: Register Tenant
**POST** `/api/auth/register-tenant`  
**Authentication:** Not Required  

Creates a new tenant with a tenant admin.

**Request Body**

{
  "tenantName": "Test Company Alpha",
  "subdomain": "testalpha",
  "adminEmail": "admin@testalpha.com",
  "adminPassword": "TestPass@123",
  "adminFullName": "Alpha Admin"
}
