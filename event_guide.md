---
layout: page
title: Event Guide
permalink: /event_guide/
---

# About This Guide

This guide is for developers creating 1self integrations and applications. See the use cases for the 1self platform here. <<INSERT LINK>>. This guide explains the 1self metadata and conventions.

In this guide, ‘must’ means compulsory advice and ‘should’ means strong recommendation. When compulsory advice is ignored, no guarantees are made about 1self’s behaviour.

# Events Overview 

1self captures your data to help you live a smarter life. The **_event_** is 1self’s unit of data capture. On the event, object and actions classify the type of event. Properties contain values that change from one event to another.  

The **_object_** is a noun: you, the things you act upon, or your environment. They are represented in the event using **_object tags._**

The **_action_** is the thing done, the verb. They are represented using **_action tags._**

The **_properties_** contain information about the action that was performed. Properties are numerical measurements or text labels. They are a collection of key/value pairs called **_properties_**.

To send data to 1self you must create an event like this:

<table>
  <tr>
    <td>datetime</td>
    <td>20141207T20:00</td>
  </tr>
  <tr>
    <td>object tags</td>
    <td>computer, program, 1selfapp</td>
  </tr>
  <tr>
    <td>action tags</td>
    <td>type, write</td>
  </tr>
  <tr>
    <td>properties</td>
    <td>
    <table>
    <tr>
    <td>
    linesOfCode
    </td>
       <td>
    25
    </td>
    </tr>
        <tr>
    <td>
    Language
    </td>
       <td>
    JavaScript
    </td>
    </tr>

    <tr>
    <td>
    IDE
    </td>
       <td>
    Sublime
    </td>
    </tr>
    
    </table>

</td>
  </tr>
</table>


# Event Meta-data

Object tags, action tags and properties structure a user’s data into events in the 1self database. 1self collates and connects events into visualisations and insights. Visualizations and insights create human readable descriptions using the event metadata. Clear, expressive, convention-following metadata create easy-to-understand visualizations and insights for users.

**_Event types are emergent,_** it’s the combination of the tags and key names in the properties.

**_Object tags_** are a list of nouns. Examples of object tags are ["computer", “software”, “embedded”] or [“teeth”]. 

**_Action tags_** are verbs. Examples of action tags are ["develop"] or [“write”]. Action tags should use the first person present verb tense. 

**_Properties_** are key-value pairs used to describe **_measurements_** and **_labels_**. Examples of properties are "lines-of-code" and “language”

All metadata and values must be lowercase. They must contain only alphanumeric characters and the dash symbol ‘-’. Whenever a tag is shown to the user, raw or visualized, 1self replaces the dash with a space. 

# Meta-data Discovery

Meta-data selection requires you to think. To create an event type you discover the appropriate metadata. You decide whether information should be an object tags or a label. When a tag adds information, you include it. Properties describe measurements and labels.

To illustrate the thought process, let’s work through an example together. Imagine a sublime plugin that captures when a user writes a javascript 1self app like "Hello, 1self". We’re going to step through the thinking required to create a representative, well-formed, robust and linkable event. If, post walkthrough, you’re still not sure, please get in touch <<INSERT LINK>>

## OBJECT TAG DISCOVERY

Let’s create potential object tags that could describe a 1self computer program. For each tag we’ll run through the **_tag selection heuristics_**. A tag selection heuristic is a rule we can use to decide whether to include a tag, and whether it should be an object tag or property.

1. **_Type related?_** Is it fundamentally related to the type of the object? If so, include it.

2. **_Adds Information?_** Does it add information? Does it make the event clearer to users? If so, include it.

3. **_Is Property? _**if you were to represent it as a property key-value pair, is naming it easy? If so, make it a property.

4. **_Linking?_** does create enable parent or related relationships? If so, include it.

Let’s generate the potential tags. Conversation about the activity reveals the following nouns:

* open-source

* software

* program

* 1self-app

* code

* javascript

* sublime

<table>
  <tr>
    <td>potential tag</td>
    <td>heuristic</td>
    <td>outcome</td>
  </tr>
  <tr>
    <td>open-source</td>
    <td>Type related? Yes
Adds Information? Yes
Is Property? No - property would be the clumsy "closed/open" 
Linking Tag? yes - open source creates a relationship with other kinds of open source events</td>
    <td>tag</td>
  </tr>
  <tr>
    <td>software </td>
    <td>Type related? yes
Adds Information? Yes
Is Property? No
Linking Tag? No</td>
    <td>tag</td>
  </tr>
  <tr>
    <td>program</td>
    <td>Type Related? Yes
Adds Information? No - too similar to software
Is Property? No
LinkingTag? No</td>
    <td>discard

note: we could choose to keep program instead of software</td>
  </tr>
  <tr>
    <td>1self-app</td>
    <td>Type Related? Yes - you could say the type of the software is a 1self app
Add Information? Yes
Is property? Yes, it could be represented as “platform:1self”
Linking Tag? No</td>
    <td>property

note: property would be “platform”:”1self”</td>
  </tr>
  <tr>
    <td>code</td>
    <td>Type related? yes
Adds Information? No - very similar to software
Is Property? No
Linking Tag? Perhaps - would allow the linking of written code that hasn’t been compiled
</td>
    <td>discard 

note: this is a marginal decision, tipped because it seems tenuous to add code on the basis of doing comparisons with uncompiled code. Uncompiled code doesn’t seem interesting</td>
  </tr>
  <tr>
    <td>javascript</td>
    <td>Type Related? Yes
Add Information? Yes
Is Property? Yes
Linking Tag? Yes - we might want to express all your development activities relating to javascript. E.g. reading about, watching videos about.
</td>
    <td>property

note: property would be “language”:”javascript”</td>
  </tr>
  <tr>
    <td>sublime</td>
    <td>Type Related? No - you can’t say that the app is a type of sublime app. You can only say it was written in sublime.
Add Infromation? Yes
Is Property? Yes, it could be represented as “editor”:”sublime”
Linking Tag? Yes, could link to other sublime activities. However linking could be done through a property.</td>
    <td>property

note: we could have chosen other keys like “IDE” or “tool”</td>
  </tr>
</table>


After heuristical analysis, we are left with this event.

<table>
  <tr>
    <td>object tags</td>
    <td>open-source software</td>
  </tr>
  <tr>
    <td>properties</td>
    <td>
    <table>
    <tr>
    <td>
    platform
    </td>
       <td>
       1self
    </td>
    </tr>
        <tr>
    <td>
    language
    </td>
       <td>
       javascript
    </td>
    </tr>
        <tr>
    <td>
    Editor
    </td>
       <td>
       Sublime
    </td>
    </tr>
    </table>
</td>
  </tr>
</table>


Examine the object tags. There are only two tags, almost certainly too little information. As rule of thumb, if there are only one or two tags, we’re probably missing some. We can ask ourselves questions to find them.

1. **Parent Type** - are there any tags that represent a parent category of the captured information?

2. **Related Type** - are there any tags that create connection to related concepts? Is software related to something else?

In answer to these questions we can say:

* Software is a type of machine readable instruction. 

* Software is a type of human creative endeavour

* Software is something in the computer category

* Software can be on the web or can be native, this software is on the web

* Software can be a service or an app, this software is a service

From this we have the following list of potential tags:

["machine-readable-instruction", “creative-endeavour”, “computer”, “web”, “app”]

For each, we run through the tag selection heuristics. That leaves "computer", “web” and “app” as object tags to add to event meta data:

<table>
  <tr>
    <td>object tags</td>
    <td>"open-source", “computer”, “software”, “web”, “app”</td>
  </tr>
  <tr>
    <td>properties</td>
    <td>
   <table>
    <tr>
    <td>
    platform
    </td>
       <td>
       1self
    </td>
    </tr>
        <tr>
    <td>
    language
    </td>
       <td>
       javascript
    </td>
    </tr>
        <tr>
    <td>
    Editor
    </td>
       <td>
       Sublime
    </td>
    </tr>
    </table>
</td>
  </tr>
</table>


We may repeat object tag generation and filtering. In our case, we choose not to stop, moving instead to action tags.

## ACTION TAG DISCOVERY

Selecting action tags is similar to selecting object tags. First, generate potential tags:

["write", “author”, “create”, “type”]

Next, follow similar the action tag heuristics. The outcome will be filtered action tags.

1. **_Action related?_** Is this fundamentally action related? If so, include it.

2. **_Adds Information?_** Does it add information? Does this tag clarify event meaning for users? If so, include.

3. **_Linking?_** does the tag enable parental or conceptual links? If so, include it.

<table>
  <tr>
    <td>potential tag</td>
    <td>heuristic</td>
    <td>outcome</td>
  </tr>
  <tr>
    <td>write</td>
    <td>Action related? Yes
Adds Information? Yes
Linking Tag? Yes</td>
    <td>tag</td>
  </tr>
  <tr>
    <td>author </td>
    <td>Action related? yes
Adds Information? No - synonym of write
Linking Tag? No</td>
    <td>discard</td>
  </tr>
  <tr>
    <td>create</td>
    <td>Action Related? Yes
Adds Information? No - the concept of writing includes the idea of creation
LinkingTag? Yes - this allows linking to other kinds of creative endeavours</td>
    <td>tag</td>
  </tr>
  <tr>
    <td>type</td>
    <td>Action Related? Yes
Add Information? Yes - it further describes the act of writing on a computer
Linking Tag? Yes - could allow linking to other kinds of typing, e.g. typing on cell phone or typewriter</td>
    <td>tag</td>
  </tr>
</table>


Left remaining are the action tags ["write", “create”, “type”]. The event metadata so far is:

<table>
  <tr>
    <td>object tags</td>
    <td>"open-source", “computer”, “software”, “web”, “app”</td>
  </tr>
  <tr>
    <td>action tags</td>
    <td>“write”, “create”, “type”</td>
  </tr>
  <tr>
    <td>properties</td>
    <td>
   <table>
    <tr>
    <td>
    platform
    </td>
       <td>
       1self
    </td>
    </tr>
        <tr>
    <td>
    language
    </td>
       <td>
       javascript
    </td>
    </tr>
        <tr>
    <td>
    Editor
    </td>
       <td>
       Sublime
    </td>
    </tr>
    </table>
</td>
  </tr>
</table>


## 5 TAG RULE OF THUMB

For object and action tags, it’s common to have fewer than 5 tags, but more than 5 is suspect. It’s likely some tags are synonyms, adding little information. If you end up with more than 5, examine the tags carefully again.

## PROPERTY DISCOVERY

Properties are key-value pairs used to provide measurements and labels. 

Labels contain adjectival descriptors and categories. Earlier, while discovering object tags, we added three labels. Here they are again:

<table>
  <tr>
    <td>platform</td>
    <td>1self</td>
  </tr>
  <tr>
    <td>language</td>
    <td>javascript</td>
  </tr>
  <tr>
    <td>editor</td>
    <td>sublime</td>
  </tr>
</table>


We ask ourselves questions, in case there are some labels we haven’t discovered.

**_How was I writing the software?_** On my mac, using mavericks, using nodejs, using unit tests, using system tests, submitting to github.

**_How should users filter these events in visualizations? _**They will filter on operating system. They want to know the quantity of tested vs untested code. User’s also like to filter based on time of day and location. 

**_What kinds of things would users like to measure about writing the code?_** Lines of code, the elapsed duration, how many times they left the editor to look something up on google and how many times they linted the code.

We have a number of potential properties:

<table>
  <tr>
    <td>candidate</td>
    <td>decision</td>
  </tr>
  <tr>
    <td>operating-system: osx 10.9.5</td>
    <td>use</td>
  </tr>
  <tr>
    <td>platform: nodejs</td>
    <td>use

note that this needs to be combined with the value ’1self’ already under ‘platform’ to create a label collection as the value of the property.</td>
  </tr>
  <tr>
    <td>tested: yes</td>
    <td>use</td>
  </tr>
  <tr>
    <td>time</td>
    <td>reject

1self already has the datetime field in the event that can be used for this.</td>
  </tr>
  <tr>
    <td>lines-of-code: (n)</td>
    <td>use</td>
  </tr>
  <tr>
    <td>duration: (seconds)</td>
    <td>use</td>
  </tr>
  <tr>
    <td>linting: (n)</td>
    <td>reject

linting the code is a separate activity to writing it. We should create another linting event  to capture this, with its own properties. This allows the unique aspects of linting to be captures, as well as comparisons between time spent linting and and writing.</td>
  </tr>
  <tr>
    <td>googles</td>
    <td>reject

looking up documentation can be seen here as an activity relating to writing the code, but not the act of writing it, in itself. We should represent this as a separate event</td>
  </tr>
</table>


Post filtering, there are the following properties, with example values:

<table>
  <tr>
    <td>platform</td>
    <td>1self, nodejs</td>
  </tr>
  <tr>
    <td>language</td>
    <td>javascript</td>
  </tr>
  <tr>
    <td>editor</td>
    <td>sublime</td>
  </tr>
  <tr>
    <td>operating-system</td>
    <td>OSX 10.9.5</td>
  </tr>
  <tr>
    <td>tested</td>
    <td>yes</td>
  </tr>
  <tr>
    <td>lines-of-code</td>
    <td>25</td>
  </tr>
  <tr>
    <td>duration</td>
    <td>135</td>
  </tr>
</table>


That’s it! Together we’ve discovered the properties. This completes the event meta-data.

## THE COMPLETE EVENT

<table>
  <tr>
    <td>object tags</td>
    <td>"open-source", “computer”, “software”, “web”, “app”</td>
  </tr>
  <tr>
    <td>action tags</td>
    <td>“write”, “create”, “type”</td>
  </tr>
  <tr>
    <td>properties</td>
    <td>
       <table>
    <tr>
    <td>
    platform
    </td>
       <td>
       1self, node.js
    </td>
    </tr>
        <tr>
    <td>
    language
    </td>
       <td>
       javascript
    </td>
    </tr>
        <tr>
    <td>
    Editor
    </td>
       <td>
       Sublime
    </td>
    </tr>
            <tr>
    <td>
    Operating System
    </td>
       <td>
      OSX 10.9.5
    </td>
    </tr>
                <tr>
    <td>
   tested
    </td>
       <td>
    yes
    </td>
    </tr>
                <tr>
    <td>
   Lines of code
    </td>
       <td>
    25
    </td>
    </tr>
                <tr>
    <td>
   duration
    </td>
       <td>
    135
    </td>
    </tr>
    </table>
</td>
  </tr>
</table>


## WRAP UP

We have completed an in-depth look at event meta-data discovery for the act of writing software. 

If you are intimidated by the complexity, just trust your instincts. You can correct mistakes in the event metadata later. Start with a simple event, write you 1self app, then iterate from there. 

As we worked this example, did you disagree with the decisions? For most events, there are multiple metadata representations. It may be useful to look at events in your domain. The event meta database can be found here <<INSERT LINK>>.

# Metadata patterns

At 1self, through event metadata creation, we’ve found some patterns. You’re likely to find your events follow one of them. If not, you may have discovered a new pattern. We’d love to hear about it, so get in touch! <<LINK>>  

## 1. Self Pattern 

*meeting*

*commuting*

### Signals

Data produced comes from an activity

No object is involved in the activity

Can be represented in English with a simple "I <verb>" sentence, e.g. I meet.

### Event Structure

Use ‘self’ as the object tag. Use the verb in the activity as the action tag.

### Examples

<table>
  <tr>
    <td>example</td>
    <td>object tags</td>
    <td>action tags</td>
  </tr>
  <tr>
    <td>attending a meeting</td>
    <td>self</td>
    <td>meet</td>
  </tr>
  <tr>
    <td>commuting</td>
    <td>self</td>
    <td>commute</td>
  </tr>
</table>


## 2. Object Pattern

*brushing your teeth*

*playing a guitar*

### Signals

Data produced comes from an activity

There is another object or thing involved, other than yourself

### Event Structure

Use a series of tags representing the object in the activity. Use the verb as the action tag.

### Examples

<table>
  <tr>
    <td>example</td>
    <td>object tags</td>
    <td>action tags</td>
  </tr>
  <tr>
    <td>brushing your teeth</td>
    <td>teeth</td>
    <td>brush</td>
  </tr>
  <tr>
    <td>playing a guitar</td>
    <td>instrument, guitar</td>
    <td>play</td>
  </tr>
</table>


## 3. Environment pattern

*measure air temperature*

*sample noise level*

### Signals

The only sense of self is in experiencing the measurement

The word ‘sample’ can be used

The measurement is about the environment around us

### Event Structure

Combine ‘ambient’ with other object tags to describe the aspect of the environment described by the event. Use ‘sample’ as the verb.

### Examples

<table>
  <tr>
    <td>example</td>
    <td>object tags</td>
    <td>action tags</td>
  </tr>
  <tr>
    <td>air temperature reading</td>
    <td>ambient, air, temperature</td>
    <td>sample</td>
  </tr>
  <tr>
    <td>noise level</td>
    <td>ambient, noise</td>
    <td>sample</td>
  </tr>
</table>


## 4. Physiology pattern

	

*weigh yourself*

*sample heart rate*

*check blood sugar level*

### Signals

Involves properties or measurements of the body

Can be expressed in english as "I <verb> myself" or “I sample my <object>”

### Event Structure

Combine ‘self’ with specific object tags to describe the physiological component. Use sample as the action tag.

### Examples

<table>
  <tr>
    <td>example</td>
    <td>object tags</td>
    <td>action tags</td>
  </tr>
  <tr>
    <td>weigh yourself</td>
    <td>self, weight</td>
    <td>sample</td>
  </tr>
  <tr>
    <td>sample heart rate</td>
    <td>self, heartrate</td>
    <td>sample</td>
  </tr>
  <tr>
    <td>check blood sugar level</td>
    <td>self, blood, sugar</td>
    <td>sample</td>
  </tr>
</table>


# Pattern Examples from 1self apps

Let’s look at examples of event patterns from [1self](http://duration.1self.co) self apps

<table>
  <tr>
    <td>App</td>
    <td>object tags</td>
    <td>action tags</td>
    <td>pattern</td>
  </tr>
  <tr>
    <td>Duration</td>
    <td>self</td>
    <td>code</td>
    <td>self</td>
  </tr>
  <tr>
    <td>Duration</td>
    <td>self </td>
    <td>commute</td>
    <td>self</td>
  </tr>
  <tr>
    <td>Duration</td>
    <td>food</td>
    <td>cook</td>
    <td>subject</td>
  </tr>
  <tr>
    <td>Duration</td>
    <td>self</td>
    <td>exercise</td>
    <td>self</td>
  </tr>
  <tr>
    <td>Duration</td>
    <td>self </td>
    <td>meditate</td>
    <td>self</td>
  </tr>
  <tr>
    <td>Duration</td>
    <td>self</td>
    <td>meet</td>
    <td>self</td>
  </tr>
  <tr>
    <td>Duration</td>
    <td>self</td>
    <td>party</td>
    <td>self</td>
  </tr>
  <tr>
    <td>Duration</td>
    <td>instrument</td>
    <td>play</td>
    <td>subject</td>
  </tr>
  <tr>
    <td>Duration</td>
    <td>text</td>
    <td>read</td>
    <td>subject</td>
  </tr>
  <tr>
    <td>Duration</td>
    <td>teeth </td>
    <td>brush</td>
    <td>self</td>
  </tr>
  <tr>
    <td>Duration</td>
    <td>teeth</td>
    <td>floss</td>
    <td>self</td>
  </tr>
  <tr>
    <td>Noise</td>
    <td>ambient, noise</td>
    <td>sample</td>
    <td>environment</td>
  </tr>
  <tr>
    <td>Github Integration</td>
    <td>computer, software, control</td>
    <td>push</td>
    <td>subject</td>
  </tr>
  <tr>
    <td>Sublime plugin</td>
    <td>computer, software</td>
    <td>develop</td>
    <td>subject</td>
  </tr>
  <tr>
    <td>Last.fm integration</td>
    <td>music</td>
    <td>listen</td>
    <td>subject</td>
  </tr>
</table>


# Metadata Conventions

## Duration Property

Many events will include a duration. Examples are: developing software, timing your commute, how long you spend in meetings. 1self uses the convention of naming the property ‘duration’. The unit of duration is seconds. Milliseconds, should you need them, are represented using the naming convention durationMs. The 1self UI will interpret these properties as a time span and apply special formatting to represent them as such.

# Metadata linking

In 1self, events are linked by sharing common metadata. Take, for example, playing a guitar and double bass. Playing a guitar may be represented by the object tags ["instrument", guitar”] and action tags [“play”]. Playing double bass may be represented by object tags [“instrument”, “double-bass”] and action tags [“play”]. They are linked by the common object tag “instrument” and by the common action tag “play”. Since they have common tags, 1self can present the user with visualizations and insights exploring the relationship between the two.

To take advantage of linking, look for metadata in events that already exist. Think about the relationship between data you send and data already available to users.
