import sys

arguments = sys.argv

file_name = 'popular_movies_runtimes_' + arguments[1] + '.json'

f = open(file_name, 'r')
filedata = f.read()
f.close()

newdata = filedata.replace("][", ",")

f = open(file_name, 'w')
f.write(newdata)
f.close()
