$(document).ready(function () {
    $('.input_container input').each(function () {
        const $fieldInputContainer = $(this).closest('.field_inline_item_container');
        const $line = $(this).closest('.input_container').find('.line')
        if ($(this).length) {
            if ($(this).attr('type') === 'checkbox') {
                $(this).addClass('checkbox');
                $line.remove()
            }
        }
        const $fieldWarningContainer = $fieldInputContainer.find('.field_item_warning_container');
        $(this).on('blur', function () {

            if (!$(this).val() && $(this).prop('required')) {
                $fieldInputContainer.addClass('invalid');
                $line.addClass('invalid');
                $fieldWarningContainer.css('display', 'block');
            } else {
                $fieldInputContainer.removeClass('invalid')
                $line.removeClass('invalid');
                $fieldWarningContainer.css('display', 'none');
            }
        });

        $(this).on('input change', function () {
            $fieldInputContainer.removeClass('invalid')
            $line.removeClass('invalid');
            $fieldWarningContainer.css('display', 'none');
        });
    });

    $('#radio').click(function () {
        const $idPolicyAgreement = $('#id_policy_agreement');
        $idPolicyAgreement.prop('checked', true);

        const $fieldInputContainer = $(this).closest('.field_inline_item_container');
        const $fieldWarningContainer = $fieldInputContainer.find('.field_item_warning_container');
        $fieldInputContainer.removeClass('invalid');
        $fieldWarningContainer.css('display', 'none');
    });

    // Обработчик изменения radio кнопок
    $('input[name="radio-group-1"]').change(function () {
        const $input = $('#id_have_bought_products');
        const $container = $(this).closest('.field_inline_item_container');

        // Сбрасываем ошибки при любом изменении
        $container.removeClass('invalid')
            .find('.field_item_warning_container').hide();

        if ($(this).attr('id') === 'radio_have_bought_products_no') {
            // Если выбрано "Нет" - очищаем поле и делаем его неактивным
            $input.val('').prop('disabled', true);
        } else if ($(this).attr('id') === 'radio_have_bought_products_another') {
            // Если выбрано "Другое" - активируем поле для ввода
            $input.prop('disabled', false).focus();
        }
    });


// Обработчик изменения самого инпута
    $('#id_have_bought_products').on('input change', function () {
        const $container = $(this).closest('.field_inline_item_container');

        // Если поле меняется и не пустое - убираем ошибки
        if ($(this).val().trim()) {
            $container.removeClass('invalid')
                .find('.field_item_warning_container').hide();
        }
    });
    $('.submit_button').click(function (e) {
        e.preventDefault();

        const $button = $(this);

        $button.css({'opacity': '0.7', 'pointer-events': 'none'});
        $button.find('.submit_text').text('Отправка...');

        let isValid = true;
        const formData = $('form').serializeArray();
        const formDataObj = {};

        // Конвертируем formData в объект
        $.each(formData, function (i, field) {
            formDataObj[field.name] = field.value;
        });

        // Проверка обязательных полей
        $('form input[required]').each(function () {
            const $field = $(this);
            const $fieldInputContainer = $field.closest('.field_inline_item_container');
            const $line = $field.closest('.input_container').find('.line');
            const $fieldWarningContainer = $fieldInputContainer.find('.field_item_warning_container');
            if ($field.attr('id') === 'id_have_bought_products') {
                return true
            }
            // Обычная проверка для других полей
            if (!$field.val() && $field.prop('required')) {
                $fieldInputContainer.addClass('invalid');
                $line.addClass('invalid');
                $fieldWarningContainer.css('display', 'block');
                isValid = false;
            } else {
                $fieldInputContainer.removeClass('invalid');
                $line.removeClass('invalid');
                $fieldWarningContainer.css('display', 'none');
            }
        });

        if ($("#radio_have_bought_products_no").is(":checked")) {
            formDataObj["have_bought_products"] = "нет";
        } else if ($("#radio_have_bought_products_another").is(":checked")) {
            formDataObj["have_bought_products"] = $("#id_have_bought_products").val();
        }

        // Проверка чекбокса политики
        const $idPolicyPolicy = $('#id_policy_agreement');
        if (!$idPolicyPolicy.prop('checked')) {
            const $fieldInputContainer = $idPolicyPolicy.closest('.field_inline_item_container');
            const $fieldWarningContainer = $fieldInputContainer.find('.field_item_warning_container');
            $fieldInputContainer.addClass('invalid');
            $fieldWarningContainer.css('display', 'block');
            isValid = false;
        }
        formDataObj["policy_agreement"] = $idPolicyPolicy.prop('checked');

        if (!isValid) {
            resetButtonState($button);
            return false;
        }

        $.ajax({
            type: 'POST',
            url: $('form').attr('action'),
            data: formDataObj,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    window.location.href = response.redirect_url;
                } else {
                    $.each(response.errors, function (field, errors) {
                        const $field = $('[name=' + field + ']');
                        const $fieldInputContainer = $field.closest('.field_inline_item_container');
                        const $fieldWarningContainer = $fieldInputContainer.find('.field_item_warning_container');
                        $fieldInputContainer.addClass('invalid');
                        $fieldWarningContainer.html(errors.join('<br>')).css('display', 'block');
                    });

                    if (Object.keys(response.errors).length > 0) {
                        const firstErrorField = Object.keys(response.errors)[0];
                        const $firstErrorElement = $('[name=' + firstErrorField + ']');
                        $('html, body').animate({
                            scrollTop: $firstErrorElement.offset().top - 100
                        }, 500);
                    }
                    resetButtonState($button);
                }
            },
            error: function (xhr, status, error) {
                console.error('Ошибка при отправке формы:', status, error);
                resetButtonState($button);
            }
        });
    });

    // Сброс состояния кнопки
    function resetButtonState($button) {
        $button.css({'opacity': '1', 'pointer-events': 'auto'});
        $button.find('.submit_text').text('Отправить');
    }

    $('.clear_inline_container').click(function () {
        $('form')[0].reset();
        $('.input_container').removeClass('invalid');
        $('input[name="radio-group"]').prop('checked', false);
        $('#id_have_bought_products').prop('disabled', false);
    });
});