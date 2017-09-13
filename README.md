# usermgt
This is a user management service that is intended to run as a microservice.

USER MANAGEMENT MODULE

CREATE NEW USER
To create a new User, the method createUser will be used.
Creating a new user demands the following fields
```
{
	"user":	{	"first_name":"daser",
			"last_name":"david",
			"password":"john",
			"email":"daser@gmail.com"
	}
}
```

Other fields in the user table that are optional are:
isVerified (boolean), isActive (boolean), isAdmin (boolean), filters (arrays)

Endpoint: userapi/createUser
Method: POST

LOGIN
To login into the system for the web, the method login will be used.

Login demands the following request structure 
```
{
       "email":"daser@nhubnigeria.com",
       "password":"admin"
}
```
Response:
```
{
    "_id": "59b67fe6998b211427e034b2",
    "first_name": "zipporah",
    "last_name": "Obi",
    "email": "daser@nhubnigeria.com",
    "isVerified": true,
    "filters": [],
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRhc2VyQG5odWJuaWdlcmlhLmNvbSIsInVzZXJpZCI6IjU5YjY3ZmU2OTk4YjIxMTQyN2UwMzRiMiIsInNhbHQiOiIzMTE3NzVlZDMwNDc5MTE4NzViMjQwOWY1MWQ4ZTMyOCJ9.g_sZx2u3lRp0fjxIWD0cF3w3U61g0wrMRa-VtIVXLwM"
}
```
Endpoint: userapi/login
Method: POST


FORGET PASSWORD
Below is the request structure for password recovery:
```
{
    	"email" : "daseronline@gmail.com"
}
```

Endpoint: userapi/forgotPassword
Method: POST







