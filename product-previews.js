const previews=document.querySelector('#product-previews');
const open=document.querySelector('#open-previews');
const close=document.querySelector('#close-previews');
open.addEventListener('click',()=>{previews.showModal();document.body.style.overflow='hidden'});
close.addEventListener('click',()=>previews.close());
previews.addEventListener('close',()=>{document.body.style.overflow='';open.focus()});
previews.addEventListener('click',event=>{if(event.target===previews){const bounds=previews.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)previews.close()}});
