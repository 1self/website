# Environments
There are two environments that host the api. The sandbox URL is http://sandbox.1self.co and live is https://api.1self.co. To get started [request your api key](http://www.1self.co/developer/#!/api), which gives you access to the sandbox. When you're ready to go live, [email us](mailto:team@1self.co) and we'll promote your app to live.

# POST /v1/streams

Data sources like apps or plugins use a stream to record and visualize events. Once you have a streamid and tokens for reading and writing, you can send events to 1self.

## Resource URLS
Live:     [https://api.1self.co/v1/streams](https://api.1self.co/v1/streams)
Sandbox:  [https://sandbox.1self.co/v1/streams](https://sandbox.1self.co/v1/streams)

## Resource Information

<table>
  <tr>
    <td>Response Formats</td>
    <td>JSON</td>
  </tr>
  <tr>
    <td>Requires authentication</td>
    <td>Yes, authentication of data source using client id and secret. </td>
  </tr>
  <tr>
    <td>Rate limited?</td>
    <td>Non-commercial: free
Commercial: Free during beta</td>
  </tr>
  <tr>
    <td>Request Body</td>
    <td>No</td>
  </tr>
  <tr>
    <td>Possible Responses</td>
    <td>200 OK
401 Unauthorized</td>
  </tr>
</table>


## URL Parameters

None

## Headers

<table>
  <tr>
    <td>Authorization</td>
    <td>{clientid}:{clientsecret}</td>
  </tr>
</table>


## Response fields

<table>
  <tr>
    <td>streamid</td>
    <td>non secret identifier for a stream</td>
  </tr>
  <tr>
    <td>readtoken</td>
    <td>secret token for reading events from a stream</td>
  </tr>
  <tr>
    <td>writetoken</td>
    <td>secret token for writing events to a stream</td>
  </tr>
</table>


## Example Request:

```
POST /v1/streams HTTP/1.1
Host: sandbox.1self.co
Authorization: democlientid:d69e6fd81afca9faea6262e312aa82f716cab3c10899
```


## Example Response:

```
{
    "streamid": "GVMQJABSPFULCJUW",
    "writeToken": "0cc82228d40e964df6c7c1d7f8ea530ad703fd2f175e",
    "readToken": "faea6262e312aa8d692f716cab3c10899e6fd81afca9"
}
```


### POST /v1/streams/:streamid/events

Adds an event to a stream. All events are added to 1self by adding them to a stream. See here for a detailed explanation of events

## Resource URL

Live: [https://api.1self.co/v1/streams/GVMQJABSPFULCJUW/events/](https://api.1self.co/v1/streams)
Sandbox: [https://sandbox.1self.co/v1/streams/GVMQJABSPFULCJUW/events/](https://sandbox.1self.co/v1/streams)

## Resource Information

<table>
  <tr>
    <td>Request Formats</td>
    <td>JSON</td>
  </tr>
  <tr>
    <td>Response Formats</td>
    <td>JSON</td>
  </tr>
  <tr>
    <td>Requires authentication</td>
    <td>Yes, stream write token</td>
  </tr>
  <tr>
    <td>Rate limited?</td>
    <td>Non-commercial: Free
Commercial: Free in Beta</td>
  </tr>
  <tr>
    <td>Request Body?</td>
    <td>Yes</td>
  </tr>
  <tr>
    <td>Possible Responses</td>
    <td>200 OK
401 Unauthorized</td>
  </tr>
</table>


## Request Body

The event to be added to the stream

<table>
  <tr>
    <td>Request Field</td>
    <td>Required?</td>
    <td>Description</td>
  </tr>
  <tr>
    <td>objectTags</td>
    <td>yes</td>
    <td>a collection of tags describing the object that an event relates to</td>
  </tr>
  <tr>
    <td>actionTags</td>
    <td>yes</td>
    <td>the action that was carried out on an object that caused an event to be emitted</td>
  </tr>
  <tr>
    <td>datetime</td>
    <td>no</td>
    <td>the time that the event occured. If this is not provided the current time on the server is used</td>
  </tr>
  <tr>
    <td>properties</td>
    <td>no</td>
    <td>A collection of key value pairs that describes measurements, labels, attributes and dimensions that further describe the event. </td>
  </tr>
</table>


## URL Parameters

None

## Headers

<table>
  <tr>
    <td>Authorization</td>
    <td>write token</td>
  </tr>
  <tr>
    <td>Content-Type</td>
    <td>application/json</td>
  </tr>
</table>


## Response fields

<table>
  <tr>
    <td>status</td>
    <td>http status</td>
  </tr>
</table>


## Example Request:

```
POST /v1/streams/GVMQJABSPFULCJUW/events HTTP/1.1
Host: sandbox.1self.co
Authorization: 0cc82228d40e964df6c7c1d7f8ea530ad703fd2f175e

{
  "objectTags": ["teeth","oral","mouth"],
  "actionTags": ["brush","clean"],
  "properties": {
    "duration": 120,
    "pressureKgSqm": 0.15
  },
   "datetime": "2014-11-11T22:30:00.000Z"
}
```


## Example Response:

```
{
    "status": "ok"
}
```


### POST /v1/streams/:streamid/events/:objecttags/:actiontags/:aggregation/:timerollup/:visualization?readToken=:readtoken

Creates an html visualization of a stream’s events. This is the entry point for the user into their data on 1self. On live, api.1self.co, this call redirects to app.1self.co, then the visualization is loaded. This endpoint is designed to be given to a browser or webview to render. 

## Resource URL

Live: [https://api.1self.co/v1/streams/:streamid/events/:objecttags/:actiontags/:aggregation/:timerollup/:visualization?readToken=:readtoken]()
Sandbox: [https://sandbox.1self.co/v1/streams/:streamid/events/:objecttags/:actiontags/:aggregation/:timerollup/:visualization?readToken=:readtoken]()

## Resource Information

<table>
  <tr>
    <td>Request Formats</td>
    <td></td>
  </tr>
  <tr>
    <td>Response Formats</td>
    <td>HTML</td>
  </tr>
  <tr>
    <td>Requires authentication</td>
    <td>Yes, readToken in the query parameter</td>
  </tr>
  <tr>
    <td>Rate limited?</td>
    <td>Non-commercial: Free
Commercial: Free</td>
  </tr>
  <tr>
    <td>Request Body?</td>
    <td>No</td>
  </tr>
  <tr>
    <td>Possible Responses</td>
    <td>200 OK
401 Unauthorized</td>
  </tr>
</table>


## Request Body

None

## Route Parameters

<table>
  <tr>
    <td>streamid</td>
    <td>the stream identified</td>
  </tr>
  <tr>
    <td>objecttags</td>
    <td>tags describing the object that the event originates from. </td>
  </tr>
  <tr>
    <td>actiontags</td>
    <td>tags describing the action on the object that gave rise to the event</td>
  </tr>
  <tr>
    <td>aggregation</td>
    <td>a function of an event property to calculate. Possible values are:
sum({property})
mean({property})
count({property})</td>
  </tr>
  <tr>
    <td>timerollup</td>
    <td>the time period to roll the data up to. Possible values are:
daily</td>
  </tr>
  <tr>
    <td>visualization</td>
    <td>the type of visualization to use. Possible values are:
barchart</td>
  </tr>
</table>


## URL Parameters

<table>
  <tr>
    <td>readToken</td>
    <td>the stream’s readtoken from stream creation</td>
  </tr>
</table>


## Headers

None

## Example Request:

```
GET
/v1/streams/GVMQJABSPFULCJUW/events/self/sit/sum(duration)/daily/barchart?readToken=e7a68f89509ab4d7b13d1e116dd10d2aad43ed97053991816447ca06ea321ad1 HTTP/1.1
Host: sandbox.1self.co
Authorization: 0cc82228d40e964df6c7c1d7f8ea530ad703fd2f175e
```


## Example Response:

```
{
    "status": "ok"
}
```