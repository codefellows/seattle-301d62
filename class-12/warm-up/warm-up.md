# Warm-Up Exercise
Read through this code as if you are the interpreter. Find all of the mistakes in this code and write down the correct syntax for each mistake.

## views/index.ejs

```
<!DOCTYPE html>
<html>
  <head>
    <title>Code Challenge!</title>
  </head>
  <body>
    <ul>
      <% data.forEach(user => { %>
        <li>
          <h1><%= user.username %></h1>
          <p><%= user.password %></p>
        </li>
      <% }) %>
    </ul>
  </body>
</html>
```
