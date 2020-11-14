window.onscroll = function() {myFunction()};
window.onscroll = function() {navbarServices()};

function myFunction() {
  if (document.body.scrollTop > 520 || document.documentElement.scrollTop > 520) {
    document.getElementById("my_nav_bar").style.backgroundColor = '#f5d1e4';
  }else{
    document.getElementById("my_nav_bar").style.backgroundColor = 'transparent';

  }
}

function navbarServices() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    document.getElementById("services_nav_bar").classList.add('navbar-transition');

    var l1 = document.getElementById('l7');
    var l2 = document.getElementById('l6');
    var l3 = document.getElementById('l5');
    var l4 = document.getElementById('l4');
    var l5 = document.getElementById('l3');
    var l6 = document.getElementById('l2');
    var l7 = document.getElementById('l1');
    
    l1.classList.remove('btns-nav-services');
    l2.classList.remove('btns-nav-services');
    l3.classList.remove('btns-nav-services');
    l4.classList.remove('btns-nav-services');
    l5.style.color = 'black';
    l6.style.color = 'black';
    l7.style.color = 'black';


    l4.classList.add('btns-nav-services-black');
    l3.classList.add('btns-nav-services-black');
    l2.classList.add('btns-nav-services-black');
    l1.classList.add('btns-nav-services-black');
  }else{
    document.getElementById("services_nav_bar").classList.remove('navbar-transition');

    var l1 = document.getElementById('l7');
    var l2 = document.getElementById('l6');
    var l3 = document.getElementById('l5');
    var l4 = document.getElementById('l4');
    var l5 = document.getElementById('l3');
    var l6 = document.getElementById('l2');
    var l7 = document.getElementById('l1');

    l1.classList.remove('btns-nav-services-black');
    l2.classList.remove('btns-nav-services-black');
    l3.classList.remove('btns-nav-services-black');
    l4.classList.remove('btns-nav-services-black');
    l5.style.color = 'white';
    l6.style.color = 'white';
    l7.style.color = 'white';

    l4.classList.add('btns-nav-services');
    l3.classList.add('btns-nav-services');
    l2.classList.add('btns-nav-services');
    l1.classList.add('btns-nav-services');

  }
}


function openShop(){
  window.location = 'shop.html';
}


function over(id){
  
  var div = document.getElementById(id);

  div.className = 'trans col-sm-6';
}

function out(id){
  var div = document.getElementById(id);

  div.classList.remove( 'trans');
}

function zoom(id){
  var card = document.getElementById(id);
  card.className = 'card crd zoom'

  var button = document.getElementById(id+'button');
  button.classList.add('review-button');

  // button.style.color = 'white';
  // button.style.backgroundColor = 'black';
  // button.style.borderColor = 'black';
}

function zoomOut(id){
  var card = document.getElementById(id);
  card.className = 'card crd zoomOut';
  
  var button = document.getElementById(id+'button');
  button.classList.remove('review-button');

  
}

function hide_view_button(id){
  var button = document.getElementById(id+'button');
  button.classList.remove('review-button');

}