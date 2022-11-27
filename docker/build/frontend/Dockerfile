FROM node:18.10
WORKDIR /opt/jiraput/frontend
COPY . .
RUN npm install -g @angular/cli && npm install 
ENTRYPOINT ng serve --host 0.0.0.0 --port 4200 --disableHostCheck
