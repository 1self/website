# Introduction

1self allows users to collect, compare, correlate and comment on all of their data. 1self’s flexible, adaptable platform let’s users collect all the measurements they care about in 2 ways:

> *   Using 1self, users manually collect any measurement they can imagine     
> *   By providing an API for developers to automatically send user’s measurement data

This guide is for developers, rather than users. Use cases for the API can be found here. Two types of developers will find this guide useful: Application developers and integration developers. Application developers engage users through API provided visualizations. Integration developers connect existing data, such as Twitter or Facebook, to the 1self Platform.

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