docker stop phpmyadmin
docker rm phpmyadmin
docker run -it -d -e MYSQL_ROOT_PASSWORD=13454678qwerty -e PMA_HOST=auto-db --link auto-db -p 8080:80 --name phpmyadmin phpmyadmin
