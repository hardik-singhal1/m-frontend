# Frontend

This is the frontend ui application for Sailor. The application uses nextjs as the javascript framework.

# Developer Environment Setup

```shell
git clone https://github.com/sailorcloud/frontend.git
cd frontend
npm install
```

# Running the Application
The frontend uses [ORY Kratos](https://www.ory.sh/kratos/#:~:text=Ory%20Kratos%20is%20a%20cloud,protocols%20such%20as%20Google%20Authenticator.) for authentication and identity management.
To run the frontend application we require that kratos itself to be started first. Steps and configuration for kratos 

```shell
export NEXT_PUBLIC_KRATOS_PUBLIC_API="http://127.0.0.1:4433/"
export NEXT_PRIVATE_KRATOS_IDENTITY_API="http://127.0.0.1:4434/"
export NEXT_PUBLIC_HOSTPORT="http://127.0.0.1:8000"
export NEXT_PUBLIC_BUCKET_NAME="sailor-tfstate"
npm run dev
```
