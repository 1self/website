# Introduction

1self allows users to collect, compare, correlate and comment on all of their data. 1self’s flexible, adaptable platform let’s users collect all the measurements they care about in 2 ways:

> *   Using 1self, users manually collect any measurement they can imagine     
> *   By providing an API for developers to automatically send user’s measurement data

This guide is for developers, rather than users. Use cases for the API can be found [here](#use-cases). Two types of developers will find this guide useful: Application developers and integration developers. Application developers engage users through API provided visualizations. Integration developers connect existing data, such as Twitter or Facebook, to the 1self Platform.

## Overview

The API is a vertically integrated storage, analytics and visualization application stack for human measurement. Events, representing human measurements, are fed into 1self. The developer calls an API which provides event visualizations and insights to the user. Developers describe event metadata and values, 1self does everything else.

![Overview](../images/intro.png)

## Concepts

> *   **_Applications_** are web or native programs that provide value to users. Applications integrate with 1self to record interactions and show the data back to their users. Applications are a type of integration.
> *   **_Collectors_** are headless web apps that collect a user’s data from existing APIs and send it to 1self. Collectors can be transient, meaning they collect the currently available information. Or, they can be historical, meaning they collect historical data and send it to 1self. Collectors are a type of integration.
> *   **_Integrations_** are any type of software that make use of the 1self platform.
> *   **_Devices_** are objects that contain one or more sensors that can record personally relevant information about an individual. Devices can send data direct to 1self if they have that capability or via a companion application.
> *   **_Events_** capture data about the self. Events may be about physiology, environment or activity. Events represent something about the self that happened at a particular point in time.
> *   **_Streams_** are a logical collection of events on the 1self API. They provide a place to read and write events for applications and integrations. They control event access and coordinate integration synchronisation.
> *   **_Visualizations_** aggregate and display events to show users useful views of themselves. Currently, there is one visualization, the barchart. More will be added soon.
> *   The **_Event API_** is the set of rest endpoints that allow the reading and writing of events.
> *   The **_Visualization API_** is the set of rest endpoints that allow applications to display a visualization based on a set of parameters.</div>

## Use Cases

1self is designed to significantly reduce the cost of understanding personal data. Here’s how.


#Use cases
1self is designed to significantly reduce the cost of understanding personal data. Here’s how.

## User Silo Connector
Often, personal data resides in places that don’t provide good tools for understanding it. Building better personal data applications involves reading, transforming, storing, syncing and visualizing the data. Once data is visualized, users want to easily share the data. All this is difficult and time-consuming - requiring serious expertise across a wide technology stack.

Don’t build your own, let 1self do most of the work for you. You simply read the source data, convert it into 1self events and use our syncing hooks. Once the data is in 1self, visualizations come out of the box. As we build new visualizations, they automatically appear for the data. Users can share the visualizations with their friends.

For example, Facebook doesn’t give you any messaging statistics. You can’t understand how your messaging behaviour has changed over time. But connecting that data to 1self would allow it to be easily visualized.

To learn how to build a silo connector start with the following guides:</span>

* [Hello, 1self - an introduction to the platform](/developer/#!/resources/hello1self)
* [Integration Guide](/developer/#!/resources/integration_guide)

##Snapshotting connector
Many apis don’t provide rich historical access. To build a historical view, you need to periodically snapshot the data. The system must read, store and visualize the data; it must schedule the data collection.

1self takes care of everything but reading the data. You write code to read source data and hook into our snapshotting endpoints. 1self stores the data and shows it back to users so that they can understand trends over time. Users can share their trends to canvas opinion and show off.

For example, the twitter api provides a follower count - but no historical view. 1self makes it easy to build a snapshotting connector that periodically picks up data to provide a chronological perspective.

To learn how to build a snapshotting connector start with the following guides:

* [Hello, 1self - an introduction to the platform](/developer/#!/resources/hello1self)
* [Integration Guide](/developer/#!/resources/integration_guide)

# 1self integrated app
As users interact with applications - web or native - data about them is generated. This data is interesting to users, it creates a more engaging in-app experience - but application developers have precious little time to surface it. Building a system to capture the data themselves is expensive.

1self makes it trivial to show users their data - significantly reducing the cost of an engaging user data experience. Describe user events, send them to our api and embed our interactive visualizations. Using 1self, your users build a history with your app - making their experience stickier. Using our social features, your users share their experience with their networks - creating exposure for your app.

For example, [1self noise](https://itunes.apple.com/us/app/noise-by-1self/id933101357?mt=8)&nbsp;shows users their noise data, as they collect it.

To learn how to build a 1self integrated app start with the following guides:

* [Hello, 1self - an introduction to the platform](/developer/#!/resources/hello1self)
* [Integration Guide](/developer/#!/resources/integration_guide)

# Manual collector
Eventually we’ll live in a world of ubiquitous sensors and personal data. Until then, there are aspects of ourselves that can only be measured manually. Building personal data collection applications takes time, knowledge and effort. Building them is hard - even for developers. You need to describe the data, build the app, build the api, store the data and design the visualizations.

1self lets you build manual collection apps quickly: it provides cross-platform collection, reliable storage and beautiful visualizations. 

For example, 1self [temperature](http://temperature.1self.co)&nbsp;was created in an hour. It manually captures measurements from an off-the-shelf digital thermometer.

To learn how to build a manual collector, start with the following guides:

* [Hello, 1self - an introduction to the platform](/developer/#!/resources/hello1self)
* [Integration Guide](/developer/#!/resources/integration_guide)

# Sensor capture
The world around us is becoming instrumented with sensors. These sensors will be used not only for machine to machine intelligence, but also to help people better understand their world. As a manufacturer - or hacker - of sensors, building a backend to capture, store and visualize that data is expensive and time consuming.

1self let’s you concentrate on building better sensors. Rather than building your own, use our platform to capture and visualize the sensor data. Sensors can be pre-loaded with the configuration required to write to our api. Once sensor data is in 1self, users can understand it better through insights and visualizations provided by the platform. They can share their data using our social features.