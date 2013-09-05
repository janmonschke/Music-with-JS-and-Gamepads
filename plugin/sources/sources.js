// Show source information for images on hover
(function(){

  // element that will contain the source information
  var sourceInfo = document.createElement('div');
  sourceInfo.style.position = 'fixed';
  sourceInfo.style.top = '0';
  sourceInfo.style.right = '0';
  sourceInfo.style.backgroundColor = '#111';
  sourceInfo.style.color = '#eee';
  sourceInfo.style.padding = '3px';
  document.body.appendChild(sourceInfo);

  // get all images
  var imgs = document.querySelectorAll('img[data-source]');

  var timeout = null;

  var showSource = function(){
    clearTimeout(timeout);
    var source = this.getAttribute('data-source');
    if(source){
      sourceInfo.innerHTML = 'source: ';
      var link = document.createElement('a');
      link.setAttribute('href', source);
      link.setAttribute('target', '_blank');
      link.style.color = '#ccc';
      link.style.textDecoration = 'underline';
      link.innerHTML = source;
      sourceInfo.appendChild(link);
    }
  };

  var _hideSource = function(){
    sourceInfo.innerHTML = '';
  };

  var hideSource = function(){ timeout = setTimeout(_hideSource, 1000); };

  for (var i = imgs.length - 1; i >= 0; i--) {
    var current = imgs[i];

    current.addEventListener('mouseover', showSource);
    current.addEventListener('mouseout', hideSource);
  };
})()