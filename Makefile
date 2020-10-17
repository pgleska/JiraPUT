app:
	rm -rf ./build
	./gradlew build
#	java -jar build/libs/myesn-0.1.0.jar
	cp -f ./build/libs/projectdb-0.1.0.jar ./docker/app/projectdb.jar
