.PHONY: test build run stop

test:
	cd backend && mvn test -Dspring.profiles.active=dev
	cd frontend && npm test -- --run

build:
	cd backend && mvn package -DskipTests
	cd frontend && npm run build

run:
	docker-compose up --build

stop:
	docker-compose down
