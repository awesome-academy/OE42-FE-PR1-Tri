function loadBuysProduct() {
    $.ajax({
        url: "./js/db.json",
        type: "GET",
        dataType: "JSON",
        contentType: "application/json",
        success: function(data){
            $(".product-items").empty();
            $.each(data["product-buys"], function(index,value){
                $(".product-items").append(
                    `
                        <li class="item">
                            <div class="img">
                                <img src=${value["img"]} />
                            </div>
                            <div>
                                <span class="name-product">${value["name"]}</span>
                                <div class="rating-box">
                                    <span class="rating"></span>
                                </div>
                                <span class="price">${value["price"]}</span>
                            </div>
                        </li>
                    `
                )    
            })
            cssRatingBox(".product-items .rating-box", ".product-items .rating-box .rating")
            cssBuysProduct();
        }
    })
}

function loadSaleProduct(){
    $.ajax({
        url: "./js/db.json",
        type: "GET",
        dataType: "JSON",
        contentType: "application/json",
        success: function(data){
            $(".product-items-sale").empty();
            $.each(data["sale-product"], function(index,value){
                $(".product-items-sale").append(
                    `
                        <li class="item col-12 col-sm-6 col-lg-4">
                            ${loadProducts(value)}
                        </li>
                    `
                )
            })
        }
    })
}

function loadNewProduct(){
    $.ajax({
        url: "./js/db.json",
        type: "GET",
        dataType: "JSON",
        contentType: "application/json",
        success: function(data){
            $(".new-products-item").empty();
            $.each(data["new-product"], function(index,value){
                $(".new-products-item").append(
                    `
                        <li class="item col-12 col-sm-6 col-lg-4 col-xl-3">
                            ${loadProducts(value)}
                        </li>
                    `
                )
            })
        }
    })
}

function loadProducts(params){
    return `
        <div class="wrapper">
            <div class="img">
                <img src=${params["img"]} alt="link error"/>
                <span class=${params["span_class"]}>${params["span_text"]}</span>
                <div>
                    <button onClick="buttonBuyNow('${params['id']}', '${params['img']}', '${params['name']}', '${params['price_new']}', 1)">Mua ngay</button>
                    <a href="/detail-product.html"><i class="fas fa-search"></i></a>
                </div>
            </div>
            <div class="des">
                <span class="name-product">${params["name"]}</span>
                <div class="rating-box">
                    <span class="rating"></span>
                </div>
                <div class="price">
                    <span class="price-new">${params["price_new"]}</span>
                    <span class="price-old">${params["price_old"]}</span>
                </div>
            </div>
        </div>
    `;
}

//buy product
const KEY_BUY_ITEM = "cart";
function buttonBuyNow(id, img, name_product, money, count){
    if(id != "" && img != "" && name_product != "" && money != "" && count >=1){
        var obj = {};
        obj.id = id;
        obj.img = img;
        obj.name_product = name_product;
        obj.money = money;
        obj.count = count;
        if(localStorage.getItem(KEY_BUY_ITEM) == null){
            var arr = [];
            arr.push(obj);
            var json_arr = JSON.stringify(arr);
            localStorage.setItem(KEY_BUY_ITEM, json_arr);
        }else{
            var json = localStorage.getItem(KEY_BUY_ITEM);
            var arr = JSON.parse(json);
            var check = true;
            for(var item of arr){
                if(item.id == obj.id){
                    item.count += obj.count;
                    check = false;
                }
            }
            if(check){
                arr.push(obj);
            }
            var json_arr = JSON.stringify(arr);
            localStorage.setItem(KEY_BUY_ITEM, json_arr);
        }
        toast(article_toast, {title: 'Thành công!', message: "Thêm vào giỏ hàng thành công", type: "success", duration: 3000});
    }else{
        toast(article_toast, {title: 'Thất bại!', message: "Thêm vào giỏ hàng thất bại", type: "error", duration: 1000});
    }
}

//Toast Message
var article_toast = document.querySelector("#article__toast");
var article_toast_smg_cart = document.querySelector("#article__toast_msg");
function toast(dom_id, {title = '', message = '', type = 'success', duration = 3000}){
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle'
    };
    
    const icon = icons[type];
    const delay = (duration / 1000).toFixed(2);
    const toast = document.createElement('div');
    toast.classList.add('toast', `toast__${type}`);
    toast.style.animation = `slideInLeft ease 0.3s, fadeOut linear 1s ${delay}s forwards`;
    toast.innerHTML = 
        `
            <div class="toast__icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="toast__body"> 
                <h3 class="toast__title">${title}</h3>
                <p class="toast__msg">${message}</p>
            </div>
            <div class="toast__close">
                <i class="fas fa-times"></i>
            </div>
        `;
    dom_id.appendChild(toast);
    const autoRemoveId = setTimeout(function(){
        dom_id.removeChild(toast);
    }, duration + 1000);
    toast.onclick = function(e){
        if(e.target.closest('.toast__close')){
            dom_id.removeChild(toast);
            clearTimeout(autoRemoveId);
        }
    }
}

//icon số lượng sản phẩm đã đặt
function headerCart(){
    const header_cart = document.querySelector('.header__cart');
    if(localStorage.getItem(KEY_BUY_ITEM) != null){
        header_cart.innerHTML = '';
        const json_arr = localStorage.getItem(KEY_BUY_ITEM);
        const count = JSON.parse(json_arr).length;
        header_cart.innerHTML = `
            <a href="/cart.html" >
                <i class="fas fa-shopping-basket"></i>
                ${count} Sản Phẩm
            </a>
        `;     
    }
}

//hàm vẽ tất cả sản phẩm trong giỏ hàng đã đặt
function loadCart(){
    const cart_body = document.querySelector('.info-cart-table > tbody');
    cart_body.innerHTML = '';
    const cart_button = document.querySelector('.button');
    const cart_table_price = document.querySelector('.table-price');
    if(localStorage.getItem(KEY_BUY_ITEM) == null){
        cart_button.style.display = 'none';
        cart_table_price.style.display = 'none';
        cart_body.innerHTML = `
            <tr>
                <td style="width: 100%; text-align:center; height:200px">Chưa có sản phẩm nào được thêm vào</td>
            </tr>
        `
    }
    else{
        const json_arr = localStorage.getItem(KEY_BUY_ITEM);
        const arr = JSON.parse(json_arr);
        var sum_money = 0;
        arr.map((a, i)=>{
            cart_body.innerHTML +=
            `
                <tr>
                    <td class="img"><img src=${a.img} alt="link error"></td>
                    <td class="name-product">${a.name_product}</td>
                    <td class="unit-price">${a.money}</td>
                    <td class="count">
                      <input type="text" value="${a.count}" onchange="onchangeProductCount('${a.id}','${a.money}', event)">
                    </td>
                    <td class="into-money into-money-${a.id}">${intoMoney(`'${a.money}'`, `${a.count}`).toLocaleString()} đ</td>
                    <td class="delete"><a href="javascript:void(0)" onclick = "deleteProduct('${a.id}')"><i class="fas fa-trash-alt"></i></a></td>
                </tr>
            `
            sum_money += intoMoney(`'${a.money}'`, `${a.count}`);
        })
        const cancel_order = document.querySelector('.cancel-order');
        cancel_order.addEventListener('click', cancelOrder);
        tablePrice(sum_money);
    }
    
}

function intoMoney(money, count){
    var str = "";
    for(var i = 0; i< money.length; i++){
        if(Number(money[i]) >= 0){
            str += money[i];
        }
    }
    var total = str * count;
    return total;
}

function sumPrice(){
    const json_arr = localStorage.getItem(KEY_BUY_ITEM);
    const arr = JSON.parse(json_arr);
    let sum = 0;
    for(var item of arr){
        sum +=  intoMoney(item.money, item.count);
    }
    return sum;
}

//hàm vẽ lại tổng tiền, thuế, tổng tiền phải trả
function tablePrice(sumPrice){
    const table_price = document.querySelector('.table-price tbody');
    const button_payment = document.querySelector('.table-price button');
    table_price.innerHTML = `
        <tr> 
            <td>Tổng tiền (Chưa thuế) </td>
            <td id="sum-price">${sumPrice.toLocaleString()} đ</td>
        </tr>
        <tr> 
            <td>Thuế (VAT 10%)</td>
            <td id="tax">${(sumPrice / 100 * 10).toLocaleString()} đ</td>
        </tr>
        <tr> 
            <td>Tổng phải thanh toán</td>
            <td id="payment-sum">${(sumPrice - (sumPrice / 100 * 10)).toLocaleString()} đ</td>
        </tr>
    `
    button_payment.setAttribute('onclick',`payment()`);
}

//hàm thay đổi số lượng sản phẩm
function onchangeProductCount(id, money, event){
    const into_money_id = document.querySelector(`.into-money-${id}`);
    const sum_price = document.querySelector('#sum-price');
    const tax = document.querySelector('#tax');
    const payment_sum = document.querySelector('#payment-sum');
    const button_payment = document.querySelector('.table-price button');

    const count = event.target.value;
    const json_arr = localStorage.getItem(KEY_BUY_ITEM);
    const arr = JSON.parse(json_arr);
    into_money_id.innerHTML = intoMoney(money, count).toLocaleString() + " đ";
    for(var item of arr){
        if(item.id == id){
            item.count = count;
        }
    }
    let sum = 0;
    for(var item of arr){
        sum += intoMoney(item.money, item.count);
    }
    sum_price.innerHTML = sum.toLocaleString() + " đ";
    tax.innerHTML = (sum / 100 * 10).toLocaleString() + " đ";
    payment_sum.innerHTML = (sum - (sum / 100 * 10)).toLocaleString() + " đ";
    button_payment.setAttribute('onclick',`payment()`);
    const new_arr_json = JSON.stringify(arr);
    localStorage.setItem(KEY_BUY_ITEM, new_arr_json);
}

//hàm xóa sản phẩm theo id
function deleteProduct(id){
    const json_arr = localStorage.getItem(KEY_BUY_ITEM);
    const arr = JSON.parse(json_arr);
    bootbox.confirm({
        message: `Bạn thật sự muốn xóa sản phầm có id = ${id} này!`,
        buttons: {
            confirm: {
                label: 'Chấp nhận',
                className: 'btn-success'
            },
            cancel: {
                label: 'Hủy',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if(result){
                for(var i = 0; i < arr.length; i++){
                    if(arr[i].id == id){
                        arr.splice(i, 1);
                    }
                }
                if(arr.length > 0){
                    localStorage.setItem(KEY_BUY_ITEM, JSON.stringify(arr));
                }else{
                    localStorage.removeItem(KEY_BUY_ITEM);
                }
                toast(article_toast_smg_cart, {title: 'Thành công!', message: "Xóa sản phẩm thành công", type: "success", duration: 3000});
                setTimeout(function(){
                    location.replace("/cart.html");
                },1000); 
            }else{
                toast(article_toast_smg_cart, {title: 'Thất bại!', message: "Xóa sản phẩm thất bại", type: "error", duration: 1000});
            }
            
        }
    });
    console.log(arr);
}

//hàm hủy tất cả sản phẩm đã thêm vào giỏ hàng
function cancelOrder(){
    bootBoxConfirmInCancelOrder();
}
function bootBoxConfirmInCancelOrder(){
    bootbox.confirm({
        message: "Bạn thật sự muốn hủy đơn hàng này!",
        buttons: {
            confirm: {
                label: 'Chấp nhận',
                className: 'btn-success'
            },
            cancel: {
                label: 'Hủy',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if(result){
                toast(article_toast_smg_cart, {title: 'Thành công!', message: "Hủy đơn hàng thành công", type: "success", duration: 3000});
                localStorage.removeItem(KEY_BUY_ITEM);
                setTimeout(function(){
                    location.replace("/cart.html");
                },1000);                
            }else{
                toast(article_toast_smg_cart, {title: 'Thất bại!', message: "Hủy đơn hàng thất bại", type: "error", duration: 1000});
            }
            
        }
    });
}
function payment(){
    const section__cart_content = document.querySelector('.section__cart-content');
    const section__process_pay = document.querySelector('.section__process-pay');
    const info_cart = document.querySelector('#info-cart');
    const info_cart_span = document.querySelector('#info-cart span');
    const info_customer = document.querySelector('#info-customer');
    const info_customer_span = document.querySelector('#info-customer span');
     bootbox.confirm({
        message: "Bạn thật sự muốn thanh toán!",
        buttons: {
            confirm: {
                label: 'Chấp nhận',
                className: 'btn-success'
            },
            cancel: {
                label: 'Hủy',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if(result){
                info_cart.style.background = '#fff';
                info_cart.style.color = '#090909'
                info_cart_span.style.background = '#fff';
                info_customer.style.background = '#3fb871';
                info_customer.style.color = '#fff';
                info_customer_span.style.background = '#3fb871';
                section__cart_content.style.display = 'none';
                section__process_pay.style.display = 'block';                
            }else{
                toast(article_toast_smg_cart, {title: 'Thất bại!', message: "Thanh toán không thành công", type: "error", duration: 1000});
            }
            
        }
    });
}

function onsubmitFormCustomer(event){
    var obj = {};
    obj['name-customer'] = event.target['name-customer'].value;
    obj['phone-customer'] = event.target['phone-customer'].value;
    obj['email-customer'] = event.target['email-customer'].value;
    obj['address-customer'] = event.target['address-customer'].value;
    event.preventDefault();
    const form__customer = document.querySelector('#form__customer');
    const confirm_info_order = document.querySelector('.confirm-info-order');
    const info_customer = document.querySelector('#info-customer');
    const info_customer_span = document.querySelector('#info-customer span');
    const confirm_pay = document.querySelector('#confirm-pay');
    const confirm_pay_span = document.querySelector('#confirm-pay span');
    form__customer.style.display = 'none';
    confirm_info_order.style.display = 'block';
    info_customer.style.background = '#fff';
    info_customer.style.color = '#090909';
    info_customer_span.style.background = '#fff';
    confirm_pay.style.color = '#fff'
    confirm_pay.style.background = '#3fb871';
    confirm_pay_span.style.background = '#3fb871';
    infoPayment({obj});
   
}
function infoPayment({obj}){
    const info_order = document.querySelector('.confirm-info-order .info-order');
    info_order.innerHTML = '';
    info_order.innerHTML = `
        <p id="name">Tên khách hàng: <span>${obj['name-customer']}</span></p>
        <p id="phone">Số ĐT: <span>${obj['phone-customer']}</span></p>
        <p id="email">Email: <span>${obj['email-customer']}</span></p>
        <p id="address">Địa chỉ nhận hàng: <span>${obj['address-customer']}</span></p> 
        <p id="sum-price-confirm">Tổng tiền(chưa thuế): <span>${sumPrice().toLocaleString()} đ</span></p>
        <p id="tax-confirm">Thuế(VAT 10%): <span>${(sumPrice() / 100 * 10).toLocaleString()} đ</span></p>
        <p id="sum-pay-confirm">Tổng phải thanh toán: <span>${(sumPrice() - (sumPrice() /100 * 10)).toLocaleString()} đ</span></p>
    `;
    confirmOrder({obj})
}
function confirmOrder({obj}){
    const confirm_order = document.querySelector('#confirm-order');
    const json_arr = localStorage.getItem(KEY_BUY_ITEM);
    const arr = JSON.parse(json_arr);
    obj.order = arr;
    confirm_order.onclick = function(){
        bootbox.confirm({
            message: "Bạn thật sự muốn xác nhận đơn hàng này!",
            buttons: {
                confirm: {
                    label: 'Chấp nhận',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'Hủy',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if(result){
                    $.ajax({
                        url: "./js/order.json",
                        type: "GET",
                        dataType: "JSON",
                        contentType: "application/json",
                        data: JSON.stringify(obj),
                        success: function(data){
                            console.log(data['message']);
                        }
                    }).done(function(){
                        toast(article_toast_smg_cart, {title: 'Thành công!', message: "Xác nhận đơn hàng thành công", type: "success", duration: 3000});
                        localStorage.removeItem(KEY_BUY_ITEM);
                        setTimeout(function(){
                            location.replace("/cart.html");
                        },2000);
                    }).fail(function(){
                        toast(article_toast_smg_cart, {title: 'Thất bại!', message: "Xác nhận đơn hàng thất bại", type: "error", duration: 1000});
                    });                                   
                }else{
                    toast(article_toast_smg_cart, {title: 'Thất bại!', message: "Xác nhận đơn hàng thất bại", type: "error", duration: 1000});
                }
                
            }
        });
    }
}



function cssBuysProduct(){
    $('.product-items .rating-box').css('margin-left','0px')
    $('.product-items img').css('width','75px');
    $('.product-items .name-product').css('font-size','0.9rem')
    $('.product-items .price').css({'font-size': '1.125rem', 'color': '#dc3545'});
}

function cssRatingBox(ratingBox, rating){
    $(`${ratingBox}`).css({
        'width': '68px',
        'height': '11px',
        'overflow': 'hidden',
        'background': "url('../assets/images/bkg_rating_hover.png') repeat-x scroll",
        'margin': '0.25rem auto'
    })
    $(`${rating}`).css({
        'height': '100%',
        'background': "url('../assets/images/bkg_rating_hover.png') repeat-x scroll 0 100%",
        'width': '93%',
        'display': 'block'
    })
}

function init(){
    loadBuysProduct();
    loadSaleProduct();
    loadNewProduct();
    headerCart();
    loadCart();  
}
$(document).ready(function(){
    init();
})