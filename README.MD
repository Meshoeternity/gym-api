# Backend routes
| HTTP Method | URL | Request Body | Success status | Error status | Description |
|-------------|-----|--------------|----------------|--------------|-------------|
|   Post      |/signup|(firstName,lastName,email,password,avatar)|201|400|       |
|        |/login|(email,password)|200|400|                                  |
|Post        |/login/admin|(email,password)|200|         403|                    |
|Get         |/profile|                    |200|404    |                         |
|Post        |/add-admin|(firstName, lastName, email, password, avatar)|200|500| |
|Get         |/users|                    |    |   |                         |
|DELETE      |/users/:id|                | 200|500 |                         |
