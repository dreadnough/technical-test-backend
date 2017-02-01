FROM mongo

COPY mongosetup.json /mongosetup.json
CMD mongoimport --host=mongo --port=27017 --db testForBackend --collection citystats --type json --file mongosetup.json --jsonArray