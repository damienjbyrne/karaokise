# karaokise
Developing a karaoke management system for the future (or some friends)

## Setup
What is here at the moment is a very simple nodejs script to create a json 
file of filename, title and artist from the id3 tags in the mp3s in the target
directory.  To setup, you first need npm installed then run a :

    > npm install

to get the dependencies.  

## Generating the json
To run the generate script you just need to run:

   > nodejs generate-id3s.js

This will run the script on the directory specified in the script and generate a
file with a variable declaration creating a json object.  This is then picked up by
the javascript in the html file.

This is all very rudamentary and an initial proof of concept.
