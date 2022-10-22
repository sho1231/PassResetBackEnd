url:https://passresetbackend.herokuapp.com

to register:
            path:/auth/register
           example of req.body:
                    {
	                    "email":"shourja.ganguly181@gmail.com",
                    	"username":"sho121",
                    	"pass":"12345",
	                    "cpass":"12345"
                    }
to login:
            path:/auth/login
            example of req.body:
            {
	            "email":"shourja.ganguly181@gmail.com",
	            "pass":"test123"
            }