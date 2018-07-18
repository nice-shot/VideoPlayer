# Some Notes

## How to run

Install required packages:
```
npm install
```

Run the server:
```
npm start
```

Browse to http://localhost:8080

## Firestore

The database is built in a way to allow multiple videos. There is one
collection named "videos" and inside it are documents with three number
fields: views, likes and dislikes.
Since this is a very small application this structure will suffice, but if we
wanted to make it production ready and allow multiple users to update the
counters, we would need to change the structure a bit and add distributed
counters as explained here:
https://firebase.google.com/docs/firestore/solutions/counters


## Security

Right now the client can only see and update the specific document for this
video. However, he is not limited to just increasing the views counter and
increasing/decreasing the likes/dislikes counters. Technically a client can
add new fields or completely change the existing ones. It could be possible
to add more rules to prevent this in firestore, but another solution would be
to create a small RESTful service that receives an "add view" or "add thumbs
down" request.

## Frameworks and compatability

I chose not to use a UI framework like bootstrap or a JS framework like react.
This means that it might look and run differently on different browsers and
devices. I wanted to focus on the main task, so while it should work on most
modern browsers, it will probably work best on a computer running chrome.

## Thumbs functionality
I assumed the thumbs up/down should work as a toggle so users could downvote
the same video more than once.

## Errors
Right now problems with the video playback or the social functionality are not
displayed to the user. I figured it was beyond the scope of this exercise and
decided to just add console.error messages for firebase issues and keep the
social details as '?' if no data is available.
