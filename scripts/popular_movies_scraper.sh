for i in 5 6 7 8 9 10
do
	python scraper.py $(($(($i - 1)) * 10)) $i
	python movie_runtime_loader.py $i
	python fix_json_files.py $i
	python runtime_merge.py $i
done
