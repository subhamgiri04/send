function includeHTMLOld() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      /*search for elements with a certain atrribute:*/
      file = elmnt.getAttribute("include");
      if (file) {
        /* Make an HTTP request using the attribute value as the file name: */
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4) {
            if (this.status == 200) { elmnt.innerHTML = this.responseText; }
            if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
            /* Remove the attribute, and call this function once more: */
            elmnt.removeAttribute("include");
          }
        }
        xhttp.open("GET", file, true);
        xhttp.send();
        /* Exit the function: */
        return;
      }
    }
  }
  async function includeHTML(relativeTo = window.location.pathname) {
    var debug = relativeTo;
    if(relativeTo[relativeTo.length - 1] !== '/') relativeTo = relativeTo.substr(0, relativeTo.lastIndexOf("/")) + "/";
    
    var elements = document.querySelectorAll("[include]");
    var doinlast = [];
    for(var i=0;i<elements.length;i++) {
      var file = elements[i].getAttribute('include');
      elements[i].removeAttribute('include');
      doinlast.push([elements[i], file]);
    }
    for(var i=0;i<doinlast.length;i++) {
      var file = doinlast[i][1];
      if(file[0] !== '/') file = relativeTo + file;
      var resp;
      resp = await fetch(file);
      if(resp.status === 404){
        console.error("Error while fetching ", file, "in", debug);
        doinlast[i][0].innerHTML = file + " not found.";
      }
      else {
        resp = await resp.text();
        doinlast[i][0].innerHTML = resp;
      }
      await includeHTML(file);
    }
    
  }