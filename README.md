# WormBase - interactive tutorial

Short interactive WormBase tutorial. Covers main navigation in the redesign and gives options to go through several main functions.

Presentation built using [reveal.js] (http://lab.hakim.se/reveal-js/). Mobile site (for audience voting) and voting system served by [node.js] (http://nodejs.org/) 

See the presentation here: [acabunoc.github.com/wb-voting-presentation] (http://acabunoc.github.com/wb-voting-presentation)

## Usage

Navigate to index.html for presenter view. Presentation automatically uses [abby.wormbase.org] (http://abby.wormbase.org) as the voting server.

To start server:

<pre>
cd server/
forever start index.js
</pre>

Default starts on port 9002