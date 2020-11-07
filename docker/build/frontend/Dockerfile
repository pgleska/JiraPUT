FROM node:12.0
WORKDIR /opt/jiraput/frontend
COPY . .
RUN npm install -g @angular/cli && npm install
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]

