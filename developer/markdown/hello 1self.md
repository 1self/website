Hello 1self

# Introduction

We’ve designed the 1self platform to create a simple, friction-free developer experience. Once you feed in human information you get beautiful, shareable, commentable visualizations of what the data represents. Let’s work through a simple example so that you can understand what is possible using the api.

# The example

Every developer knows that the first thing you build in any new technology is ‘hello, world’. Since 1self is all about visualising human information we’re going to build ‘hello, 1self":  a web app that lets developers visualise every ‘hello, world’ they write.

If you want to jump straight into the commented code, without an explanation, [you can find it here on Github](https://github.com/QuantifiedDev/hello1self). 

# The app

Here is the app, have a play. Set the number of ‘Hello,world’ lines of ‘hello, world’ and click the log button. When you click log, the visualization shows the total number of lines of code. Make sure you come back to the app every time you write ‘hello, world’!

<INSERT THE APP>

# Code Overview

There are 3 code steps we must implement to integrate user information visualizations in an app. ‘Hello, 1self’ is no different - here’s what we need to do:

1. Create a *stream*, a time-ordered container for events. 
2. Write an *event*, 1self’s representation of human information, to the stream
3. Create a *visualization*, a view of the events

Step 1 & 2 involve calling REST endpoints and processing the results. In step 3 we’ll construct a visualization URL, according to a scheme, and give it to a browser to fetch and display. The browser and 1self take care of building the interactive visualization. Our app doesn’t have to worry about registration, login, navigation or sharing. We’ll get all of those by giving the browser a correctly defined URL.

Since we’re building a web app the language will be javascript. We’ll start by writing a function that carries out the 3 steps. Once the function is complete we’ll plug it into a simple web page using html and css. 

`var logHelloWorld = function(){`
`};`

Great start! Now we’re going to make it do something.

# Step1, Create a Stream

First, we create a stream to feed in the information about our users. To create a stream we need an app key and app secret which we get from here <INSERT LINK>. Let’s create the stream using the app key and secret hello1self:hello1self.

` 1 var logHelloWorld = function(){`
` 2     var xmlhttp = new XMLHttpRequest();`
` 3	 if(localStorage.streamid === undefined){`
` 4	     xmlhttp.open("POST","https://api.1self.co/v1/streams", false);`
` 5         xmlhttp.setRequestHeader("Authorization", "hello1self:hello1self");`
` 6         xmlhttp.send();`
` 7         var response = JSON.parse(xmlhttp.response);`
` 8         localStorage.streamid = response.streamid;`
` 9         localStorage.readtoken = response.readToken;`
`10         localStorage.writetoken = response.writeToken;`
`11     }`
`12 }`

The crucial lines here are 4, 5, 6 and 7. Line 4 constructs a request to create the stream through the POST method on the streams resource. The request is secure as it’s over https. Line 5 sets the app key and app secret which is how the call is authorized. Line 6 sends the request and line 7 parses the result of that request. The result is a JSON response that looks like this:

`{`

`    "streamid": "YBEBZPADSKPUDXBG",`

`    "writeToken": "0d9a60e8001895a977c33eead02e32b18b1c6d2e2d5c",`

`    "readToken": "51eb4902856e30a11dc5153e1e65cac7aab3390cf67d",`

`}`

Stream id identifies the stream uniquely. The tokens, writeToken and readToken, grant access to the the stream. Lines 8-10 saves the stream details to local storage to allow subsequent sessions to add events to the same stream.

Now we can add information about writing hello world programs .

# Step 2, Write Events

An event is 1self’s fundamental unit of information about a human. Your heart beat, how long you spend brushing your teeth and a sample of noise from your environment can all be represented as an event. Events are described by an action on an object taken by a human. Here’s how that looks for ‘hello, world".

`15 var helloWorldEvent = {`
`16                    "dateTime": new Date().toISOString(),`
`17                    "objectTags": ["computer", "program", "helloworld"],`
`18                    "actionTags": ["write"],`
`19                    "properties": {`
`20                        "linesofcode": parseInt(document.getElementById('linesofcode').value)`
`21                    }`
`22                };`

There are 4 key elements to the event:

1. *dateTime*, the time that the action took place, ISO formatted.
2. *objectTags*, a set of tags describing the object involved in the action
3. *actionTags*, a set of tags describing the action itself
4. *properties*, a bag of key-value pairs that describe measurements, attributes and labels of the action.

The action is: you wrote a hello world computer program. We set the object tags to ["computer", “program”, “helloworld”] and use the present tense of wrote, “write”, as the action tag. We’re interested in the number of lines of code so we add a property “linesofcode”. It takes it’s value from an HTML element.

Non-trivial actions can be tricky to define events for. To learn more, have a look at our event description guide. <INSERT LINK>

Now we can send the event to the api. We use an HTTP POST to the events resource. The URL for the events resource is: [/v1/streams/:streamid/events](https://api.1self.co/v1/streams/XSNJWEIXLCCDSQTV/events)

`24 xmlhttp.open("POST", "https://api.1self.co/v1/streams/" `
`25    					+ localStorage.streamid`
`26    					+ "/events"`
`27    					, false);`
`28     xmlhttp.setRequestHeader("Authorization", localStorage.writetoken);`
`29     xmlhttp.setRequestHeader("Content-Type", "application/json");`
`30     xmlhttp.send(JSON.stringify(helloWorldEvent));`

On lines 24 to 27 we choose the POST method to and construct the resource URL. Ours is [/v1/streams/XSNJWEIXLCCDSQTV/events](https://api.1self.co/v1/streams/XSNJWEIXLCCDSQTV/events). 

We must prove that we may write to the stream. On line 28 we set the Authorization header to the write token from the stream creation response.

All that’s left is the Content-Type header. On line 29 we tell the server the request is encoded in JSON.

Line 30 encodes our event as JSON and makes the request. All being well, the server will respond with 200 OK. 

# Step 3, Visualize 

With the events written, we want to visualize the number of lines of code. We specify which events to include, the measurement, the aggregation, how to treat time and the visualization type. We describe this in a URL, then pass it to a browser.

`32 var visualizationUrl = "https://api.1self.co/v1/streams/" `
`33							+ localStorage.streamid`
`34							+"/events/computer,program,helloworld/write/sum(linesofcode)/daily/barchart";`			
`35 var iframe = document.getElementById("visualization");`
`36 iframe.src = visualizationUrl;`

On lines 32 - 34 the url is constructed. It’s hard to see it in code; here’s how it appears in memory:

[/v1/streams/XSNJWEIXLCCDSQTV/events/computer,program,helloworld/write/sum(linesofcode)/daily/barchart](https://api.1self.co/v1/streams/XSNJWEIXLCCDSQTV/events)

The first part of the URL, up to and including events, we’ve seen before. It’s the stream events resource we wrote the event to. We specify the visualization as sub-resources.

## Object tags

[computer,program,helloworld](https://api.1self.co/v1/streams/XSNJWEIXLCCDSQTV/events)[/write/sum(linesofcode)/daily/barchart](https://api.1self.co/v1/streams/XSNJWEIXLCCDSQTV/events)

The first resource is the object tags. We tell 1self to visualize events with computer, program and helloworld tags. They match the event we wrote to the stream.

## Action Tags

[computer,program,helloworld](https://api.1self.co/v1/streams/XSNJWEIXLCCDSQTV/events)[/write](https://api.1self.co/v1/streams/XSNJWEIXLCCDSQTV/events)[/sum(linesofcode)/daily/barchart](https://api.1self.co/v1/streams/XSNJWEIXLCCDSQTV/events)

The second resource is the action tags. We tell 1self to visualize events with ‘write’ in the action tags. 1self uses the boolean operator *and *to filter the events. 1self will include events with ‘computer’,’program’,’helloworld’ object tags *and* with ‘write’ action tags.

## Aggregation Function

[computer,program,helloworld/](https://api.1self.co/v1/streams/XSNJWEIXLCCDSQTV/events)[write](https://api.1self.co/v1/streams/XSNJWEIXLCCDSQTV/events)[/sum(linesofcode)](https://api.1self.co/v1/streams/XSNJWEIXLCCDSQTV/events)[/daily/barchart](https://api.1self.co/v1/streams/XSNJWEIXLCCDSQTV/events)

The third resource is the aggregation function. We specify sum(linesofcode) and 1self adds the linesofcode measurements in the event properties. More details on the functions available are here. <INSERT LINK>

## Time Bucket

[computer,program,helloworld/write/](https://api.1self.co/v1/streams/XSNJWEIXLCCDSQTV/events)[sum(linesofcode)](https://api.1self.co/v1/streams/XSNJWEIXLCCDSQTV/events)[/daily](https://api.1self.co/v1/streams/XSNJWEIXLCCDSQTV/events)[/barchart](https://api.1self.co/v1/streams/XSNJWEIXLCCDSQTV/events)

The fourth resource is the time bucket. Daily tells 1self to return a visualization showing sums of linesofcode *per day*. 

## Visualization Type

[computer,program,helloworld/write/sum(linesofcode)/daily/](https://api.1self.co/v1/streams/XSNJWEIXLCCDSQTV/events)[barchart](https://api.1self.co/v1/streams/XSNJWEIXLCCDSQTV/events)

Finally, we tell 1self to display lines of code per day *as a barchart*.

The complete scheme for the visualization url is: `https://api.1self.co/`[v1/streams/:streamid/events/:objecttags/:actiontags/:aggregation/:timebucket/:visualization/](https://api.1self.co/v1/streams/XSNJWEIXLCCDSQTV/events)

Next we give the visualization URL to the browser. Line 35 gets the iframe and line 36 sets the URL. The browser and 1self work together to allow interaction, login and sharing. All without needing to write any extra code.

With a complete function it’s time to plug in some html and CSS to create the app:

`01 <html>`
`02 <script>`
`03 var logHelloWorld = function (){`
`04     var xmlhttp = new XMLHttpRequest();`
`05     if(localStorage.streamid === undefined){`

`06         xmlhttp.open("POST","https://api-test.1self.co/v1/streams", false);`

`07         xmlhttp.setRequestHeader("Authorization", "1selfnoise:12345678");`

`08         xmlhttp.send();`

`09         var response = JSON.parse(xmlhttp.response);`

`10         localStorage.streamid = response.streamid;`

`11         localStorage.readtoken = response.readToken;`

`12         localStorage.writetoken = response.writeToken;`

`13     }`

`14`

`15    var helloWorldEvent = {`

`16        "dateTime": new Date().toISOString(),`

`17        "objectTags": ["computer", "program", "helloworld"],`

`18        "actionTags": ["write"],`

`19        "properties": {`

`20            "linesofcode": parseInt(document.getElementById('linesofcode').value)`

`21        }`

`22    };`

`23`

`24    xmlhttp.open("POST", "https://api-test.1self.co/v1/streams/" `

`25    					+ localStorage.streamid`

`26    					+ "/events"`

`27    					, false);`

`28    xmlhttp.setRequestHeader("Authorization", localStorage.writetoken);`

`29    xmlhttp.setRequestHeader("Content-Type", "application/json");`

`30    xmlhttp.send(JSON.stringify(helloWorldEvent));`

`31`

`32    var visualizationUrl = "https://api-test.1self.co/v1/streams/" `

`33							+ localStorage.streamid`

`34							+  "/events/computer,program,helloworld/write/sum(linesofcode)/daily/barchart";`

`35			`

`36    var iframe = document.getElementById("visualization");`

`37    iframe.src = visualizationUrl;`

`38    }`

`39 </script>`

`40 <style>`

`41	input{`

`42		border: 2px solid grey;`

`43		border-radius: 8px;`

`44		height: 30px;`

`45		width: 200px;`

`46	}`

`47`

`48	h1{`

`49		margin-top: 100px;`

`50		font-family: helvetica`

`51	}`

`52`

`53	div{`

`54		text-align: center;`

`55	}`

`56`

`57	iframe{`

`58		width: 320;`

`59		height: 568;`

`60		margin-top: 50px;`

`61	}`

`62 </style>`

`63 <body>`

`64 <div>`

`65	<h1>Hello, 1self</h1>`

`66	<input id="linesofcode" type="number" value="lines of hello, world code">`

`67	<input type="button" value="log" onclick="logHelloWorld()">`

`68	<div></div>`

`69	<iframe id="visualization">`

`70	</iframe>`

`71 </div>`

`72 </body>`

`73 </html>`

The latest full listing, with comments, can also be found on Github here. <INSERT LINK>

# Summary

Any app can integrate 1self visualizations by calling 3 REST apis. We’ve walked through a complete example. We’ve added human actions to 1self and visualized in a few lines of code. Now you’re ready to add 1self to your app or write an integration to a 3rd party data source.

# Further reading

The detailed developer guide<INSERT LINK>. 

Rest api documentation <INSERT LINK>.

Developer FAQ <INSERT LINK>.

Main FAQ <INSERT LINK>

