FROM php:8.3-apache

RUN docker-php-ext-install pdo_mysql

WORKDIR /var/www/html
COPY index.html resume.html ./
COPY assets/ ./assets/
COPY backend/api/ ./api/

RUN php -l /var/www/html/api/contact.php

EXPOSE 80
