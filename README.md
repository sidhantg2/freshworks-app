Freshworks app

Run the application using command: ```npm start```

Run the unit test cases using command: ```npm test```

Swagger tool is used to define the api definition and schema

Self signed certificate is used for https request. http request is discarded.

Two apis are as follows:

(1) https://localhost:8443/v1/ping
    - Response
    {
        "pong": true
    }

(2) https://localhost:8443/v1/hello?name=Sidhant

    - Response 
    {
        "message": "freshworks says hello, Sidhant!"
    }

Non-functional Requirements: 
(1) Every Client must only be allowed to make up to 50 requests a minute. Any more requests within the time window should be rejected with an appropriate status code : 
- ```express-rate-limit``` middleware is used for rate limiting for all the apis in the configured time window based on per request ip by default.

(2) If a request takes longer than 5s, the same must be timed-out and the Client must be informed about the same : 
- Set a timeout of 6s in the api ``` https://localhost:8443/v1/ping ``` deliberately to simulate the timeout scenario and test the requirement.
- Since it would wait for 6s, it will timed out and the appropriate time out response will be delivered to client instead of actual response of the api.
- ```connect-timeout``` middleware is used for handling time out

Run the application directly:
    (1) git clone https://github.com/sidhantg2/freshworks-app.git
    (2) change the directory to parent folder and run following command: 
        (i) npm ci
        (ii) npm start

Build and run the app using docker locally:
    (1) docker build . -t freshworks-app:1.0.0
    (2) docker run -p 8443:8443 freshworks-app:1.0.0



