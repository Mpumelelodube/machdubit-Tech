function getProducts(){
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch('/get_all_products_index', options).then(response => response.json()).then(status => {
        // alert(status);
        console.log(status);

        var modals_container = document.getElementById('modal_container');
        var container = document.getElementById('card_container');

        let row = document.createElement('div');
        row.className = 'row row-cards';

        for(var i = 0; i < status.length; i++){

            let col = document.createElement('div');
            col.className = 'col-sm-3 col-cardss';
            
            let card = document.createElement('div');
            card.className = 'card crd';
            card.setAttribute('id', status[i].product_id)
            card.setAttribute('onmouseover', 'zoom(this.id)')
            card.setAttribute('onmouseout', 'zoomOut(this.id)');
            card.style.backgroundImage = 'url(../images/'+status[i].image1+')';
            card.style.height = '110%'

            var name = document.createElement('p');
            name.innerText = status[i].product_name.toUpperCase();
            //name.style.marginTop = '20%'
            name.style.alignSelf = 'center'
            name.style.fontSize = '11px'
            name.style.fontWeight = 'bolder'
            name.style.marginLeft = '5%'
            name.style.marginRight = '0%'
            name.style.marginBottom = '0%'
            //name.style.position = 'fixed'
            name.style.alignSelf = 'center'

            var price = document.createElement('h6');
            price.innerText = '$'+status[i].price;
            price.style.margin = '0px';
            price.style.color = 'red'


            var name_price_row = document.createElement('div');
            name_price_row.className = 'row';
            name_price_row.style.marginTop = '20%'

            var col_name = document.createElement('div');
            col_name.className = 'col-sm-7';

            var col_price = document.createElement('div');
            col_price.className = 'col-sm-5';

            var view_button = document.createElement('button');
            view_button.innerText = 'View';
            view_button.className = 'inner-card-button btn btn-dark ';
            view_button.setAttribute('id', status[i].product_id+'button');
            view_button.setAttribute("data-toggle", "modal");
            view_button.setAttribute("data-target", "#modal"+ status[i].product_id);
            view_button.setAttribute('onselect', 'hide_view_button(this.id)');
            view_button.setAttribute('onclick', 'hide_view_button(this.id)');
            
            col_name.appendChild(name);
            col_price.appendChild(price);
            name_price_row.appendChild(col_name);
            name_price_row.appendChild(col_price);

            card.appendChild(view_button);
            card.appendChild(name_price_row);

            col.appendChild(card);
            row.appendChild(col);
            container.appendChild(row);






            //modals
            var card_modals = document.createElement('div')
            card_modals.className = 'modal bd-example-modal-lg fade';
            card_modals.setAttribute('id', 'modal' + status[i].product_id);
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
            header_text.innerText = (status[i].product_name.toUpperCase());
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
            
            var modal_img_row = document.createElement('div');
            modal_img_row.className = 'row';

            var modal_main_img_col = document.createElement('div');
            modal_main_img_col.className = 'col-sm-8'

            var modal_other_img_col = document.createElement('div');
            modal_other_img_col.className = 'col-sm-4'

            //////////////modal body elements/////////////////////
            var modal_image = document.createElement('img');
            modal_image.src = '../images/'+ status[i].image1;
            modal_image.className = 'img-fluid';
            

            var modal_other_image_1 = document.createElement('img');
            modal_other_image_1.src = '../images/'+ status[i].image2;
            modal_other_image_1.className = 'img-fluid';

            var modal_other_image_2 = document.createElement('img');
            modal_other_image_2.src = '../images/'+ status[i].image3;
            modal_other_image_2.className = 'img-fluid';
           

            var madal_price = document.createElement('h2');
            madal_price.innerText = '$ '+ status[i].price;
            madal_price.style.color = 'red';

            var modal_description = document.createElement('p');
            modal_description.innerText = status[i].brief_desc;
            ///////////////////////////////////////////////////
            ///////////appedind modal body elements////////////
            modal_other_img_col.appendChild(modal_other_image_1);
            modal_other_img_col.appendChild(modal_other_image_2);
            modal_main_img_col.appendChild(modal_image);
            modal_img_row.appendChild(modal_main_img_col);
            modal_img_row.appendChild(modal_other_img_col);
            modal_body.appendChild(modal_img_row);
            modal_body.appendChild(madal_price);
            modal_body.appendChild(modal_description);
            ///////////////////////////////////////////////////
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
    });
}