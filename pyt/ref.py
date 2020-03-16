from pytube import Playlist, YouTube
import os

'''
https://www.youtube.com/playlist?list=PLLGT0cEMIAzeqDa_h5pEQI4V2kjS2sxVH
https://www.youtube.com/playlist?list=PLLGT0cEMIAzd9_PKkkq6eJr9RjHDvKUXC
https://www.youtube.com/playlist?list=PLLGT0cEMIAzf2ye4spDr9HM-rGgbDifZQ
'''

d = input("Name of download folder: ")
n = int(input("How many playlists: "))
print("Enter playlist urls")

playlist = set()
for i in range(n):
    for vid in Playlist(input()):
        playlist.add(vid)

total = len(playlist)
for num, url in enumerate(playlist):
    print(f"Song number {num+1} of {total}: {url}")
    try:
        YouTube(url).streams.filter(only_audio=True)[0].download(f"./{d}")
    except:
        print("Video failed to download, skipping")

for file in os.listdir(d):
    os.rename(f"{d}/{file}", f"{d}/{''.join(file.split('.')[:-1])}.mp3")
