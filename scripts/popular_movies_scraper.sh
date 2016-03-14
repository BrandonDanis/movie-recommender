for i in 11 12 13 14 15 16 17 18 19 20
do
	python scraper.py $(($(($i - 1)) * 10)) $i
	python movie_runtime_loader.py $i
	python fix_json_files.py $i
	python runtime_merge.py $i
done
