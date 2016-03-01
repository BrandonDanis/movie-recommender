import json
import requests
import time

json_data = open('popular_movies_data.json').read()

data = json.loads(json_data)
runtimes = []
i = 1
id = -1
runtime_json = {}

try:
    for file_json_data in data:
        if i % 10 == 0 and len(runtimes) != 0:
            with open('popular_movies_runtimes.json', 'a') as outfile:
                print(runtimes)
                print('Writing to JSON file...')
                json.dump(runtimes, outfile)
                print('Completed writing to JSON file...')
                runtimes.clear()
                print(runtimes)

        id = file_json_data['id']
        run = True
        while run:
            runtime_load = requests.get(
                'https://api.themoviedb.org/3/movie/' + str(id) + '?api_key=476bbe4282fb66cfbd54f6da2d3d28fe')
            runtime_json = runtime_load.json()
            if 'title' not in runtime_json:
                print('Waiting 60 seconds because going over request limit...')
                time.sleep(60)
                run = True
                print('Finished waiting 60 seconds...')
            else:
                run = False
        runtime = {'id': id, 'title': runtime_json['title'], 'runtime': runtime_json['runtime']}
        print(runtime)
        runtimes.append(runtime)
        i += 1
finally:
    print('Ended at ID ' + str(id))
    print(runtime_json)
    with open('popular_movies_runtimes.json', 'a') as outfile:
        print(runtimes)
        print('Writing to JSON file...')
        json.dump(runtimes, outfile)
        print('Completed writing to JSON file...')
