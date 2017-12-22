(function () {
  "use strict";
    // set shared variables
    var mainnav = document.getElementById("mainnav"),
        menuUnderlay = document.getElementById("menu_underlay"),
        fullscreenmenu = document.getElementById("fullscreenmenu"),
        brand = document.getElementById("brand_small_screen"),
        strokes = document.querySelectorAll(".strokes"),
        icon = document.querySelector(".burger-menu");

    function init() {
      function ajax_get(url, callback) {
          var xmlhttp = new XMLHttpRequest();
          xmlhttp.onreadystatechange = function() {
              if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                  // console.log('responseText:' + xmlhttp.responseText);
                  try {
                      var data = JSON.parse(xmlhttp.responseText);
                  } catch(err) {
                      console.log(err.message + " in " + xmlhttp.responseText);
                      return;
                  }
                  callback(data);
              }
          };

          xmlhttp.open("GET", url, true);
          xmlhttp.send();
      }
      // get data
      ajax_get('/api/nav.json', function(data) {
        function buildDropDowns(data, target) {
          var html = "";
          var arrow = (target === 'fullscreenmenu-inner')? '<i class="icon-chevron-down"></i>': '';
          // build svg for logo
          var logo = '<li class="brand">';
            logo += '<a href="/">';
              logo += '<svg width="63px" height="20px" viewBox="0 0 80 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">';
                logo += '<title>huge-logo</title>';
                logo += '<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">';
                  logo += '<g id="huge-logo" fill="#FFFFFF">';
                    logo += '<g id="Group">';
                        logo += '<path id="Shape" d="M10.668,0 L10.668,13.33 L5.332,13.33 L5.332,0 L-8.8817842e-16,0 L-8.8817842e-16,32 L5.332,32 L5.332,18.666 L10.668,18.666 L10.668,32 L16,32 L16,0 L10.668,0"></path>';
                        logo += '<path id="Shape" d="M31.662,0 L31.662,25.329 C31.662,26.067 31.073,26.661 30.332,26.661 L27.667,26.661 C26.931,26.661 26.33,26.066 26.33,25.329 L26.33,0 L21,0 L21,26.661 C21,29.612 23.392,32 26.33,32 L31.662,32 C34.615,32 37,29.612 37,26.661 L37,0 L31.662,0"></path>';
                        logo += '<path id="Shape" d="M80,5.33 L80,0 L64,0 L64,32 L80,32 L80,26.661 L69.331,26.661 L69.331,18.666 L74.67,18.666 L74.67,13.33 L69.331,13.33 L69.331,5.33 L80,5.33"></path>';
                        logo += '<path id="Shape" d="M59,7.997 L59,5.33 C59,2.385 56.606,0 53.66,0 L48.336,0 C45.391,0 43,2.385 43,5.33 L43,26.661 C43,29.612 45.386,32 48.336,32 L53.66,32 C56.606,32 59,29.612 59,26.661 L59,13.329 L51.002,13.329 L51.002,18.665 L53.66,18.665 L53.66,25.333 C53.66,26.066 53.068,26.661 52.332,26.661 L49.673,26.661 C48.931,26.661 48.336,26.066 48.336,25.329 L48.336,6.658 C48.336,5.916 48.931,5.33 49.673,5.33 L52.332,5.33 C53.067,5.33 53.66,5.916 53.66,6.658 L53.66,7.997 L59,7.997"></path>';
                    logo += '</g>';
                  logo += '</g>';
                logo += '</g>';
              logo += '</svg>';
            logo += '</a>';
          logo += '</li>';
          if (target === 'mainnav') html += logo;
             for (var i=0; i < data.items.length; i++) {
               if(data["items"][i]["items"].length > 0) {
                  html += '<li><a href="' + data["items"][i]["url"] + '">' + data["items"][i]["label"] + arrow + "</a>";
                  html += '<ul>';
                  for (var c=0; c < data.items[i].items.length; c++) {
                    html += '<li><a href="' + data["items"][i]["items"][c]["url"] + '">' + data["items"][i]["items"][c]["label"] + '</a></li>';
                  }
                  html += '</ul>';
               } else {
                 html += '<li><a href="' + data["items"][i]["url"] + '">' + data["items"][i]["label"] + "</li>";
               }
             }
             if (target === 'fullscreenmenu-inner') html += '<div class="footer-small-screen">&copy; 2014 Huge. All Rights Reserved.</div>';
          document.getElementById(target).innerHTML = html;
        }
        // Build menus
        buildDropDowns(data, 'mainnav');
        buildDropDowns(data, 'fullscreenmenu-inner');

       });
    }
    // create handlers for small screen menu
    function animateFullscreenNav() {
        menuUnderlay.classList.remove("show");
        strokes[0].classList.toggle("animate0")
        strokes[1].classList.toggle("hide");
        strokes[2].classList.toggle("animate2");
        fullscreenmenu.classList.toggle("show");
        brand.classList.toggle("show");
        document.body.classList.toggle("noscroll");
    }
    // create handlers for multi-use dropdowns
    function handleNavDropDown(e, options) {
      var this_parent = (e.target.parentNode && e.target.parentNode.nodeName == "LI")? e.target.parentNode : null;
      if(this_parent && this_parent.getElementsByTagName('li').length > 0) {
        e.preventDefault();
        if(!this_parent.classList.contains('show')) {
          var items = options.menu.getElementsByTagName('li');
          for (var i=0; i<=items.length-1; i++) {
            items[i].classList.remove('show');
          }
          menuUnderlay.classList.remove("show");
        }
        this_parent.classList.toggle("show");
        if (options.underlay) menuUnderlay.classList.toggle("show");

      }
    }
    // create an underlay for behind main menu dropdowns
    function handleUnderlay(e) {
      this.classList.toggle("show");
      var mainnavLi = mainnav.querySelectorAll('nav > ul#mainnav > li');
      for (var i=0; i<=mainnavLi.length-1; i++) {
        if (mainnavLi[i].classList.contains('show')){
          mainnavLi[i].classList.toggle("show");
        }
      }
    }
    init();
    mainnav.addEventListener("click", function(e) {
      handleNavDropDown(e, {'underlay':true,'menu':mainnav});
    });
    fullscreenmenu.addEventListener("click", function(e){
      handleNavDropDown(e, {'menu':fullscreenmenu});
    });
    icon.addEventListener("click", animateFullscreenNav);
    menuUnderlay.addEventListener("click", handleUnderlay);
})();
