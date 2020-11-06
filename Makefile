app:
	rm -rf ./build
	gradle build
	cp -f ./build/libs/projectdb-0.1.0.jar ./docker/backend/projectdb.jar
