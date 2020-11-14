function get_orders(){
    $.ajax({
        url: 'get_orders.php',
        type: 'post',
        success: function(response){

            var data = JSON.parse((response.replace(/[\u0000-\u0019]+/g,'')));

            var modal_container = document.getElementById('modals')
            
            var orders_tbody = document.getElementById('orders_tbody')
            while (orders_tbody.hasChildNodes()) {  
                orders_tbody.removeChild(orders_tbody.firstChild);
            }
        
            for(var i = 0; i < data.length; i++){

                var temp_ = data[i].order_data;
                var items_order = JSON.parse((temp_.replace(/[\u0000-\u0019]+/g,'')));

                


                var trow = document.createElement('tr');
                var th = document.createElement('th');
            
                var name = document.createElement('td');
                var status = document.createElement('td')
                var view_col = document.createElement('td');
                var view_button = document.createElement('button');
                view_button.innerText = ('view');
                view_button.className = 'btn btn-outline-primary btn-sm';
                view_button.setAttribute("data-toggle", "modal");
                view_button.setAttribute("data-target", "#_"+data[i].order_number);


        
                th.innerText = i;
                name.innerText = data[i].email;
                status.innerText = (function (){
                    if(Number.parseInt(data[i].order_status) === 0){
                        return "unprocessed";
                    }else{
                        return "processed";
                    }
                }());
                view_col.appendChild(view_button);
                
                trow.appendChild(th);
                trow.appendChild(name);
                trow.appendChild(status);
                trow.appendChild(view_col);
        
                orders_tbody.appendChild(trow);


                //MODALS
                var card_modals = document.createElement('div')
                card_modals.className = 'modal bd-example-modal-lg fade';
                card_modals.setAttribute('id', '_'+data[i].order_number);
                card_modals.setAttribute('tabindex', "-1");
                card_modals.setAttribute('role', "dialog");
    
                var card_modals2 = document.createElement('div')
                card_modals2.className = 'modal-dialog modal-lg';
                card_modals2.setAttribute('role', "document");
                
                var card_modals3 = document.createElement('div')
                card_modals3.className = 'modal-content';
    
                var card_modals4 = document.createElement('div');
                card_modals4.className = 'modal-header';
                var header_text = document.createElement('h4');
                header_text.innerText = (data[i].email);
                card_modals4.appendChild(header_text);
    
                var card_close_button = document.createElement('button');
                card_close_button.className = 'close';
                card_close_button.setAttribute('data-dismiss', "modal");
                card_close_button.setAttribute('aria-label', "Close");
    
                var span = document.createElement('span');
                span.setAttribute('aria-hidden', 'true');
                span.innerHTML = '&times;'
    
                card_close_button.appendChild(span);
    
                var modal_body = document.createElement('div');
                modal_body.className = 'modal-body'
    
                //////////////modal body elements/////////////////////
                // var modal_image = document.createElement('img');
                // modal_image.src = './images/uploads/'+ status[i].image1;
                // modal_image.className = 'img-fluid'
    
                // var madal_price = document.createElement('h2');
                // madal_price.innerText = '$ '+ status[i].price;
    
                // var modal_description = document.createElement('p');
                // modal_description.innerText = status[i].brief_desc;
                ///////////////////////////////////////////////////
                ///////////appedind modal body elements////////////
                // modal_body.appendChild(modal_image);
                // modal_body.appendChild(madal_price);
                // modal_body.appendChild(modal_description);
                ///////////////////////////////////////////////////
                //////////////////////table////////////////////////
                var table_ = document.createElement('table')
                table_.className = 'table';

                var thead = document.createElement('thead');

                var num_ = document.createElement('th');
                num_.innerText = '#';
                var th_product_name = document.createElement('th');
                th_product_name.innerText = 'product';

                thead.appendChild(num_);
                thead.appendChild(th_product_name);

                var m_tbody = document.createElement('tbody');

                // var modal_trow = document.createElement('tr');
                // var modal_tdata = document.createElement('td');
                //alert(items_order)
                for(var j = 0; j < items_order.length; j++){
                    var trow = document.createElement('tr');
                    var th = document.createElement('th');

                    var produc_name = document.createElement('td');

                    th.innerText = j;                                
                    var temp_name = items_order[j].product_name;
                    
                    produc_name.innerText = temp_name;
                    trow.appendChild(th);
                    trow.appendChild(produc_name);
    
                    m_tbody.appendChild(trow);  
                
                //alert(temp_name)
                                 
                }

                ////im here 
                
                
                
                
                
                

                

                table_.appendChild(thead);
                table_.appendChild(m_tbody);

                modal_body.appendChild(table_);


                // name.innerText = cart_data[i].product_name;
                // price.innerText = cart_data[i].price;
                // view.appendChild(view_button);
                // remove_col.appendChild(remove_button);
                        


                /////////////////modal footer//////////////////////

                var modal_footer = document.createElement('div');
                modal_footer.className = "modal-footer";
    
                var modal_footer_add_button = document.createElement('button');
                modal_footer_add_button.className = 'btn btn-secondary';
                modal_footer_add_button.innerText = 'Add to cart';
                //modal_footer_add_button.setAttribute('data-dismiss', "modal");
    
                var modal_footer_wish_button = document.createElement('button');
                modal_footer_wish_button.className = 'btn btn-secondary';
                modal_footer_wish_button.innerText = '+ Wish List'
    
                var modal_footer_close_button = document.createElement('button');
                modal_footer_close_button.className = 'btn btn-secondary';
                modal_footer_close_button.setAttribute('data-dismiss', "modal");
                modal_footer_close_button.innerText = 'Close'
    
                
    
    
                modal_footer.appendChild(modal_footer_add_button);
                modal_footer.appendChild(modal_footer_wish_button);
                modal_footer.appendChild(modal_footer_close_button);
    
    
                card_modals4.appendChild(header_text);
                card_modals4.appendChild(card_close_button);
    
                card_modals3.appendChild(card_modals4);
                card_modals3.appendChild(modal_body);
                card_modals3.appendChild(modal_footer);
    
    
                card_modals2.appendChild(card_modals3)
                card_modals.appendChild(card_modals2);
                modal_container.appendChild(card_modals);        
        
            } 
            get_user_list()    
        }
    })
    
}

function get_user_list(){
    $.ajax({
        url: 'get_user_data.php',
        type: 'post',
        success: function(response){
            
            var __temp = JSON.parse((response.replace(/[\u0000-\u0019]+/g,'')));
            localStorage.setItem('user_data', JSON.stringify(__temp));
            
            get_registred_user_orders();
        }
    });    
}

function confim_order_registred_user(){
    var form = document.getElementById("confirm_order_form");
    function handleForm(event) { event.preventDefault(); } 
    form.addEventListener('submit', handleForm);

    var cart_data = JSON.parse(localStorage.getItem('product_data'));

    var email = document.getElementById('email_process').value;

    const data = {
        email,
        cart_data
    }

    console.log(data);
    $.ajax({
        url: 'order_registred_user.php',
        type: 'post',
        data: data,
        success: function(response){
            if(response === "success"){
                alert('Your order has been successfully placed. A site representetive will contact you shortly on contact details you provided');
                location.reload();                
            }else{
                alert("There was an error processing your order please retry")
            }
        }
    })    
}

function get_registred_user_orders(){
    $.ajax({
        url: 'get_orders_registred_user.php',
        type: 'post',
        success: function(response){

            var data = JSON.parse((response.replace(/[\u0000-\u0019]+/g,'')));
            var modal_container = document.getElementById('modals')
            
            var orders_tbody = document.getElementById('tbody_registred')
            while (orders_tbody.hasChildNodes()) {  
                orders_tbody.removeChild(orders_tbody.firstChild);
            }
        
            for(var i = 0; i < data.length; i++){

                var temp_ = data[i].order_data;
                var items_order = JSON.parse(temp_.replace(/[\u0000-\u0019]+/g,''));

                


                var trow = document.createElement('tr');
                var th = document.createElement('th');
            
                var name = document.createElement('td');
                var organisation = document.createElement('td');
                var status = document.createElement('td')
                var view_col = document.createElement('td');
                var view_button = document.createElement('button');
                view_button.innerText = ('view');
                view_button.className = 'btn btn-outline-primary btn-sm';
                view_button.setAttribute("data-toggle", "modal");
                view_button.setAttribute("data-target", "#_"+data[i].order_number);


        
                th.innerText = i;
                name.innerText = data[i].email;
                status.innerText = (function (){
                    if(Number.parseInt(data[i].order_status) === 0){
                        return "unprocessed";
                    }else{
                        return "processed";
                    }
                }());
                

                var __temp = JSON.parse(localStorage.getItem('user_data'));
                
                alert('xxxx'+__temp);


                for(var k = 0; k < __temp.length; k++){
                    if(data[i].email === __temp[k].email);
                    organisation.innerText = __temp[k].company;
                }

                
                
                 
                view_col.appendChild(view_button);
                
                trow.appendChild(th);
                trow.appendChild(name);
                trow.appendChild(organisation)
                trow.appendChild(status);
                trow.appendChild(view_col);
        
                orders_tbody.appendChild(trow);


                //MODALS
                var card_modals = document.createElement('div')
                card_modals.className = 'modal bd-example-modal-lg fade';
                card_modals.setAttribute('id', '_'+data[i].order_number);
                card_modals.setAttribute('tabindex', "-1");
                card_modals.setAttribute('role', "dialog");
    
                var card_modals2 = document.createElement('div')
                card_modals2.className = 'modal-dialog modal-lg';
                card_modals2.setAttribute('role', "document");
                
                var card_modals3 = document.createElement('div')
                card_modals3.className = 'modal-content';
    
                var card_modals4 = document.createElement('div');
                card_modals4.className = 'modal-header';
                var header_text = document.createElement('h4');
                header_text.innerText = (data[i].email);
                card_modals4.appendChild(header_text);
    
                var card_close_button = document.createElement('button');
                card_close_button.className = 'close';
                card_close_button.setAttribute('data-dismiss', "modal");
                card_close_button.setAttribute('aria-label', "Close");
    
                var span = document.createElement('span');
                span.setAttribute('aria-hidden', 'true');
                span.innerHTML = '&times;'
    
                card_close_button.appendChild(span);
    
                var modal_body = document.createElement('div');
                modal_body.className = 'modal-body'
    
                //////////////modal body elements/////////////////////
                // var modal_image = document.createElement('img');
                // modal_image.src = './images/uploads/'+ status[i].image1;
                // modal_image.className = 'img-fluid'
    
                // var madal_price = document.createElement('h2');
                // madal_price.innerText = '$ '+ status[i].price;
    
                // var modal_description = document.createElement('p');
                // modal_description.innerText = status[i].brief_desc;
                ///////////////////////////////////////////////////
                ///////////appedind modal body elements////////////
                // modal_body.appendChild(modal_image);
                // modal_body.appendChild(madal_price);
                // modal_body.appendChild(modal_description);
                ///////////////////////////////////////////////////
                //////////////////////table////////////////////////
                var table_ = document.createElement('table')
                table_.className = 'table';

                var thead = document.createElement('thead');

                var num_ = document.createElement('th');
                num_.innerText = '#';
                var th_product_name = document.createElement('th');
                th_product_name.innerText = 'product';

                thead.appendChild(num_);
                thead.appendChild(th_product_name);

                var m_tbody = document.createElement('tbody');

                // var modal_trow = document.createElement('tr');
                // var modal_tdata = document.createElement('td');
                //alert(items_order)
                for(var j = 0; j < items_order.length; j++){
                    var trow = document.createElement('tr');
                    var th = document.createElement('th');

                    var produc_name = document.createElement('td');

                    th.innerText = j;                                
                    var temp_name = items_order[j].product_name;
                    
                    produc_name.innerText = temp_name;
                    trow.appendChild(th);
                    trow.appendChild(produc_name);
    
                    m_tbody.appendChild(trow);  
                
                //alert(temp_name)
                                 
                }

                ////im here 
                
                
                
                
                
                

                

                table_.appendChild(thead);
                table_.appendChild(m_tbody);

                modal_body.appendChild(table_);


                // name.innerText = cart_data[i].product_name;
                // price.innerText = cart_data[i].price;
                // view.appendChild(view_button);
                // remove_col.appendChild(remove_button);
                        


                /////////////////modal footer//////////////////////

                var modal_footer = document.createElement('div');
                modal_footer.className = "modal-footer";
    
                var modal_footer_add_button = document.createElement('button');
                modal_footer_add_button.className = 'btn btn-secondary';
                modal_footer_add_button.innerText = 'Add to cart';
                //modal_footer_add_button.setAttribute('data-dismiss', "modal");
    
                var modal_footer_wish_button = document.createElement('button');
                modal_footer_wish_button.className = 'btn btn-secondary';
                modal_footer_wish_button.innerText = '+ Wish List'
    
                var modal_footer_close_button = document.createElement('button');
                modal_footer_close_button.className = 'btn btn-secondary';
                modal_footer_close_button.setAttribute('data-dismiss', "modal");
                modal_footer_close_button.innerText = 'Close'
    
                
    
    
                modal_footer.appendChild(modal_footer_add_button);
                modal_footer.appendChild(modal_footer_wish_button);
                modal_footer.appendChild(modal_footer_close_button);
    
    
                card_modals4.appendChild(header_text);
                card_modals4.appendChild(card_close_button);
    
                card_modals3.appendChild(card_modals4);
                card_modals3.appendChild(modal_body);
                card_modals3.appendChild(modal_footer);
    
    
                card_modals2.appendChild(card_modals3)
                card_modals.appendChild(card_modals2);
                modal_container.appendChild(card_modals);        
        
            }            
        }
    })
}