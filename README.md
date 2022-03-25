# photo_album_API
REST-API made with Node.js, Express.js using Bookshelf and a MySQL database. The API is deployed with heroku and tested using postman, the postman collection can be found in the repo for testing as well as a dump of the database. The API also uses JWT tokens as authentication before the user can view, update, post and delete photos and albums in the database belonging to them. Any passwords are encrypted with a hash and salt using bcrypt.

https://boiling-island-84344.herokuapp.com/


### Languages and Frameworks used:

- Node.js
- Express
- MySQL
- Bookshelf
- Bcrypt, JWT tokens

## Table of contents

- [Assignment](#assignment)
- [Tools](#tools)
- [Routes](#routes)
- [Using the API](#using-the-api)
- [Authentication](#authentication)
- [Photos Endpoint](#photos-endpoints)
- [Albums Endpoint](#albums-endpoints)

## Assignment

- Create a simple REST API connected to a MySQL database where the user can create, read, remove, update and manage photos and albums belonging to them.    The app is deployed to heroku and tested with postman. 
- The API must abide by the REST constraints.

#### Basic requirement

- Use Node.js, Express, MySQL, Bookshelf and user authentication with JWT tokens.
- Version control using git
- Deploy to Heroku
- Users should only be able to access their own data.
- All the passwords stored in the database must be encrypted with a hash and salt.
- All responses must be wrapped according to JSend specifikations.
- Validation of data on all POST and PUT requests. 
- Follow MVC structure.

#### The API has the following endpoints

# Routes

## Albums

| Method  | Path                              | Comment                                |
|---------|-----------------------------------|----------------------------------------|
| GET     | /albums                           | Get all albums                         |
| GET     | /albums/:albumId                  | Get a single album                     |
| POST    | /albums                           | Create a new album                     |
| PUT     | /albums/:albumId                  | Update an album                        |
| POST    | /albums/:albumId/photos           | Add a photo an album                   |
| POST    | /albums/:albumId/photos           | Add multiple photos an album           |
| DELETE  | /albums/:albumId/photos/:photoId  | Remove a photo from an album           |
| DELETE  | /albums/:albumId                  | Delete an album                        |


## Photos

| Method  | Path                              | Comment                                |
|---------|-----------------------------------|----------------------------------------|
| GET     | /photos                           | Get all photos                         |
| GET     | /photos/:photoId                  | Get a single photo                     |
| POST    | /photos                           | Create a new photo                     |
| PUT     | /photos/:photoId                  | Update a photo                         |
| DELETE  | /photos/:photoId                  | Delete a photo                         |


## Users

| Method  | Path                              | Comment                                |
|---------|-----------------------------------|----------------------------------------|
| POST    | /register                         | Register a new user                    |
| POST    | /login                            | Log in a user                          |
| POST    | /refresh                          | Get a new access token                 |

------

## Using the API
### Use the Heroku link in Postman to make requests and allow a few seconds for the Heroku app to wake up.
### Ex: https://boiling-island-84344.herokuapp.com/register
- Register a new user using the `POST /register` endpoint.
- After successful registration, login using the `POST /login` endpoint.
- Included in the response is a JWT access token and refresh token. The access token is used to access the other endpoints, ensuring you will only access     your own data. The refresh token is used in the `POST /refresh` endpoint to receive a new access token after it expires.
- After successfully receiving a token you may access the other endpoints and begin storing your albums and photos in the database.

------

# Authentication

## `POST /register`

Register a new user.

### Parameters

*None*

### Body

```json
{
  "email": "jn@badcameraphotography.com",
  "password": "omg-smile",
  "first_name": "Julia",
  "last_name": "Jespersdotter"
}
```

- `email` *string* **required** must be a valid email *and* not already exist
- `password` *string* **required** must be at least 6 chars long
- `first_name` *string* **required** must be at least 3 chars long
- `last_name` *string* **required** must be at least 3 chars long

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "email": "jn@badcameraphotography.com",
    "first_name": "Julia",
    "last_name": "Jespersdotter"
  }
}
```

------

## `POST /login`

Log in a user.

### Parameters

*None*

### Body

```json
{
  "email": "jn@badcameraphotography.com",
  "password": "omg-smile",
}
```

- `email` *string* **required** must be a valid email *and* exist
- `password` *string* **required** must be at least 6 chars long

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjo4LCJlbWFpbCI6ImpuQGJhZGNhbWVyYXBob3RvZ3JhcGh5LmNvbSJ9LCJpYXQiOjE2NDU3Mzg2MzIsImV4cCI6MTY0NTgyNTAzMn0.TzOQmmUEkz8p5e27AU29EeN3SEcRM5Ne5yaz-RJYpYc",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjo4LCJlbWFpbCI6ImpuQGJhZGNhbWVyYXBob3RvZ3JhcGh5LmNvbSJ9LCJpYXQiOjE2NDU3Mzg2MzIsImV4cCI6MTY0NjM0MzQzMn0.ISvo4OApoIwLJ6MKvt8k-blW-rLzNErjSjvKCf1xuig"
  }
}
```

------

## `POST /refresh`

Get a new access token.

### Headers

`Authorization: Bearer {refreshToken}`

### Parameters

*None*

### Body

*None*

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjo4LCJlbWFpbCI6ImpuQGJhZGNhbWVyYXBob3RvZ3JhcGh5LmNvbSJ9LCJpYXQiOjE2NDU3MzkxODIsImV4cCI6MTY0NTgyNTU4Mn0.giP2SDTKI8hWSqrBjMORDkpYaYS47ZQUdl317O1tKI4",
  }
}
```

------

# Photos Endpoints

## `GET /photos`

Returns a list of the user's photos.

### Parameters

*None*

### Request

*None*

### Response 200 OK

```json
{
  "status": "success",
  "data": [
    {
      "id": 42,
      "title": "Confetti Photo #1",
      "url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
      "comment": "Confetti"
    },
    {
      "id": 43,
      "title": "Confetti Photo #2",
      "url": "https://images.unsplash.com/photo-1481162854517-d9e353af153d",
      "comment": "Confetti #2"
    },
    {
      "id": 44,
      "title": "Confetti Photo #3",
      "url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
      "comment": "Confetti #3"
    },
    {
      "id": 45,
      "title": "Happy Photo",
      "url": "https://images.unsplash.com/photo-1454486837617-ce8e1ba5ebfe",
      "comment": "So happy"
    }
  ]
}
```

------

## `GET /photos/:photoId`

Get a single photo.

### Parameters

- `photoId` **required** The id of the photo

### Body

*None*

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "id": 42,
    "title": "Confetti Photo #1",
    "url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    "comment": "Confetti"
  }
}
```

------

## `POST /photos`

Create a new photo.

### Parameters

*None*

### Body

```json
{
  "title": "Confetti Photo #1",
  "url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
  "comment": "Confetti"
}
```

- `title` *string* **required** must be at least 3 chars long
- `url` *string* **required** must be a url
- `comment` *string* must be at least 3 chars long

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "title": "Confetti Photo #1",
    "url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    "comment": "Confetti",
    "user_id": 4,
    "id": 47
  }
}
```

------

## `PUT /photos/:photoId`

Update an existing photo.

### Parameters

- `photoId` **required** The id of the photo

### Body

```json
{
  "title": "When life gives you confetti, celebrate",
  "comment": "Yolo"
}
```

- `title` *string* must be at least 3 chars long
- `url` *string* must be a url
- `comment` *string* must be at least 3 chars long

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "title": "When life gives you confetti, celebrate",
    "url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    "comment": "Yolo"
    "user_id": 4,
    "id": 47
  }
}
```

------

## `DELETE /photos/:photoId`

Delete a photo (incl. the **links** to any albums, but not the albums themselves).

### Parameters

- `photoId` **required** The id of the photo

### Body

*None*

### Response

`200 OK`

```json
{
  "status": "success",
  "data": null
}
```

------

# Albums Endpoints

## `GET /albums`

Returns a list of the user's albums (excl. photos).

### Parameters

*None*

### Request

*None*

### Response 200 OK

```json
{
  "status": "success",
  "data": [
    {
      "id": 17,
      "title": "Confetti Album",
      "user_id": 4
    },
    {
      "id": 18,
      "title": "Happy Album",
      "user_id": 4
    }
  ]
}
```

------

## `GET /albums/:albumId`

Get a single album, incl. the album's photos.

### Parameters

- `albumId` **required** The id of the album

### Body

*None*

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "id": 17,
    "title": "Confetti Album",
    "photos": [
      {
        "id": 42,
        "title": "Confetti Photo #1",
        "url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
        "comment": "Confetti",
        "user_id": 4
      },
      {
        "id": 43,
        "title": "Confetti Photo #2",
        "url": "https://images.unsplash.com/photo-1481162854517-d9e353af153d",
        "comment": "Confetti #2",
        "user_id": 4
      },
      {
        "id": 44,
        "title": "Confetti Photo #3",
        "url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
        "comment": "Confetti #3",
        "user_id": 4
      }
    ]
  }
}
```

------

## `POST /albums`

Create a new album.

### Parameters

*None*

### Body

```json
{
  "title": "Confetti Album"
}
```

- `title` *string* **required** must be at least 3 chars long

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "title": "Confetti Album",
    "user_id": 4,
    "id": 17
  }
}
```

------

## `PUT /albums/:albumId`

Update an existing album.

### Parameters

- `albumId` **required** The id of the album

### Body

```json
{
  "title": "Confetti'R'Us"
}
```

- `title` *string* **required** must be at least 3 chars long

### Response

`200 OK`

```json
{
  "status": "success",
  "data": {
    "title": "Confetti'R'Us",
    "user_id": 4,
    "id": 17
  }
}
```

------

## `DELETE /albums/:albumId`

Delete an album (incl. the **links** to the photos, but not the photos themselves).

### Parameters

- `albumId` **required** The id of the album

### Body

*None*

### Response

`200 OK`

```json
{
  "status": "success",
  "data": null
}
```

------

## `POST /albums/:albumId/photos`

Add a photo to an album.

### Parameters

- `albumId` **required** The id of the album

### Body

```json
{
  "photo_id": 42
}
```

- `photo_id` *integer* **required** must be an existing photo id

### Response

`200 OK`

```json
{
  "status": "success",
  "data": null
}
```

------

## `POST /albums/:albumId/photos`

Add multiple photos to an album.

### Parameters

- `albumId` **required** The id of the album

### Body

```json
{
  "photo_id": [42, 43, 44]
}
```

- `photo_id` *[integer]* **required** must be an array of existing photo ids

### Response

`200 OK`

```json
{
  "status": "success",
  "data": null
}
```

------

## `DELETE /albums/:albumId/photos/:photoId`

Remove a photo from an album (but not the photo itself!)

### Parameters

- `albumId` **required** The id of the album
- `photoId` **required** The id of the photo

### Body

*None*

### Response

`200 OK`

```json
{
  "status": "success",
  "data": null
}
```
------

#### Time limit

- 1,5 week

## Tools

- Visual Studio Code
- MySQL Workbench/ phpMyAdmin
- Heroku
- Postman





