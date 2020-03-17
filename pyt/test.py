"""Download YouTube videos in mp3 format."""
import sys
import os
import zipfile
import pytube

def main():
	"""Download YouTube videos in mp3 format."""

	# load videos while removing duplicates
	print("Preparing to download, this may take a while...")
	# d, *pls = sys.argv[1:]
	d = sys.argv[1]
	pls = sys.argv[2:]
	path = f"./{d}"

	vids = {}
	for pl in pls:
		for i, url in enumerate(pytube.Playlist(pl)):
			try:
				yt = pytube.YouTube(url)
				vids[yt.title] = (yt, url)
			except:
				print(f"Could not prepare video {url} (video private, deleted, copyright etc)")

	# download videos
	print("Downloading...")
	n = len(vids)
	i = 1
	for title, vid in vids.items():
		yt, url = vid

		try:
			print(f"{i} of {n} - {url} : {title}")
		except:
			print(f"{i} of {n} - {url} : titleError")

		try:
			yt.streams.filter(only_audio=True)[0].download(path)
		except:
			print("Download failed, skipping..")
		i += 1
	print("Done downloading.")


	# convert from mp4 to mp3
	print("Converting...")
	for file in os.listdir(path):
		os.rename(f"{path}/{file}", f"{path}/{''.join(file.split('.')[:-1])}.mp3")
	print("Done converting.")


	# zip all files in dir
	print("Zipping...")
	zipf = zipfile.ZipFile(f"{d}.zip", 'w', zipfile.ZIP_DEFLATED)
	for root, dirs, files in os.walk(path):
		for file in files:
			zipf.write(os.path.join(root, file))
	zipf.close()
	print("Done zipping.")

if __name__ == '__main__':
	main()
