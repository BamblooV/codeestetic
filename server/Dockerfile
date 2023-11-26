FROM node:18 as build
WORKDIR /user/app
COPY . .
RUN npm install

FROM node:18-alpine
WORKDIR /user/app
COPY --from=build /user/app /user/app
CMD ["npm", "run", "start"]