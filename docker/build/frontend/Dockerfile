FROM node:12.0
WORKDIR /opt/jiraput/frontend
COPY . .
RUN npm install -g @angular/cli && npm install 
ENTRYPOINT ng add @ng-bootstrap/ng-bootstrap && ng serve --host 0.0.0.0 --port 4200 --disableHostCheck true
# CMD ["ng", "add", "@ng-bootstrap/ng-bootstrap", "&&","ng", "serve", "--host", "0.0.0.0", "--port", "4200"]

