app:
	rm -rf ./build
	gradle build
	cp -f ./build/libs/jiraput-0.1.0.jar ./docker/build/backend/jiraput.jar
