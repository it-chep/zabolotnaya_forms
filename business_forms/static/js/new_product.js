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


    // Обработчик ввода текста в поле "Другое"
    $('.another-input').on('input', function () {
        const $checkbox = $(this).closest('.many-checkbox-button').find('input[type="checkbox"]');
        const $fieldContainer = $(this).closest('.field_inline_item_container');

        if ($(this).val().trim()) {
            $checkbox.prop('checked', true);
            $fieldContainer.removeClass('invalid')
                .find('.field_item_warning_container').hide();
        }
    });


// Обработчик изменения самого инпута
    $('.submit_button').click(function (e) {
        e.preventDefault();

        const $button = $(this);

        $button.css({'opacity': '0.7', 'pointer-events': 'none'});
        $button.find('.submit_text').text('Отправка...');

        let isValid = true;
        const formData = $('form').serializeArray();
        const formDataObj = {};

        $('.many-checkbox-button').each(function () {
            const $filed = $(this);
            const fieldName = $filed.find('.many-checkbox-button__input').attr('name')
            const $checkbox = $filed.find('input[type="checkbox"]');
            const val = $filed.val().trim();
            if (val === 'on') {
                return
            }
            if ($checkbox.prop('checked') && val) {
                formData.push({name: fieldName, value: val})
            }
        })

        let has_bought_products = []
        // Конвертируем formData в объект
        $.each(formData, function (i, field) {
            if (field.name === 'has_bought_products') {
                has_bought_products.push(field.value)
                return
            }

            formDataObj[field.name] = field.value;
        });

        formDataObj['has_bought_products'] = JSON.stringify(has_bought_products);

        console.log('formDataObj', formDataObj,)
        // Проверка обязательных полей
        $('form input[required]').each(function () {
            const $field = $(this);
            const $fieldInputContainer = $field.closest('.field_inline_item_container');
            const $line = $field.closest('.input_container').find('.line');
            const $fieldWarningContainer = $fieldInputContainer.find('.field_item_warning_container');
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