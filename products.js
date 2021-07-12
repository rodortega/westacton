$(document).ready(function() {
    loadProducts();
    loadSales();
});

function loadProducts() {

    var products_row = $('.products-row');
    var products_data = "";

    products_row.html('Loading Products <i class="fa fa-spinner fa-spin"></i>');

    $.ajax({
        method: "GET",
        url: "php/get_products.php",
    })
    .done(function(response) {
        if (response.success === true) {
            populateProductsTable(response.data);
            populateProductsOption(response.data);
        }
        else {
            products_row.html('No products to display.');
        }
    })
    .fail(function(xhr, textStatus, errorThrown) {
        window.alert(errorThrown);
    });
}

function loadSales() {

    var sales_row = $('.sales-row');
    var products_data = "";

    sales_row.html('Loading Sales History <i class="fa fa-spinner fa-spin"></i>');

    $.ajax({
        method: "GET",
        url: "php/get_sales.php",
    })
    .done(function(response) {
        if (response.success === true) {
           
           var table_data = '';
           var summary_total = 0;

            $.each(response.data, function (index, sale){
                table_data +=
                '<tr>' +
                    '<td>' + sale.product_name + '</td>' +
                    '<td class="text-right">' + sale.quantity + '</td>' +
                    '<td class="text-right">' + sale.price + '</td>' +
                    '<td class="text-right">' + (parseFloat(sale.price) * parseFloat(sale.quantity)).toFixed(2) + '</td>' +
                '</tr>';

                summary_total += parseFloat(sale.price) * parseFloat(sale.quantity);
            });

            table_data +=
                '<tr>' +
                    '<td><b>Total Sales</b></td>' +
                    '<td class="text-right"></td>' +
                    '<td class="text-right"></td>' +
                    '<td class="text-right"><b>' + summary_total.toFixed(2) + '</b></td>' +
                '</tr>';

            $('.sales-row').html(table_data);
        }
        else {
            sales_row.html('No sales to display.');
        }
    })
    .fail(function(xhr, textStatus, errorThrown) {
        window.alert(errorThrown);
    });
}

function populateProductsTable(products_data) {

    var table_data = '';

    $.each(products_data, function (index, product){
        table_data +=
        '<tr>' +
            '<td>' + product.product_name + '</td>' +
            '<td class="text-right">' + product.stock + '</td>' +
            '<td class="text-right">' + product.price + '</td>' +
            '<td><button class="btn btn-default btn-sm edit-product-button" data-product="' + product.product_name + '" data-id="' + product.id + '" data-quantity="' + product.stock + '" data-price="' + product.price + '"><i class="fa fa-edit"></i> Edit</td>' +
        '</tr>';
    });

    $('.products-row').html(table_data);
}

function populateProductsOption(products_data) {

    var form_data = '<option value=""> Select Product..</option>';

    $.each(products_data, function (index, product){
        form_data +=
        '<option value="' + product.id + '" data-quantity="' + product.stock + '" data-price="' + product.price + '">' + product.product_name + '</option>';
    });

    $('.products-option').html(form_data);
}

function computeSummary() {

    $('.summary-price').html('');

    var rows = $('.summary-row').find('.price-cell');
    var total = 0;

    $.each(rows, function (index, value) {
        total += parseInt($(value).html());
    });

    if (rows.length == 0) {
        $('.btn-generate-button').attr('disabled', true);
    }

    else {
        $('.btn-generate-button').attr('disabled', false);
    }

    $('.summary-price').html(total);
}

$('.products-option').on('change', function() {

    var quantity_input = $('.products-option-quantity');
    var add_product_button = $('.products-button-add');
    var products_option = $(this);
    var max = $(this).find(':selected').data('quantity');
    var error_display = $('.sale-error-message');

    quantity_input.val('');
    add_product_button.attr('disabled', true);
    error_display.addClass('d-none');

    if ($(this).val() != "") {
        quantity_input.attr('disabled', false);
        quantity_input.data('max', max);
    } else {
        quantity_input.attr('disabled', true);
        add_product_button.attr('disabled', true);
    }

    if (max == 0) {
        error_display.removeClass('d-none').html('This product is out of stock');
        quantity_input.attr('disabled', true);
        add_product_button.attr('disabled', true);
    }
});

$('.products-option-quantity').bind('keyup mouseup', function () {

    $('.sale-error-message').addClass('d-none');
    
    var quantity_input = $('.products-option-quantity');
    var max = $(quantity_input).data('max');
    var add_product_button = $('.products-button-add');

    if (quantity_input.val() == "") {
        add_product_button.attr('disabled', true);
    }

    else if (quantity_input.val() > max) {
        $('.sale-error-message').removeClass('d-none').html('Maximum quantity is ' + max);
        add_product_button.attr('disabled', true);
    }

    else {
        add_product_button.attr('disabled', false);
    }
});

$('.products-button-add').on('click', function() {

    var products_option = $('.products-option');
    var quantity_input = $('.products-option-quantity');
    var total_price = parseInt(quantity_input.val()) * parseInt(products_option.find(':selected').data('price'));
    var add_product_button = $('.products-button-add');

    var table_data = '';

    table_data +=
    '<tr class="product-summary-row product-summary-'+ products_option.val() +'">' +
        '<td class="id-cell d-none">' + products_option.val() + '</td>' +
        '<td>' + products_option.find(':selected').html() + '</td>' +
        '<td class="text-right quantity-cell">' + quantity_input.val() + '</td>' +
        '<td class="text-right price-cell">' + total_price + '</td>' +
        '<td><button class="btn btn-danger btn-sm remove-product-button" data-id="'+  products_option.val() +'"><i class="fa fa-remove"></i> Remove</button></td>' +
    '</tr>';

    $('.summary-row').append(table_data);

    products_option.find(':selected').attr('disabled', true);
    products_option.prop('selectedIndex', 0);

    quantity_input.val('');
    quantity_input.attr('disabled', true);
    add_product_button.attr('disabled', true);

    computeSummary();
});

$('.btn-generate-button').on('click', function() {

    var rows = $('.product-summary-row');
    var data = {};

    $.each(rows, function (index, row) {
        var id = $(row).children('.id-cell').text();
        var quantity = $(row).children('.quantity-cell').text();

        data[id] = quantity;
    });

    var string_data = JSON.stringify(data);

    $.ajax({
        method: "POST",
        data: {order: string_data},
        url: "php/add_sale.php",
    })
    .done(function(response) {
        if (response.success === true) {

            loadProducts();

            window.alert('Sale added succesfully.');

            $('#modal-add-sale').modal('hide');
            $('.summary-row').empty();

            $('.summary-price').html('');
        } else {
            window.alert(response.message);
        }
    })
    .fail(function(xhr, textStatus, errorThrown) {
        window.alert(errorThrown);
    });
});

$(document).on('click', '.remove-product-button', function() {

    $('.product-summary-' + $(this).data('id')).remove();
    $('.products-option').find('[value="' + $(this).data('id') + '"]').attr('disabled', false);

    computeSummary();
});

$(document).on('click', '.edit-product-button', function() {

    $('#modal-edit-product').modal('show');

    var edit_button = $(this);

    $('#edit-id').val(edit_button.data('id'));
    $('#edit-product').html(edit_button.data('product'));
    $('#edit-stock').val(edit_button.data('quantity'));
    $('#edit-price').val(edit_button.data('price'));
});

$('.btn-save-product').on('click', function () {

    $.ajax({
        method: "POST",
        url: "php/save_products.php",
        data: {
            'id' : $('#edit-id').val(),
            'stock': $('#edit-stock').val(),
            'price': $('#edit-price').val()
        }
    })
    .done(function(response) {
        $('#modal-edit-product').modal('hide');
        loadProducts();
    })
    .fail(function(xhr, textStatus, errorThrown) {
        window.alert(errorThrown);
    });
});