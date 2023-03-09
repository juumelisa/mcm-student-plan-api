
# STUDY PLAN

A simple API for PT Merah Cipta Media Skill Test recruitment. Create with Nodejs, Express, Express generator, Validator JS, Sequelize, and Mysql.


## Installation

Install my-project with npm

```bash
  git clone http://github.com/juumelisa/mcm-student-plan-api.git
```
```bash
  cd mcm-student-plan-api
  npm install
```

Create .env file with the same format in .env.example.
```bash
DB_HOST=
DB_NAME=
DB_USER=
DB_PASSWORD=

ADMIN_ACCESS_KEY=
APP_SECRET=

APP_EMAIL=
APP_EMAILPASS=

SMTP_HOST=
SMTP_PORT=
```
If you're using Gmail, you may have to create an “Application Specific” password for Nodemailer to work.

### Run the code
```bash
  DEBUG=mcm-student-plan-api:* npm start
```
API ready at http://localhost:3000



## API Reference

### AUTH

| Method | API            | Description                |
| :----- | :--------      | :------------------------- |
| `post` | `/admin/login` |  **Required**: accessKey.  |
| `post` | `/student/login` | **Required**: email & password.  |
| `post` | `/student/changePassword` |  **Required**: email,password, newPassword, repeatNewPassword.  |
| `post` | `/student/resetPassword` |  **Required**: studentId  |

### STUDENT

| Method | API            | Description                |
| :----- | :--------      | :------------------------- |
| `get` | `/student` |  Get list of student. Only admin can access. **Required**: sessionToken  |
| `get` | `/student/:id` |  **Required**: sessionToken  |
| `post` | `/student/student/add` |  Only admin can access. **Required**: sessionToken, fullName, major, email  |
| `patch` | `/student/` |  Only admin can access. **Required**: sessionToken,studentId. **optional**: fullName, major, email  |
| `delete` | `/student/:id` |  Only admin can access. **Required**: sessionToken, id  |


### SUBJECT

| Method | API            | Description                |
| :----- | :--------      | :------------------------- |
| `get` | `/subject` |  **Required**: sessionToken  |
| `get` | `/subject/:code` |  **Required**: sessionToken, code  |
| `post` | `/subject/` |  Only admin can access. **Required**: sessionToken, code, name, subjectLevel, department, faculty  |
| `patch` | `/subject/` |  Only admin can access. **Required**: sessionToken, code. **optional**: subjectLevel, name, department, faculty  |
| `delete` | `/student/:code` |  Only admin can access. **Required**: sessionToken, code  |


### SUBJECT PARTICIPANT

| Method | API            | Description                |
| :----- | :--------      | :------------------------- |
| `get` | `/studentPlan/` |  **Required**: sessionToken  |
| `get` | `/studentPlan/student/:studentId` |  **Required**: sessionToken, studentId  |
| `get` | `/studentPlan/subject/:subjectCode` |  **Required**: sessionToken, subjectCode  |
| `post` | `/studentPlan/` |  **Required**: sessionToken, subjectCode  |
| `patch` | `/studentPlan/grade` |  Only admin can access. **Required**: sessionToken, id, grade  |
| `delete` | `/studentPlan/:id` |  Only student can access. **Required**: sessionToken, id  |


## Documentation

<!-- [Documentation](http://linktodocumentation) -->

## Admin Section
### Login
**Method**: POST
```bash
http://localhost:3000/admin/login
```
**Request Body** raw (json)
```bash
{
    "accessKey": "MyAccessKey"
}
```

**Note**: use the access key from **process.env.ADMIN_ACCESS_KEY**

**Success Response**
```bash
{
    "success": true,
    "message": "Success",
    "result": {
        "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0FkbWluIjp0cnVlLCJUVEwiOjE2Nzg0NzU0NTAsImlhdCI6MTY3ODM4OTA1MH0.PifxS_Nd3mv1Ne9whoZu-6uqo6obLBCorqvSNwodiiw"
    }
}
```

**Error Response**
```bash
{
    "success": false,
    "message": "Unauthorized"
}
```

### Add Student
This endpoint can be access by admin.
**Method**: POST
```bash
http://localhost:3000/student/add
```
**Request Headers**
```bash
Authorization: sessionToken
```
**Note**: sessionToken from the previous login.

**Request Body (required)** raw (json)
```bash
{
    "fullName": "Melisa",
    "major": "Mathematic",
    "email": "jumelisa09@gmail.com"
}
```
**Note:** Define email configuration in .env so the nodemailer could work. Password for student will be send through student's email.


**Success Response**

```bash
{
    "success": true,
    "message": "Success",
    "result": {
        "status": "ACTIVE",
        "studentId": 12192036,
        "fullName": "MELISA",
        "email": "jumelisa09@gmail.com",
        "major": "MATHEMATIC",
        "password": "$2a$08$Pgn5mRXKj90oHxrzgaDEbe2m2OsTArF8kS6k0X/AeW4EZIiNzC4xa",
        "updatedAt": "2023-03-09T19:18:26.262Z",
        "createdAt": "2023-03-09T19:18:26.262Z"
    }
}
```

**Error Response Example**
```bash
{
    "success": false,
    "message": "Name should be string characters contain alphabet and/or space and dot(.)"
}
```

### Get Student List
Only admin can access this endpoint.
**Method**: GET
```bash
http://localhost:3000/student/
```
**Request Headers**
```bash
Authorization: sessionToken
```

**Example Request Body (optional)** raw (json)
```bash
{
    "limit": 10,
    "major": "Mathematic",
    "name": "mel"
}
```

**Success Response**

```bash
{
    "success": true,
    "message": "Success",
    "pageinfo": {
        "count": 1,
        "page": 1
    },
    "result": [
        {
            "studentId": 12192036,
            "fullName": "MELISA",
            "major": "MATHEMATIC",
            "email": "jumelisa09@gmail.com",
            "status": "ACTIVE"
        }
    ]
}
```

**Example Error Response**
```bash
{
    "success": false,
    "message": "Unauthorized"
}
```


### Get Student Detail
Only admin and student with define id can access this endpoint. Student doesn't need to provide id through request params. Id will be generate through sessionToken.
**Method**: GET
```bash
http://localhost:3000/student/${id}
```
**Request Headers**
```bash
Authorization: sessionToken
```

**Success Response**

```bash
{
    "success": true,
    "message": "Success",
    "result": {
        "studentId": 12192036,
        "fullName": "MELISA",
        "email": "jumelisa09@gmail.com",
        "major": "MATHEMATIC",
        "status": "ACTIVE",
        "createdAt": "2023-03-09T19:18:26.000Z",
        "updatedAt": "2023-03-09T19:18:26.000Z"
    }
}
```

**Example Error Response**
```bash
{
    "success": false,
    "message": "Student not found"
}
```



### Update Student Data
Only admin can access this endpoint.
**Method**: PATCH
```bash
http://localhost:3000/student/
```
**Request Headers**
```bash
Authorization: sessionToken
```

**Example Request Body (required: studentId)** raw (json)
```bash
{
    "studentId": "12192008",
    "fullName": "emma watson",
    "status": "INACTIVE",
    "email": "emma@email.com",
    "major": "PHYSIC",
}
```
**Note:** status value should be 'ACTIVE' or 'INACTIVE'.

**Success Response**

```bash
{
    "success": true,
    "message": "Success",
    "result": {
        "fullName": "emma watson"
    }
}
```

**Example Error Response**
```bash
{
    "success": false,
    "message": "No data change"
}
```


### Delete Student Data
Only admin can access this endpoint.
**Method**: DELETE
```bash
http://localhost:3000/student/${id}
```
**Request Headers**
```bash
Authorization: sessionToken
```
**Success Response**

```bash
{
    "success": true,
    "message": "Success"
}
```

**Example Error Response**
```bash
{
    "success": false,
    "message": "Data not found"
}
```



### Add Subject
Only admin can access this endpoint.
**Method**: POST
```bash
http://localhost:3000/subject/
```
**Request Headers**
```bash
Authorization: sessionToken
```

**Request Body**
```bash
{
    "code": "MATH005",
    "name": "Statistic",
    "subjectLevel": "department",
    "department": "mathematic",
    "faculty": ""
}
```
**Success Response**

```bash
{
    "success": true,
    "message": "Success",
    "result": {
        "code": "MATH005",
        "name": "STATISTIC",
        "subjectLevel": "DEPARTMENT",
        "department": "MATHEMATIC",
        "faculty": "",
        "updatedAt": "2023-03-09T19:39:04.293Z",
        "createdAt": "2023-03-09T19:39:04.293Z"
    }
}
```

**Example Error Response**
```bash
{
    "success": false,
    "message": "Subject with Code MATH004 already exist."
}
```


### Get Subject List
**Method**: GET
```bash
http://localhost:3000/subject/
```
**Request Headers**
```bash
Authorization: sessionToken
```

**Request Body (optional)** raw(json)
```bash
{
    "limit": 5,
    "page": 2
}
```
**Success Response**

```bash
{
    "success": true,
    "message": "Success",
    "pageinfo": {
        "count": 11,
        "page": 2
    },
    "result": [
        {
            "code": "MATH004",
            "name": "GEOMETRIC",
            "subjectLevel": "DEPARTMENT",
            "department": "HALO",
            "faculty": "",
            "createdAt": "2023-03-09T19:38:29.000Z",
            "updatedAt": "2023-03-09T19:38:29.000Z"
        },
        {
            ...
        },
        {
            ...
        }
    ]
}
```


### Get Subject Detail
**Method**: GET
```bash
http://localhost:3000/subject/${code}
```
**Request Headers**
```bash
Authorization: sessionToken
```

**Success Response**

```bash
{
    "success": true,
    "message": "Success",
    "result": {
        "code": "MATH005",
        "name": "STATISTIC",
        "subjectLevel": "DEPARTMENT",
        "department": "MATHEMATIC",
        "faculty": "",
        "createdAt": "2023-03-09T19:39:04.000Z",
        "updatedAt": "2023-03-09T19:39:04.000Z"
    }
}
```

**Example Error Response**
```bash
{
    "success": false,
    "message": "Data not found"
}
```


### Update Subject Data
Only admin can access this endpoint.

**Method**: PATCH
```bash
http://localhost:3000/subject/
```
**Request Headers**
```bash
Authorization: sessionToken
```

**Example Request Body (required: code)** raw (json)
```bash
{
    "code": "MT002",
    "name": "STATISTIC",
    "subjectLevel": "DEPARTMENT",
    "department": "MATHEMATIC",
    "faculty": "",
}
```

**Success Response**

```bash

    "success": true,
    "message": "Success",
    "result": {
      "name": "STATISTIC",
      "subjectLevel": "DEPARTMENT",
      "department": "MATHEMATIC",
      "faculty": ""
    }
}
```

**Example Error Response**
```bash
{
    "success": false,
    "message": "No data change"
}
```


### Delete Subject Data
Only admin can access this endpoint.

**Method**: DELETE
```bash
http://localhost:3000/subject/${code}
```
**Request Headers**
```bash
Authorization: sessionToken
```

**Success Response**

```bash

    "success": true,
    "message": "Success"
}
```

**Example Error Response**
```bash
{
    "success": false,
    "message": "Unauthorized"
}
```


### Get Subject Participants
Only admin can acess this endpoint
**Method**: GET
```bash
http://localhost:3000/studentPlan/
```
**Request Headers**
```bash
Authorization: sessionToken
```

**Request Body (optional)** raw(json)
```bash
{
    "groupBy": "subjectCode"
}
```
**Note:** optional groupBy: "studentId" or "subjectCode"

**Success Response**

```bash
{
    "success": true,
    "message": "Success",
    "result": [
        {
            "id": 3,
            "studentId": 12192008,
            "subjectCode": "MT002",
            "grade": "A",
            "createdAt": "2023-03-09T10:04:19.000Z",
            "updatedAt": "2023-03-09T10:09:11.000Z"
        },
        {
            ...
        },
        {
            ...
        },
        {
            ...
        }
    ]
}
```

**Error Response**
```bash
{
    "success": false,
    "message": "Available group by choices: studentId and subjectCode"
}
```

### GET SUBJECT PARTICIPANT BY USER
Only admin and define user can acess this endpoint
**Method**: GET
```bash
http://localhost:3000/studentPlan/student/:studentId
```
**Request Headers**
```bash
Authorization: sessionToken
```

**Success Response**

```bash
{
    "success": true,
    "message": "Success",
    "result": [
        {
            "id": 10,
            "studentId": 12192035,
            "subjectCode": "SAS0036",
            "grade": "F",
            "createdAt": "2023-03-09T17:02:59.000Z",
            "updatedAt": "2023-03-09T17:02:59.000Z",
            "student": {
                "fullName": "MEISSA JOO"
            },
            "subject": {
                "name": "ENGLISH-D"
            }
        }
    ]
}
```

**Error Response**
```bash
{
    "success": false,
    "message": "Unauthorized"
}
```

### GET SUBJECT PARTICIPANT BY SUBJECT
Only admin can acess this endpoint
**Method**: GET
```bash
http://localhost:3000/studentPlan/subject/:subjectCode
```
**Request Headers**
```bash
Authorization: sessionToken
```

**Request Body (required)** raw(json)
```bash
{
    "id": 4,
    "grade": "A"
}
```
**Success Response**

```bash

    "success": true,
    "message": "Success",
    "result": [
        {
            "id": 4,
            "studentId": 12192008,
            "subjectCode": "MT001",
            "grade": "A",
            "createdAt": "2023-03-09T10:05:29.000Z",
            "updatedAt": "2023-03-09T17:06:47.000Z",
            "student": {
                "fullName": "EMMA WATSON"
            },
            "subject": {
                "name": "Kalkulus I"
            }
        },
        {
            "id": 11,
            "studentId": 12192035,
            "subjectCode": "MT001",
            "grade": "F",
            "createdAt": "2023-03-09T20:47:05.000Z",
            "updatedAt": "2023-03-09T20:47:05.000Z",
            "student": {
                "fullName": "MEISSA JOO"
            },
            "subject": {
                "name": "Kalkulus I"
            }
        }
    ]
}
```
**Error Response**
```bash
{
    "success": false,
    "message": "Unauthorized"
}
```


### UPDATE STUDENT GRADE IN PARTICIPANT SUBJECT
Only admin can acess this endpoint
**Method**: GET
```bash
http://localhost:3000/studentPlan/grade
```
**Request Headers**
```bash
Authorization: sessionToken
```

**Request Body (required)** raw(json)
```bash
{
    "id": 4,
    "grade": "A"
}
```
**Success Response**

```bash
{
    "success": true,
    "message": "Success"
}
```
**Error Response**
```bash
{
    "success": false,
    "message": "Invalid Grade. Allow values: A, B, C, D, E or F"
}
```

## Student Section

### Login
**Method**: POST
```bash
http://localhost:3000/student/login
```
**Request Body** raw (json)
```bash
{
    "email": "jumelisa09@gmail.com",
    "password": "MEISSA4883"
}
```
**Success Response**
```bash
{
    "success": true,
    "message": "Success",
    "result": {
        "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0FkbWluIjpmYWxzZSwic3R1ZGVudElkIjoxMjE5MjAzNSwibWFqb3IiOiJNQVRIRU1BVElDIiwiVFRMIjoxNjc4NDY4NTM3LCJpYXQiOjE2NzgzODIxMzd9.FhhkotBTx8_nMP_imFxbE3AYQqEsG--qlQwp6NFdKm0"
    }
}
```

**Error Response**
```bash
{
    "success": false,
    "message": "Wrong credentials"
}
```


### Change Password
**Method**: POST
```bash
http://localhost:3000/student/changePassword
```
**Request Body** raw (json)
```bash
{
    "email": "jumelisa09@gmail.com",
    "password": "meLisa123",
    "newPassword": "Melisa123",
    "repeatNewPassword": "Melisa123"
}
```
**Success Response**
```bash
{
    "success": true,
    "message": "Success"
}
```

**Error Response**
```bash
{
    "success": false,
    "message": "Wrong credentials"
}
```

### Reset Password
**Method**: POST
```bash
http://localhost:3000/student/resetPassword
```
**Request Body** raw (json)
```bash
{
    "studentId": "12192035"
}
```
**Success Response**
```bash
{
    "success": true,
    "message": "We has send your new password to your email mel***@***.io"
}
```

**Error Response**
```bash
{
    "success": false,
    "message": "Data not found"
}
```

### Reset Password
**Method**: POST
```bash
http://localhost:3000/student/resetPassword
```
**Request Body** raw (json)
```bash
{
    "studentId": "12192035"
}
```

**Note:** New password will be send to student's email.

**Success Response**
```bash
{
    "success": true,
    "message": "We has send your new password to your email mel***@***.io"
}
```

**Error Response**
```bash
{
    "success": false,
    "message": "Data not found"
}
```


### Add Subject Participan

This endpoint can be access by students to subscribe to a subject class.

**Method**: POST
```bash
http://localhost:3000/studentPlan/
```

**Request Headers**
```bash
Authorization: sessionToken
```

**Request Body** raw (json)
```bash
{
    "subjectCode": "MT001"
}
```

**Success Response**
```bash
{
    "success": true,
    "message": "Success",
    "result": {
        "id": 11,
        "studentId": 12192035,
        "subjectCode": "MT001",
        "grade": "F",
        "updatedAt": "2023-03-09T20:47:05.271Z",
        "createdAt": "2023-03-09T20:47:05.271Z"
    }
}
```

**Error Response**
```bash
{
    "success": false,
    "message": "Already participate"
}
```


### Delete Subject Participan

This endpoint can be access by students to unsubscribe a subject class.

**Method**: DELETE
```bash
http://localhost:3000/studentPlan/:id
```

**Request Headers**
```bash
Authorization: sessionToken
```

**Success Response**
```bash
{
    "success": true,
    "message": "Success",
    "result": {
        "id": 11,
        "studentId": 12192035,
        "subjectCode": "MT001",
        "grade": "F",
        "updatedAt": "2023-03-09T20:47:05.271Z",
        "createdAt": "2023-03-09T20:47:05.271Z"
    }
}
```

**Error Response**
```bash
{
    "success": false,
    "message": "Unauthorized"
}
```