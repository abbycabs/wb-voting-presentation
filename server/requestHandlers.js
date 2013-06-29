var querystring = require("querystring"),
    mobile_requests = [],
    presenter_requests = [],
    vote_options_list = [],
    NO_VOTES = "no voting right now",
    vote_list = [];

function option(response, postData){
  if(postData){
    var opt = querystring.parse(postData).text;
    if(opt){
      vote_options_list.push(opt);
      vote_list[vote_list.length] = 1;
    }
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(page("Thanks for adding '" + opt + "'<br /><a href='/' style=\"text-decoration: underline;\">Go back to voting</a>"));
    response.end();
    update_mobile();
    update_presenter();
  }else{
    presenter_requests.push(response); 
  }
}

function voting_options(response, postData){
  if(postData){
    vote_options_list = JSON.parse(postData);
    update_mobile();
    vote_list = [];
    var i, len;
    for(i=0, len=vote_options_list.length; i<len; i++){
      vote_list[i] = 0;
    }
  }
  response.writeHead(200, {"Content-Type": "text/plain", 'Access-Control-Allow-Origin' : '*', "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS"});
  console.log(postData);
  response.end(); 
}

function getMobileHTML(all){
  var optns="", i, len, o;
  for(i=0, len=vote_options_list.length; o=vote_options_list[i++];){
    optns += (o != NO_VOTES) ? '<li onClick="vote($(this), \'' + (i-1) +'\')"><a href="javascript:void(0)">' + o + '</a></li>' : o;
  }
  
  if(optns=="")
    optns = "no voting right now";
  
  if(vote_options_list.length > 5)
    optns += '<li><form action="/option" method="post">'+
    '<input name="text" placeholder="Other..." />'+
    '<input type="submit" value="Submit" />'+
    '</form></li>';
  
  if(vote_options_list.length > 1)
    optns = "<ol>" + optns + "</ol>";

  if(!all)
    return optns;
  
  return page('<h3>WormBase</h3>'+
    '<div id="content">' + 
    optns + 
    '</div>' +
    '<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>' + 
    '<script>'+
    'var votes = [];' +
    'function vote(obj, v){'+
    ' var a = (obj.hasClass("chosen")) ? -1 : 1;'+
    ' if(a>0){' +
    '   votes.push(v);' + 
    ' }else{' + 
    '   votes.splice(votes.indexOf(v), 1);' +
    ' }' +
    ' console.log(votes);' +
    '  obj.toggleClass("chosen");'+
      '$.ajax({'+
      '  type: "POST",'+
      '  url: "/votes",'+
      '  data: {vote:v, amt:a}' + 
      '});'+
    '}'+
    'function load_options(){'+
    '$.ajax({'+
    '  type: "POST",'+
    '  url: "/mobile",'+
    '  data: "none",' + 
    '  success: function(data){' +
    '    var i, len, opts = $("#content").html(data).find("ol li");' +
    '    if(opts.size() > 0){' +
          'for(i=0, len=votes.length; i<len; i++){' +
          '  $(opts.get(votes[i])).addClass("chosen");' +
          '}' +
    '    }else{' +
    '      votes = [];' +
    '    }' +
    '    load_options();'+
    '  }'+
    '});'+
    '}'+
    '$(window).load(function() {' +
    '  setTimeout(function() {' +
    '      load_options();' +
    '  }, 10);' +
    '});' +
    '</script>');
}

function page(body){
    return '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '<meta name="apple-mobile-web-app-capable" content="yes" />'+
    '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />'+
    '<title>WormBase Redesign</title>'+
    '<style type="text/css">'+
    '  body {background:#333;color:white;font-size:2em;font-family: Verdana, Arial, Helvetica, sans-serif;}'+
    '  a {color:white;text-decoration: none;line-height:1.5em;}'+
    '  ol{margin-left:20px;}'+
    '  li {list-style-type: upper-alpha;}'+
    '  .chosen {background:#13DAEC;}'+
    '.chosen a {color:black;}'+
    '</style>'+
    '</head>'+
    '<body>'+
    body +
    '</body>'+
    '</html>'; 
}

function mobile(response, postData) {
  if(!postData){
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(getMobileHTML(1));
    response.end();
  }else{
    mobile_requests.push(response); 
  }
}

function update_mobile(){
  while(mobile_requests.length){
    var response = mobile_requests.shift();
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write(getMobileHTML());
    response.end();
  }
}

function update_presenter(){
  while(presenter_requests.length){
    var response = presenter_requests.shift();
    response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*', "access-control-allow-methods": "GET"});
    response.write(JSON.stringify(vote_options_list));
    response.end();
  }
}


function votes(response, postData){
  console.log("Request handler 'votes' was called.");
  response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*', "access-control-allow-methods": "GET"});
  if(postData){
    var v = querystring.parse(postData).vote,
        a = querystring.parse(postData).amt;
    vote_list[v] = parseInt(vote_list[v], 10) + parseInt(a, 10);
  }else{
    response.write(JSON.stringify(vote_list));
    console.log(vote_list);
  }
  response.end();
}

exports.mobile = mobile;
exports.voting_options = voting_options;
exports.option = option;
exports.votes = votes;
