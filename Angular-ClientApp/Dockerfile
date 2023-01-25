# BASE IMAGE with an alias #
FROM node:19-alpine3.16 as build
WORKDIR /TimeManagementApp

# Install Angular CLI to run Build #
RUN npm install -g @angular/cli

#Build Angular App
COPY ./package.json .
RUN npm install --legacy-peer-deps
#Deploy
COPY . .
RUN ng build

# BASE IMAGE with an alias #
FROM nginx as runtime
COPY --from=build TimeManagementApp/dist/time-management /usr/share/nginx/html
