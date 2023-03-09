
# STUDY PLAN

A simple API for PT Merah Cipta Media Skill Test recruitment.




## Installation

Install my-project with npm

```bash
  git clone https://github.com/juumelisa/mcm-student-plan-api.git
```
```bash
  cd mcm-student-plan-api
  npm install
```
run the code
```bash
  DEBUG=mcm-student-plan-api:* npm start
```
API ready at http://localhost:3000



## API Reference

#### Get all items

```http
  GET /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### add(num1, num2)

Takes two numbers and returns the sum.

