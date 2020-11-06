FROM node
WORKDIR /opt/projectdb/frontend
COPY . /opt/projectdb/frontend
RUN npm install -g @angular/cli @angular-devkit/build-angular && npm install
EXPOSE 4200
ENTRYPOINT npm start
