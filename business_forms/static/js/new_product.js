$(document).ready(function () {
    const today = new Date();
    const hundredYearsAgo = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());

    $('.datepicker').datepicker({
        format: 'dd.mm.yyyy',
        language: 'ru',
        autoclose: true,
        todayHighlight: true,
        endDate: today,
        startDate: hundredYearsAgo
    });

    $('#id_birth_date').on('input', function (e) {
        var input = $(this).val();
        input = input.replace(/[^0-9.]/g, '');
        if (input.length >= 2 && input.charAt(2) !== '.') {
            input = input.slice(0, 2) + '.' + input.slice(2);
        }
        if (input.length >= 5 && input.charAt(5) !== '.') {
            input = input.slice(0, 5) + '.' + input.slice(5);
        }
        if (input.length > 10) {
            input = input.slice(0, 10);
        }
        $(this).val(input);
    });

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

    // Обработчик для кнопки отправки
    $('.submit_button').on('click', function (e) {
        e.preventDefault();

        const $button = $(this);
        const $form = $('form');

        $button.css({'opacity': '0.7', 'pointer-events': 'none'});
        $button.find('.submit_text').text('Отправка...');

        let isValid = true;
        $form.find('[required]').each(function () {
            const $field = $(this);
            const $container = $field.closest('.field_inline_item_container');

            if (!$field.val() || ($field.is(':checkbox') && !$field.is(':checked'))) {
                $container.addClass('invalid');
                $container.find('.field_item_warning_container').show();
                isValid = false;
            }
        });

        if (!isValid) {
            resetButtonState($button);
            return;
        }

        $.ajax({
            type: 'POST',
            url: $form.attr('action'),
            data: $form.serialize(),
            dataType: 'json',
            success: function (response) {
                console.log('Ответ сервера:', response);
                if (response.success) {
                    window.location.href = response.redirect_url;
                } else {
                    showErrors(response.errors);
                    resetButtonState($button);
                }
            },
            error: function (xhr) {
                console.error('Ошибка запроса:', xhr.responseText);
                resetButtonState($button);
            }
        });
    });

    // Сброс состояния кнопки
    function resetButtonState($button) {
        $button.css({'opacity': '1', 'pointer-events': 'auto'});
        $button.find('.submit_text').text('Отправить');
    }

    // Показать ошибки
    function showErrors(errors) {
        if (!errors) return;

        $('.field_item_warning_container').hide();

        $.each(errors, function (fieldName, messages) {
            const $field = $('[name="' + fieldName + '"]');
            if ($field.length) {
                const $container = $field.closest('.field_inline_item_container');
                $container.addClass('invalid')
                    .find('.field_item_warning_container')
                    .html(messages.join('<br>'))
                    .show();
            }
        });
    }

    // Обработчик для очистки формы
    $('.clear_inline_container').click(function () {
        $('form')[0].reset();
        $('.field_inline_item_container').removeClass('invalid');
        $('.field_item_warning_container').hide();
    });
});