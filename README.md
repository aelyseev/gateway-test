# Simple gateway app

### Install and run

```
yarn install
yarn start
```

or 

```
npm install
npm start
```

or via Docker
```
docker build -t app/gateway .
docker run -p 3000:3000 -d app/gateway
```

And the app will be accessible by [htttp://localhost:3000](htttp://localhost:3000)

#### Create access token

```
curl -X POST http://localhost:3000/auth -H 'Content-Type: application/json' -d '{"name": "Winston"}'
```

#### Public response
```
curl -X GET http://localhost:3000/hello
```

#### Authorised response
```
curl -X GET http://localhost:3000/hello \
-H 'Authorization: Bearer ...'
```
